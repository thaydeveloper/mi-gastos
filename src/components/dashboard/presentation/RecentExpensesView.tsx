/**
 * @fileoverview Presentation component for recent expenses list.
 */

import Link from 'next/link';
import type { ExpenseWithCategory } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

/** Props for RecentExpensesView */
interface RecentExpensesViewProps {
  expenses: ExpenseWithCategory[];
}

/** Renders a compact list of recent expenses */
export function RecentExpensesView({ expenses }: RecentExpensesViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Despesas Recentes</CardTitle>
        <Link
          href="/expenses"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          Ver todas
        </Link>
      </CardHeader>

      {expenses.length === 0 ? (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Nenhuma despesa recente
        </p>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {expense.description}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(expense.date)}
                  </span>
                  {expense.categories && (
                    <Badge color={expense.categories.color}>{expense.categories.name}</Badge>
                  )}
                </div>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {formatCurrency(expense.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
