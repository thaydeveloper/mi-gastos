/**
 * @fileoverview Container for the bills page with toggle and delete logic.
 */

'use client';

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
  const handleToggle = async (billId: string, currentlyPaid: boolean) => {
    const result = await toggleBillPayment(billId, year, month, currentlyPaid);
    if (result?.error) alert(result.error);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta conta? Isso também apagará o histórico de pagamentos.')) return;
    const result = await deleteBill(id);
    if (result?.error) alert(result.error);
  };

  return (
    <BillsView
      bills={bills}
      totalAmount={totalAmount}
      paidAmount={paidAmount}
      onToggle={handleToggle}
      onDelete={handleDelete}
    />
  );
}
