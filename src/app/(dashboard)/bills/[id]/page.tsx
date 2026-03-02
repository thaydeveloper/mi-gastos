/**
 * @fileoverview Edit bill page.
 */

import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BillFormContainer } from '@/components/bills/containers/BillFormContainer';

export const metadata = {
  title: 'Editar Conta',
};

interface EditBillPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBillPage({ params }: EditBillPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: bill }, { data: categories }] = await Promise.all([
    supabase.from('bills').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('name'),
  ]);

  if (!bill) notFound();

  return (
    <div>
      <BillFormContainer bill={bill} categories={categories ?? []} />
    </div>
  );
}
