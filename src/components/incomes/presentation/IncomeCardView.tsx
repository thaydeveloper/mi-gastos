/**
 * @fileoverview Presentation component for mobile income cards.
 */

import Link from 'next/link';
import type { Income } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Badge } from '@/components/ui/Badge';
import { RECURRING_LABELS } from '@/lib/constants';

/** Props for IncomeCardView */
interface IncomeCardViewProps {
  incomes: Income[];
  onDelete: (id: string) => void;
}

/** Renders incomes as mobile-friendly cards */
export function IncomeCardView({ incomes, onDelete }: IncomeCardViewProps) {
  if (incomes.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Nenhum ganho encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {incomes.map((income) => (
        <div
          key={income.id}
          className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">{income.description}</p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {formatDate(income.date)}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {income.source && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    {income.source}
                  </span>
                )}
                {income.is_recurring && income.recurring_interval && (
                  <Badge>{RECURRING_LABELS[income.recurring_interval]}</Badge>
                )}
              </div>
            </div>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(income.amount)}
            </p>
          </div>
          <div className="mt-3 flex justify-end gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
            <Link
              href={`/incomes/${income.id}`}
              className="rounded px-3 py-1 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400"
            >
              Editar
            </Link>
            <button
              onClick={() => onDelete(income.id)}
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
