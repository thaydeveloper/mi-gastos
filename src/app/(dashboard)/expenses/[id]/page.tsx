/**
 * @fileoverview Edit expense page.
 */

import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ExpenseFormContainer } from '@/components/expenses/containers/ExpenseFormContainer';

export const metadata = {
  title: 'Editar Despesa',
};

interface EditExpensePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExpensePage({ params }: EditExpensePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: expense }, { data: categories }] = await Promise.all([
    supabase.from('expenses').select('*, categories(name, color, icon)').eq('id', id).single(),
    supabase.from('categories').select('*').order('name'),
  ]);

  if (!expense) notFound();

  return <ExpenseFormContainer categories={categories ?? []} expense={expense} />;
}
