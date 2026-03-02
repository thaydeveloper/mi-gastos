/**
 * @fileoverview Bills (contas mensais) page - shows current month status.
 */

import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { BillsPageContainer } from '@/components/bills/containers/BillsPageContainer';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export const metadata = {
  title: 'Contas Mensais',
};

export default async function BillsPage() {
  const supabase = await createClient();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { data: bills } = await supabase
    .from('bills')
    .select('*, categories(name, color)')
    .eq('is_active', true)
    .order('due_day');

  const { data: payments } = await supabase
    .from('bill_payments')
    .select('*')
    .eq('year', year)
    .eq('month', month);

  const paymentMap = new Map((payments ?? []).map((p) => [p.bill_id, p]));

  const billsWithPayments = (bills ?? []).map((bill) => ({
    ...bill,
    categories: bill.categories as unknown as { name: string; color: string } | null,
    payment: paymentMap.get(bill.id) ?? null,
  }));

  const totalAmount = billsWithPayments.reduce((sum, b) => sum + b.amount, 0);
  const paidAmount = billsWithPayments
    .filter((b) => b.payment?.paid)
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contas Mensais</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {new Date(year, month - 1).toLocaleDateString('pt-BR', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <Link href="/bills/new">
          <Button>
            <Plus size={16} />
            Nova Conta
          </Button>
        </Link>
      </div>

      <BillsPageContainer
        bills={billsWithPayments}
        year={year}
        month={month}
        totalAmount={totalAmount}
        paidAmount={paidAmount}
      />
    </div>
  );
}
