/**
 * @fileoverview Categories page - Server Component that fetches data and renders container.
 */

import { createClient } from '@/lib/supabase/server';
import { CategoriesPageContainer } from '@/components/categories/containers/CategoriesPageContainer';

export const metadata = {
  title: 'Categorias',
};

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('name');

  return <CategoriesPageContainer initialCategories={categories ?? []} />;
}
