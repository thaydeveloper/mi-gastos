/**
 * @fileoverview New bill creation page.
 */

import { createClient } from '@/lib/supabase/server';
import { BillFormContainer } from '@/components/bills/containers/BillFormContainer';

export const metadata = {
  title: 'Nova Conta',
};

export default async function NewBillPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('name');

  return (
    <div>
      <BillFormContainer categories={categories ?? []} />
    </div>
  );
}
