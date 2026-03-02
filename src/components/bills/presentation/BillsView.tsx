/**
 * @fileoverview Presentation component for the bills list with payment toggles.
 */

'use client';

import Link from 'next/link';
import type { BillWithPayment } from '@/types';
import { formatCurrency } from '@/lib/utils/format';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react';

interface BillsViewProps {
  bills: BillWithPayment[];
  totalAmount: number;
  paidAmount: number;
  onToggle: (billId: string, currentlyPaid: boolean) => void;
  onDelete: (id: string) => void;
}

export function BillsView({ bills, totalAmount, paidAmount, onToggle, onDelete }: BillsViewProps) {
  const remainingAmount = totalAmount - paidAmount;
  const paidCount = bills.filter((b) => b.payment?.paid).length;

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total em Contas</p>
          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalAmount)}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            {bills.length} conta{bills.length !== 1 ? 's' : ''}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Já Pagas</p>
          <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(paidAmount)}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            {paidCount} paga{paidCount !== 1 ? 's' : ''}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Ainda a Pagar</p>
          <p
            className={`mt-1 text-xl font-bold ${remainingAmount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}
          >
            {formatCurrency(remainingAmount)}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            {bills.length - paidCount} pendente{bills.length - paidCount !== 1 ? 's' : ''}
          </p>
        </Card>
      </div>

      {/* Bills list */}
      {bills.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
          <p className="text-gray-500 dark:text-gray-400">Nenhuma conta cadastrada.</p>
          <Link
            href="/bills/new"
            className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Adicionar primeira conta
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {bills.map((bill) => {
            const isPaid = bill.payment?.paid ?? false;
            const today = new Date().getDate();
            const isOverdue = !isPaid && bill.due_day < today;
            const isUpcoming = !isPaid && bill.due_day >= today && bill.due_day <= today + 3;

            return (
              <div
                key={bill.id}
                className={`flex items-center gap-4 rounded-xl border p-4 transition-colors ${
                  isPaid
                    ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-900 dark:bg-emerald-950/20'
                    : isOverdue
                      ? 'border-rose-200 bg-rose-50/30 dark:border-rose-900 dark:bg-rose-950/20'
                      : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
                }`}
              >
                {/* Toggle button */}
                <button
                  onClick={() => onToggle(bill.id, isPaid)}
                  className="flex-shrink-0 transition-transform hover:scale-110"
                  title={isPaid ? 'Marcar como não pago' : 'Marcar como pago'}
                >
                  {isPaid ? (
                    <CheckCircle2 className="text-emerald-500" size={28} />
                  ) : (
                    <Circle className="text-gray-400 dark:text-gray-600" size={28} />
                  )}
                </button>

                {/* Bill info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={`font-medium ${isPaid ? 'text-gray-400 line-through dark:text-gray-600' : 'text-gray-900 dark:text-white'}`}
                    >
                      {bill.name}
                    </p>
                    {isOverdue && (
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                        Vencida
                      </span>
                    )}
                    {isUpcoming && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                        Vence em breve
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                    Vence dia {bill.due_day}
                    {bill.categories && (
                      <span className="ml-2">
                        ·{' '}
                        <span style={{ color: bill.categories.color }}>{bill.categories.name}</span>
                      </span>
                    )}
                  </p>
                </div>

                {/* Amount */}
                <p
                  className={`text-lg font-bold ${isPaid ? 'text-gray-400 dark:text-gray-600' : 'text-gray-900 dark:text-white'}`}
                >
                  {formatCurrency(bill.amount)}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Link
                    href={`/bills/${bill.id}`}
                    className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-indigo-600 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
                    title="Editar"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => onDelete(bill.id)}
                    className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800 dark:hover:text-red-400"
                    title="Excluir"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
