/**
 * @fileoverview Edit income page.
 */

import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { IncomeFormContainer } from '@/components/incomes/containers/IncomeFormContainer';

export const metadata = {
  title: 'Editar Ganho',
};

interface EditIncomePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditIncomePage({ params }: EditIncomePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: income } = await supabase.from('incomes').select('*').eq('id', id).single();

  if (!income) notFound();

  return (
    <div>
      <IncomeFormContainer income={income} />
    </div>
  );
}
