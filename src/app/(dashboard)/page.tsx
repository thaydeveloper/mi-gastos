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

  // 3 queries instead of 8 — derive current/prev month from the 6-month range in JS
  const [
    { data: allExpenses },
    { data: allIncomes },
    { data: recentExpenses },
  ] = await Promise.all([
    // All expenses last 6 months with category join (covers monthly chart + category pie + totals)
    supabase
      .from('expenses')
      .select('amount, date, categories(name, color)')
      .gte('date', sixMonthsAgo)
      .lte('date', currentMonthEnd),
    // All incomes last 6 months (covers monthly chart + totals)
    supabase
      .from('incomes')
      .select('amount, date')
      .gte('date', sixMonthsAgo)
      .lte('date', currentMonthEnd),
    // Recent 5 expenses for the table
    supabase
      .from('expenses')
      .select('*, categories(name, color, icon)')
      .order('date', { ascending: false })
      .limit(5),
  ]);

  // --- Derive totals from in-memory data ---
  const currentExpenses = (allExpenses ?? []).filter(
    (e) => e.date >= currentMonthStart && e.date <= currentMonthEnd,
  );
  const prevExpenses = (allExpenses ?? []).filter(
    (e) => e.date >= prevMonthStart && e.date <= prevMonthEnd,
  );
  const currentIncomes = (allIncomes ?? []).filter(
    (e) => e.date >= currentMonthStart && e.date <= currentMonthEnd,
  );
  const prevIncomes = (allIncomes ?? []).filter(
    (e) => e.date >= prevMonthStart && e.date <= prevMonthEnd,
  );

  const totalMonthExpenses = currentExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalMonthIncome = currentIncomes.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalMonthIncome - totalMonthExpenses;
  const previousMonthBalance =
    prevIncomes.reduce((sum, e) => sum + e.amount, 0) -
    prevExpenses.reduce((sum, e) => sum + e.amount, 0);

  // --- Category breakdown (current month only) ---
  const categoryMap = new Map<string, { name: string; color: string; total: number }>();
  currentExpenses.forEach((e) => {
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

  // --- Monthly balance chart (last 6 months) ---
  const expenseMonthlyMap = new Map<string, number>();
  const incomeMonthlyMap = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const key = format(subMonths(now, i), 'yyyy-MM');
    expenseMonthlyMap.set(key, 0);
    incomeMonthlyMap.set(key, 0);
  }
  (allExpenses ?? []).forEach((e) => {
    const key = e.date.substring(0, 7);
    if (expenseMonthlyMap.has(key)) expenseMonthlyMap.set(key, expenseMonthlyMap.get(key)! + e.amount);
  });
  (allIncomes ?? []).forEach((e) => {
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
