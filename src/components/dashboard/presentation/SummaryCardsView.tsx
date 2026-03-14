/**
 * @fileoverview Presentation component for dashboard summary cards.
 */

import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/format';
import { TrendingUp, TrendingDown, Calculator, Wallet } from 'lucide-react';

/** Props for SummaryCardsView */
interface SummaryCardsViewProps {
  totalMonthExpenses: number;
  totalMonthIncome: number;
  totalPendingIncome: number;
  balance: number;
  previousMonthBalance: number;
}

/** Renders the dashboard summary metric cards */
export function SummaryCardsView({
  totalMonthExpenses,
  totalMonthIncome,
  totalPendingIncome,
  balance,
  previousMonthBalance,
}: SummaryCardsViewProps) {
  const isPositiveBalance = balance >= 0;
  const isPrevPositive = previousMonthBalance >= 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {/* Total de Ganhos */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Recebido</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalMonthIncome)}
            </p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950">
            <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={24} />
          </div>
        </div>
      </Card>

      {/* A Receber */}
      <Card className="p-5 border-emerald-100 dark:border-emerald-900/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">A Receber</p>
            <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(totalPendingIncome)}
            </p>
          </div>
          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
            <Calculator className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
        </div>
      </Card>

      {/* Total de Despesas */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total de Despesas</p>
            <p className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400">
              {formatCurrency(totalMonthExpenses)}
            </p>
          </div>
          <div className="rounded-lg bg-rose-50 p-3 dark:bg-rose-950">
            <TrendingDown className="text-rose-600 dark:text-rose-400" size={24} />
          </div>
        </div>
      </Card>

      {/* Saldo do Mês */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Saldo do Mês Vigente</p>
            <p
              className={`mt-1 text-2xl font-bold ${
                isPositiveBalance
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isPositiveBalance ? '+' : ''}
              {formatCurrency(balance)}
            </p>
          </div>
          <div
            className={`rounded-lg p-3 ${
              isPositiveBalance
                ? 'bg-emerald-50 dark:bg-emerald-950'
                : 'bg-rose-50 dark:bg-rose-950'
            }`}
          >
            <Wallet
              className={
                isPositiveBalance
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }
              size={24}
            />
          </div>
        </div>
      </Card>

      {/* Mês Anterior */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Saldo Mês Anterior</p>
            <p
              className={`mt-1 text-2xl font-bold ${
                isPrevPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isPrevPositive ? '+' : ''}
              {formatCurrency(previousMonthBalance)}
            </p>
          </div>
          <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-950">
            <Calculator className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
        </div>
      </Card>
    </div>
  );
}
