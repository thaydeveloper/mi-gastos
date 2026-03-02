/**
 * @fileoverview Presentation component for unpaid bills in the current month.
 */

import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/format';
import { Receipt } from 'lucide-react';

/** Single unpaid bill item */
interface UnpaidBill {
  name: string;
  amount: number;
  dueDay: number;
  overdue: boolean;
}

/** Props for UpcomingBillsView */
interface UpcomingBillsViewProps {
  bills: UnpaidBill[];
}

/** Renders a compact list of unpaid bills for the current month */
export function UpcomingBillsView({ bills }: UpcomingBillsViewProps) {
  const total = bills.reduce((sum, b) => sum + b.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt size={18} className="text-rose-500" />
          Contas a Pagar
        </CardTitle>
      </CardHeader>

      {bills.length === 0 ? (
        <p className="px-6 pb-5 text-sm text-gray-400">Todas as contas pagas!</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-100 px-6 dark:divide-gray-800">
            {bills.map((bill, i) => (
              <li key={i} className="flex items-center justify-between py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {bill.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Vence dia {bill.dueDay}
                    {bill.overdue && (
                      <span className="ml-1.5 rounded bg-rose-500/10 px-1.5 py-0.5 text-xs font-medium text-rose-500">
                        Vencida
                      </span>
                    )}
                  </p>
                </div>
                <span className="ml-3 text-sm font-semibold text-rose-600 dark:text-rose-400">
                  {formatCurrency(bill.amount)}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-100 px-6 py-3 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Total a pagar
              </span>
              <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
