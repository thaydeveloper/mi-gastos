/**
 * @fileoverview Logic to aggregate financial data for AI analysis.
 */

import { createClient } from '@/lib/supabase/server';
import { startOfMonth, endOfMonth, format, subMonths } from 'date-fns';

export async function getFinancialSummary() {
  const supabase = await createClient();
  const now = new Date();
  
  const currentMonthStart = format(startOfMonth(now), 'yyyy-MM-dd');
  const currentMonthEnd = format(endOfMonth(now), 'yyyy-MM-dd');
  const lastMonthStart = format(startOfMonth(subMonths(now, 1)), 'yyyy-MM-dd');
  const lastMonthEnd = format(endOfMonth(subMonths(now, 1)), 'yyyy-MM-dd');

  console.log('Fetching financial data for AI...');
  const [
    { data: currentExpenses, error: e1 },
    { data: currentIncomes, error: i1 },
    { data: lastMonthExpenses, error: e2 },
    { data: lastMonthIncomes, error: i2 },
    { data: categories, error: c1 }
  ] = await Promise.all([
    supabase.from('expenses').select('amount, category_id, description').gte('date', currentMonthStart).lte('date', currentMonthEnd),
    supabase.from('incomes').select('amount, source, description').gte('date', currentMonthStart).lte('date', currentMonthEnd),
    supabase.from('expenses').select('amount').gte('date', lastMonthStart).lte('date', lastMonthEnd),
    supabase.from('incomes').select('amount').gte('date', lastMonthStart).lte('date', lastMonthEnd),
    supabase.from('categories').select('id, name')
  ]);

  if (e1 || i1 || e2 || i2 || c1) {
    console.error('Supabase query errors:', { e1, i1, e2, i2, c1 });
  }

  const catMap = new Map((categories || []).map(c => [c.id, c.name]));

  const currentTotalExpenses = (currentExpenses || []).reduce((sum, e) => sum + Number(e.amount), 0);
  const currentTotalIncome = (currentIncomes || []).reduce((sum, i) => sum + Number(i.amount), 0);
  const lastTotalExpenses = (lastMonthExpenses || []).reduce((sum, e) => sum + Number(e.amount), 0);
  const lastTotalIncome = (lastMonthIncomes || []).reduce((sum, i) => sum + Number(i.amount), 0);

  const expensesByCategory = (currentExpenses || []).reduce((acc: Record<string, number>, e) => {
    const catName = catMap.get(e.category_id as string) || 'Outros';
    acc[catName] = (acc[catName] || 0) + Number(e.amount);
    return acc;
  }, {});

  return {
    periodo: format(now, 'MMMM yyyy'),
    resumo_atual: {
      total_receitas: currentTotalIncome,
      total_despesas: currentTotalExpenses,
      saldo: currentTotalIncome - currentTotalExpenses,
    },
    resumo_mes_anterior: {
      total_receitas: lastTotalIncome,
      total_despesas: lastTotalExpenses,
    },
    gastos_por_categoria: expensesByCategory,
    principais_lancamentos: (currentExpenses || [])
      .sort((a, b) => Number(b.amount) - Number(a.amount))
      .slice(0, 5)
      .map(e => ({ descricao: e.description, valor: e.amount, categoria: catMap.get(e.category_id as string) || 'Outros' }))
  };
}
