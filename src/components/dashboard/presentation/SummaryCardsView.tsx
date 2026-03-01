/**
 * @fileoverview Presentation component for dashboard summary cards.
 */

import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/format';
import { TrendingUp, TrendingDown, DollarSign, Receipt, Calculator } from 'lucide-react';

/** Props for SummaryCardsView */
interface SummaryCardsViewProps {
  totalMonth: number;
  averagePerDay: number;
  expenseCount: number;
  previousMonthTotal: number;
}

/** Renders the dashboard summary metric cards */
export function SummaryCardsView({
  totalMonth,
  averagePerDay,
  expenseCount,
  previousMonthTotal,
}: SummaryCardsViewProps) {
  const percentChange =
    previousMonthTotal > 0
      ? ((totalMonth - previousMonthTotal) / previousMonthTotal) * 100
      : 0;
  const isUp = percentChange > 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total do Mês</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalMonth)}
            </p>
          </div>
          <div className="rounded-lg bg-indigo-50 p-3 dark:bg-indigo-950">
            <DollarSign className="text-indigo-600 dark:text-indigo-400" size={24} />
          </div>
        </div>
        {previousMonthTotal > 0 && (
          <div className="mt-3 flex items-center gap-1 text-xs">
            {isUp ? (
              <TrendingUp className="text-red-500" size={14} />
            ) : (
              <TrendingDown className="text-green-500" size={14} />
            )}
            <span className={isUp ? 'text-red-500' : 'text-green-500'}>
              {Math.abs(percentChange).toFixed(1)}%
            </span>
            <span className="text-gray-400">vs mês anterior</span>
          </div>
        )}
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Média por Dia</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(averagePerDay)}
            </p>
          </div>
          <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950">
            <Calculator className="text-amber-600 dark:text-amber-400" size={24} />
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total de Despesas</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {expenseCount}
            </p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950">
            <Receipt className="text-emerald-600 dark:text-emerald-400" size={24} />
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Mês Anterior</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(previousMonthTotal)}
            </p>
          </div>
          <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-950">
            <TrendingDown className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
        </div>
      </Card>
    </div>
  );
}
