/**
 * @fileoverview Presentation component for mobile expense cards.
 */

import Link from 'next/link';
import type { ExpenseWithCategory } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Badge } from '@/components/ui/Badge';
import { RECURRING_LABELS } from '@/lib/constants';

/** Props for ExpenseCardView */
interface ExpenseCardViewProps {
  expenses: ExpenseWithCategory[];
  onDelete: (id: string) => void;
}

/** Renders expenses as mobile-friendly cards */
export function ExpenseCardView({ expenses, onDelete }: ExpenseCardViewProps) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Nenhuma despesa encontrada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">{expense.description}</p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {formatDate(expense.date)}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {expense.categories && (
                  <Badge color={expense.categories.color}>{expense.categories.name}</Badge>
                )}
                {expense.is_recurring && expense.recurring_interval && (
                  <Badge>{RECURRING_LABELS[expense.recurring_interval]}</Badge>
                )}
              </div>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(expense.amount)}
            </p>
          </div>
          <div className="mt-3 flex justify-end gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
            <Link
              href={`/expenses/${expense.id}`}
              className="rounded px-3 py-1 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400"
            >
              Editar
            </Link>
            <button
              onClick={() => onDelete(expense.id)}
              className="rounded px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400"
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
