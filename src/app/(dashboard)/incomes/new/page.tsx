/**
 * @fileoverview New income creation page.
 */

import { IncomeFormContainer } from '@/components/incomes/containers/IncomeFormContainer';

export const metadata = {
  title: 'Novo Ganho',
};

export default function NewIncomePage() {
  return (
    <div>
      <IncomeFormContainer />
    </div>
  );
}
