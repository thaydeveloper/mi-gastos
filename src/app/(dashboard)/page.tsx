/**
 * @fileoverview Dashboard home page - Server Component with aggregated data.
 */

import { createClient } from '@/lib/supabase/server';
import { SummaryCardsView } from '@/components/dashboard/presentation/SummaryCardsView';
import { SpendingByCategoryChart } from '@/components/dashboard/presentation/SpendingByCategoryChart';
import { SpendingOverTimeChart } from '@/components/dashboard/presentation/SpendingOverTimeChart';
import { RecentExpensesView } from '@/components/dashboard/presentation/RecentExpensesView';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import type { SpendingByCategory, MonthlyBalance } from '@/types';

export const metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const now = new Date();

  const currentMonthStart = format(startOfMonth(now), 'yyyy-MM-dd');
  const currentMonthEnd = format(endOfMonth(now), 'yyyy-MM-dd');
  const prevMonthStart = format(startOfMonth(subMonths(now, 1)), 'yyyy-MM-dd');
  const prevMonthEnd = format(endOfMonth(subMonths(now, 1)), 'yyyy-MM-dd');
  const sixMonthsAgo = format(startOfMonth(subMonths(now, 5)), 'yyyy-MM-dd');

  // Parallel queries for performance
  const [
    { data: currentMonthExpenses },
    { data: prevMonthExpenses },
    { data: currentMonthIncomes },
    { data: prevMonthIncomes },
    { data: categoryExpenses },
    { data: monthlyExpenses },
    { data: monthlyIncomes },
    { data: recentExpenses },
  ] = await Promise.all([
    // Current month expenses total
    supabase.from('expenses').select('amount').gte('date', currentMonthStart).lte('date', currentMonthEnd),
    // Previous month expenses total
    supabase.from('expenses').select('amount').gte('date', prevMonthStart).lte('date', prevMonthEnd),
    // Current month income total
    supabase.from('incomes').select('amount').gte('date', currentMonthStart).lte('date', currentMonthEnd),
    // Previous month income total
    supabase.from('incomes').select('amount').gte('date', prevMonthStart).lte('date', prevMonthEnd),
    // Expenses by category (current month)
    supabase
      .from('expenses')
      .select('amount, categories(name, color)')
      .gte('date', currentMonthStart)
      .lte('date', currentMonthEnd),
    // Monthly expenses (last 6 months)
    supabase
      .from('expenses')
      .select('amount, date')
      .gte('date', sixMonthsAgo)
      .lte('date', currentMonthEnd)
      .order('date'),
    // Monthly incomes (last 6 months)
    supabase
      .from('incomes')
      .select('amount, date')
      .gte('date', sixMonthsAgo)
      .lte('date', currentMonthEnd)
      .order('date'),
    // Recent expenses
    supabase
      .from('expenses')
      .select('*, categories(name, color, icon)')
      .order('date', { ascending: false })
      .limit(5),
  ]);

  // Calculate summary
  const totalMonthExpenses = (currentMonthExpenses ?? []).reduce((sum, e) => sum + e.amount, 0);
  const totalMonthIncome = (currentMonthIncomes ?? []).reduce((sum, e) => sum + e.amount, 0);
  const balance = totalMonthIncome - totalMonthExpenses;
  const prevExpenses = (prevMonthExpenses ?? []).reduce((sum, e) => sum + e.amount, 0);
  const prevIncome = (prevMonthIncomes ?? []).reduce((sum, e) => sum + e.amount, 0);
  const previousMonthBalance = prevIncome - prevExpenses;

  // Aggregate spending by category
  const categoryMap = new Map<string, { name: string; color: string; total: number }>();
  (categoryExpenses ?? []).forEach((e) => {
    const cat = e.categories as { name: string; color: string } | null;
    const key = cat?.name ?? 'Sem categoria';
    const existing = categoryMap.get(key);
    if (existing) {
      existing.total += e.amount;
    } else {
      categoryMap.set(key, { name: key, color: cat?.color ?? '#6b7280', total: e.amount });
    }
  });
  const spendingByCategory: SpendingByCategory[] = Array.from(categoryMap.values()).map((c) => ({
    name: c.name,
    color: c.color,
    value: c.total,
  }));

  // Aggregate monthly balance (income vs expenses, last 6 months)
  const expenseMonthlyMap = new Map<string, number>();
  const incomeMonthlyMap = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const key = format(subMonths(now, i), 'yyyy-MM');
    expenseMonthlyMap.set(key, 0);
    incomeMonthlyMap.set(key, 0);
  }
  (monthlyExpenses ?? []).forEach((e) => {
    const key = e.date.substring(0, 7);
    if (expenseMonthlyMap.has(key)) expenseMonthlyMap.set(key, expenseMonthlyMap.get(key)! + e.amount);
  });
  (monthlyIncomes ?? []).forEach((e) => {
    const key = e.date.substring(0, 7);
    if (incomeMonthlyMap.has(key)) incomeMonthlyMap.set(key, incomeMonthlyMap.get(key)! + e.amount);
  });

  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const monthlyBalance: MonthlyBalance[] = Array.from(expenseMonthlyMap.keys()).map((month) => {
    const [y, m] = month.split('-');
    return {
      month: `${monthNames[parseInt(m, 10) - 1]} ${y.slice(2)}`,
      expenses: expenseMonthlyMap.get(month)!,
      income: incomeMonthlyMap.get(month) ?? 0,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Visão geral das suas finanças
        </p>
      </div>

      <SummaryCardsView
        totalMonthExpenses={totalMonthExpenses}
        totalMonthIncome={totalMonthIncome}
        balance={balance}
        previousMonthBalance={previousMonthBalance}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingByCategoryChart data={spendingByCategory} />
        <SpendingOverTimeChart data={monthlyBalance} />
      </div>

      <RecentExpensesView expenses={recentExpenses ?? []} />
    </div>
  );
}
