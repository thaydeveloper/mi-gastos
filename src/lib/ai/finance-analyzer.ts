/**
 * @fileoverview Logic to aggregate financial data for AI analysis.
 * Unified with Dashboard balance logic to ensure data consistency.
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

  const todayStr = format(now, 'yyyy-MM-dd');
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  console.log('Fetching financial data for AI (Unified Logic)...');
  const [
    { data: currentExpenses, error: e1 },
    { data: currentIncomes, error: i1 },
    { data: historicalExpenses, error: he1 },
    { data: historicalIncomes, error: hi1 },
    { data: categories, error: c1 },
    { data: bills, error: b1 },
    { data: billPayments, error: bp1 }
  ] = await Promise.all([
    // Current month data
    supabase.from('expenses').select('amount, category_id, description, date').gte('date', currentMonthStart).lte('date', currentMonthEnd),
    supabase.from('incomes').select('amount, source, description, date').gte('date', currentMonthStart).lte('date', currentMonthEnd),
    // Historical data before this month (for cumulative balance)
    supabase.from('expenses').select('amount').lt('date', currentMonthStart),
    supabase.from('incomes').select('amount').lt('date', currentMonthStart),
    // Aux data
    supabase.from('categories').select('id, name'),
    supabase.from('bills').select('id, name, amount, due_day').eq('is_active', true),
    supabase.from('bill_payments').select('bill_id, paid').eq('year', year).eq('month', month)
  ]);

  if (e1 || i1 || he1 || hi1 || c1 || b1 || bp1) {
    console.error('Supabase query errors:', { e1, i1, he1, hi1, c1, b1, bp1 });
  }

  const catMap = new Map((categories || []).map(c => [c.id, c.name]));

  // 1. Calculate Previous Balance (Historical)
  const previousMonthBalance = 
    (historicalIncomes || []).reduce((sum, i) => sum + Number(i.amount), 0) -
    (historicalExpenses || []).reduce((sum, e) => sum + Number(e.amount), 0);

  // 2. Realized totals (up to today)
  const realizedIncomes = (currentIncomes || []).filter(i => i.date <= todayStr);
  const realizedExpenses = (currentExpenses || []).filter(e => e.date <= todayStr);
  
  // 3. Pending totals (future dates in current month)
  const pendingIncomes = (currentIncomes || []).filter(i => i.date > todayStr);
  const futureExpenses = (currentExpenses || []).filter(e => e.date > todayStr);
  
  // 4. Bills Logic (Paid vs Unpaid)
  const paidBillIds = new Set((billPayments || []).filter(p => p.paid).map(p => p.bill_id));
  const unpaidBills = (bills || []).filter(b => !paidBillIds.has(b.id));
  const paidBills = (bills || []).filter(b => paidBillIds.has(b.id));
  
  const totalPaidBills = paidBills.reduce((sum, b) => sum + Number(b.amount), 0);
  const totalUnpaidBills = unpaidBills.reduce((sum, b) => sum + Number(b.amount), 0);

  // 5. Unified Balance Calculation (Matches Dashboard)
  const totalRealizedIncome = realizedIncomes.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalRealizedExpenses = realizedExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  
  // Saldo do Mês Vigente = Saldo Anterior + Ganhos de Hoje - Gastos de Hoje - Contas Já Pagas
  const saldoMesVigente = previousMonthBalance + totalRealizedIncome - totalRealizedExpenses - totalPaidBills;

  // Projeção Final = Saldo Vigente + Ganhos Futuros - Gastos Futuros - Contas a Pagar
  const totalPendingIncome = pendingIncomes.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalFutureExpenses = futureExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const projecaoSaldoFinal = saldoMesVigente + totalPendingIncome - totalFutureExpenses - totalUnpaidBills;

  const expensesByCategory = (currentExpenses || []).reduce((acc: Record<string, number>, e) => {
    const catName = catMap.get(e.category_id as string) || 'Outros';
    acc[catName] = (acc[catName] || 0) + Number(e.amount);
    return acc;
  }, {});

  const round = (num: number) => Math.round(num * 100) / 100;

  return {
    periodo: format(now, 'MMMM yyyy'),
    resumo_atual: {
      saldo_anterior_acumulado: round(previousMonthBalance),
      receitas_recebidas_no_mes: round(totalRealizedIncome),
      despesas_realizadas_no_mes: round(totalRealizedExpenses),
      contas_ja_pagas_no_mes: round(totalPaidBills),
      saldo_do_mes_vigente: round(saldoMesVigente),
      
      // Projeções
      receitas_a_receber: round(totalPendingIncome),
      contas_a_pagar_pendentes: round(totalUnpaidBills),
      projecao_saldo_final: round(projecaoSaldoFinal),
    },
    gastos_por_categoria: Object.fromEntries(
      Object.entries(expensesByCategory).map(([cat, val]) => [cat, round(val)])
    ),
    contas_vencendo: unpaidBills.map(b => ({ nome: b.name, valor: round(Number(b.amount)), dia: b.due_day })),
    receitas_esperadas: pendingIncomes.map(i => ({ descricao: i.description || i.source, valor: round(Number(i.amount)), data: i.date }))
  };
}
