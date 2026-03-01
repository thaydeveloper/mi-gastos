/**
 * @fileoverview Dashboard home page - Server Component with aggregated data.
 */

import { createClient } from '@/lib/supabase/server';
import { SummaryCardsView } from '@/components/dashboard/presentation/SummaryCardsView';
import { SpendingByCategoryChart } from '@/components/dashboard/presentation/SpendingByCategoryChart';
import { SpendingOverTimeChart } from '@/components/dashboard/presentation/SpendingOverTimeChart';
import { RecentExpensesView } from '@/components/dashboard/presentation/RecentExpensesView';
import { startOfMonth, endOfMonth, subMonths, format, getDaysInMonth } from 'date-fns';
import type { SpendingByCategory, SpendingOverTime } from '@/types';

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
    { data: categoryExpenses },
    { data: monthlyExpenses },
    { data: recentExpenses },
  ] = await Promise.all([
    // Current month total
    supabase
      .from('expenses')
      .select('amount')
      .gte('date', currentMonthStart)
      .lte('date', currentMonthEnd),
    // Previous month total
    supabase
      .from('expenses')
      .select('amount')
      .gte('date', prevMonthStart)
      .lte('date', prevMonthEnd),
    // Expenses by category (current month)
    supabase
      .from('expenses')
      .select('amount, categories(name, color)')
      .gte('date', currentMonthStart)
      .lte('date', currentMonthEnd),
    // Monthly totals (last 6 months)
    supabase
      .from('expenses')
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
  const totalMonth = (currentMonthExpenses ?? []).reduce((sum, e) => sum + e.amount, 0);
  const previousMonthTotal = (prevMonthExpenses ?? []).reduce((sum, e) => sum + e.amount, 0);
  const daysInMonth = getDaysInMonth(now);
  const currentDay = Math.min(now.getDate(), daysInMonth);
  const averagePerDay = currentDay > 0 ? totalMonth / currentDay : 0;
  const expenseCount = (currentMonthExpenses ?? []).length;

  // Aggregate spending by category
  const categoryMap = new Map<string, { name: string; color: string; total: number }>();
  (categoryExpenses ?? []).forEach((e) => {
    const cat = e.categories as { name: string; color: string } | null;
    const key = cat?.name ?? 'Sem categoria';
    const existing = categoryMap.get(key);
    if (existing) {
      existing.total += e.amount;
    } else {
      categoryMap.set(key, {
        name: key,
        color: cat?.color ?? '#6b7280',
        total: e.amount,
      });
    }
  });
  const spendingByCategory: SpendingByCategory[] = Array.from(categoryMap.values()).map((c) => ({
    name: c.name,
    color: c.color,
    value: c.total,
  }));

  // Aggregate spending over time
  const monthlyMap = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const m = subMonths(now, i);
    const key = format(m, 'yyyy-MM');
    monthlyMap.set(key, 0);
  }
  (monthlyExpenses ?? []).forEach((e) => {
    const key = e.date.substring(0, 7);
    if (monthlyMap.has(key)) {
      monthlyMap.set(key, monthlyMap.get(key)! + e.amount);
    }
  });
  const spendingOverTime: SpendingOverTime[] = Array.from(monthlyMap.entries()).map(
    ([month, total]) => {
      const [y, m] = month.split('-');
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return {
        month: `${monthNames[parseInt(m, 10) - 1]} ${y.slice(2)}`,
        total,
      };
    },
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Visão geral dos seus gastos
        </p>
      </div>

      <SummaryCardsView
        totalMonth={totalMonth}
        averagePerDay={averagePerDay}
        expenseCount={expenseCount}
        previousMonthTotal={previousMonthTotal}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingByCategoryChart data={spendingByCategory} />
        <SpendingOverTimeChart data={spendingOverTime} />
      </div>

      <RecentExpensesView expenses={recentExpenses ?? []} />
    </div>
  );
}
