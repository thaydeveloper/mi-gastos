/**
 * @fileoverview New expense page.
 */

import { createClient } from '@/lib/supabase/server';
import { ExpenseFormContainer } from '@/components/expenses/containers/ExpenseFormContainer';

export const metadata = {
  title: 'Nova Despesa',
};

export default async function NewExpensePage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('name');

  return <ExpenseFormContainer categories={categories ?? []} />;
}
