/**
 * @fileoverview Presentation component for the expense table (desktop).
 */

import Link from 'next/link';
import type { ExpenseWithCategory } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Badge } from '@/components/ui/Badge';
import { RECURRING_LABELS } from '@/lib/constants';

/** Props for ExpenseTableView */
interface ExpenseTableViewProps {
  expenses: ExpenseWithCategory[];
  onDelete: (id: string) => void;
}

/** Renders expenses in a desktop table layout */
export function ExpenseTableView({ expenses, onDelete }: ExpenseTableViewProps) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Nenhuma despesa encontrada.</p>
        <Link
          href="/expenses/new"
          className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Criar primeira despesa
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Data</th>
            <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Descrição</th>
            <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Categoria</th>
            <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
              Valor
            </th>
            <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {expenses.map((expense) => (
            <tr
              key={expense.id}
              className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-400">
                {formatDate(expense.date)}
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900 dark:text-white">
                  {expense.description}
                </div>
                {expense.is_recurring && expense.recurring_interval && (
                  <Badge className="mt-1">{RECURRING_LABELS[expense.recurring_interval]}</Badge>
                )}
              </td>
              <td className="px-4 py-3">
                {expense.categories ? (
                  <Badge color={expense.categories.color}>{expense.categories.name}</Badge>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                {formatCurrency(expense.amount)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/expenses/${expense.id}`}
                    className="rounded px-2 py-1 text-xs text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="rounded px-2 py-1 text-xs text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
