/**
 * @fileoverview Presentation component showing total unpaid bills for the current month.
 */

import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/format';
import { Receipt } from 'lucide-react';

/** Props for UpcomingBillsView */
interface UpcomingBillsViewProps {
  total: number;
  count: number;
}

/** Renders a summary card with the total amount of unpaid bills */
export function UpcomingBillsView({ total, count }: UpcomingBillsViewProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Contas a Pagar</p>
          <p className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400">
            {formatCurrency(total)}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            {count === 0 ? 'Tudo pago!' : `${count} conta${count > 1 ? 's' : ''} pendente${count > 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="rounded-lg bg-rose-50 p-3 dark:bg-rose-950">
          <Receipt className="text-rose-600 dark:text-rose-400" size={24} />
        </div>
      </div>
    </Card>
  );
}
