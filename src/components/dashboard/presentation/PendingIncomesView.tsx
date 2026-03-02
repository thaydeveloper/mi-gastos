/**
 * @fileoverview Presentation component for pending incomes (future dates in current month).
 */

import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Clock } from 'lucide-react';

/** Single pending income item */
interface PendingIncome {
  description: string;
  amount: number;
  date: string;
}

/** Props for PendingIncomesView */
interface PendingIncomesViewProps {
  incomes: PendingIncome[];
}

/** Renders a compact list of incomes yet to be received this month */
export function PendingIncomesView({ incomes }: PendingIncomesViewProps) {
  const total = incomes.reduce((sum, i) => sum + i.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock size={18} className="text-emerald-500" />
          A Receber
        </CardTitle>
      </CardHeader>

      {incomes.length === 0 ? (
        <p className="px-6 pb-5 text-sm text-gray-400">Nenhum ganho pendente.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-100 px-6 dark:divide-gray-800">
            {incomes.map((income, i) => (
              <li key={i} className="flex items-center justify-between py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {income.description}
                  </p>
                  <p className="text-xs text-gray-400">{formatDate(income.date)}</p>
                </div>
                <span className="ml-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  +{formatCurrency(income.amount)}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-100 px-6 py-3 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Total a receber
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
