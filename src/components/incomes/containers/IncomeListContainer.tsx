/**
 * @fileoverview Container for the income list with delete functionality.
 */

'use client';

import type { Income } from '@/types';
import { deleteIncome } from '@/app/(dashboard)/incomes/actions';
import { IncomeTableView } from '../presentation/IncomeTableView';
import { IncomeCardView } from '../presentation/IncomeCardView';

/** Props for IncomeListContainer */
interface IncomeListContainerProps {
  incomes: Income[];
}

/** Container managing income list delete actions */
export function IncomeListContainer({ incomes }: IncomeListContainerProps) {
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este ganho?')) return;
    const result = await deleteIncome(id);
    if (result?.error) {
      alert(result.error);
    }
  };

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block">
        <IncomeTableView incomes={incomes} onDelete={handleDelete} />
      </div>
      {/* Mobile cards */}
      <div className="sm:hidden">
        <IncomeCardView incomes={incomes} onDelete={handleDelete} />
      </div>
    </>
  );
}
