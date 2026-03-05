/**
 * @fileoverview Container for the bills page with toggle and delete logic.
 */

'use client';

import { useOptimistic, useTransition } from 'react';
import type { BillWithPayment } from '@/types';
import { toggleBillPayment, deleteBill } from '@/app/(dashboard)/bills/actions';
import { BillsView } from '../presentation/BillsView';

interface BillsPageContainerProps {
  bills: BillWithPayment[];
  year: number;
  month: number;
  totalAmount: number;
  paidAmount: number;
}

export function BillsPageContainer({
  bills,
  year,
  month,
  totalAmount,
  paidAmount,
}: BillsPageContainerProps) {
  const [, startTransition] = useTransition();

  // Optimistic state: immediately reflects toggle before server responds
  const [optimisticBills, setOptimisticBill] = useOptimistic(
    bills,
    (current: BillWithPayment[], { billId, paid }: { billId: string; paid: boolean }) =>
      current.map((b) =>
        b.id === billId
          ? { ...b, payment: { ...(b.payment ?? {}), paid } as BillWithPayment['payment'] }
          : b,
      ),
  );

  const optimisticPaidAmount = optimisticBills
    .filter((b) => b.payment?.paid)
    .reduce((sum, b) => sum + b.amount, 0);

  const handleToggle = (billId: string, currentlyPaid: boolean) => {
    startTransition(async () => {
      setOptimisticBill({ billId, paid: !currentlyPaid });
      const result = await toggleBillPayment(billId, year, month, currentlyPaid);
      if (result?.error) alert(result.error);
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta conta? Isso também apagará o histórico de pagamentos.')) return;
    const result = await deleteBill(id);
    if (result?.error) alert(result.error);
  };

  return (
    <BillsView
      bills={optimisticBills}
      totalAmount={totalAmount}
      paidAmount={optimisticPaidAmount}
      onToggle={handleToggle}
      onDelete={handleDelete}
    />
  );
}
