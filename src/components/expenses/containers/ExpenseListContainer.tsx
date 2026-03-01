/**
 * @fileoverview Container for the expense list with delete functionality.
 */

'use client';

import type { ExpenseWithCategory } from '@/types';
import { deleteExpense } from '@/app/(dashboard)/expenses/actions';
import { ExpenseTableView } from '../presentation/ExpenseTableView';
import { ExpenseCardView } from '../presentation/ExpenseCardView';

/** Props for ExpenseListContainer */
interface ExpenseListContainerProps {
  expenses: ExpenseWithCategory[];
}

/** Container managing expense list delete actions */
export function ExpenseListContainer({ expenses }: ExpenseListContainerProps) {
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta despesa?')) return;
    const result = await deleteExpense(id);
    if (result?.error) {
      alert(result.error);
    }
  };

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block">
        <ExpenseTableView expenses={expenses} onDelete={handleDelete} />
      </div>
      {/* Mobile cards */}
      <div className="sm:hidden">
        <ExpenseCardView expenses={expenses} onDelete={handleDelete} />
      </div>
    </>
  );
}
