/**
 * @fileoverview CSV export utility for expenses.
 */

import type { ExpenseWithCategory } from '@/types';

/**
 * Generates CSV content from expense data.
 * @param expenses - Array of expenses to export
 * @returns CSV string with headers and rows
 */
export function generateExpenseCSV(expenses: ExpenseWithCategory[]): string {
  const header = 'Data,Descrição,Categoria,Valor,Recorrente,Intervalo,Notas';
  const rows = expenses.map((e) => {
    const desc = `"${e.description.replace(/"/g, '""')}"`;
    const category = `"${e.categories?.name ?? ''}"`;
    const notes = `"${(e.notes ?? '').replace(/"/g, '""')}"`;
    return `${e.date},${desc},${category},${e.amount},${e.is_recurring ? 'Sim' : 'Não'},${e.recurring_interval ?? ''},${notes}`;
  });
  return [header, ...rows].join('\n');
}

/**
 * Downloads CSV as a file.
 * @param expenses - Expenses to export
 */
export function downloadExpenseCSV(expenses: ExpenseWithCategory[]) {
  const csv = generateExpenseCSV(expenses);
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `meus-gastos-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
