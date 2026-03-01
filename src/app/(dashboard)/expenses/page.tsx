/**
 * @fileoverview Expenses list page - Server Component with filter support.
 */

import Link from 'next/link';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ExpenseFiltersContainer } from '@/components/expenses/containers/ExpenseFiltersContainer';
import { ExpenseListContainer } from '@/components/expenses/containers/ExpenseListContainer';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Plus } from 'lucide-react';
import { EXPENSES_PER_PAGE } from '@/lib/constants';

export const metadata = {
  title: 'Despesas',
};

interface ExpensesPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ExpensesPage({ searchParams }: ExpensesPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase.from('categories').select('*').order('name');

  const page = parseInt(params.page ?? '1', 10);
  const offset = (page - 1) * EXPENSES_PER_PAGE;

  let query = supabase
    .from('expenses')
    .select('*, categories(name, color, icon)', { count: 'exact' })
    .order('date', { ascending: false })
    .range(offset, offset + EXPENSES_PER_PAGE - 1);

  if (params.search) {
    query = query.ilike('description', `%${params.search}%`);
  }
  if (params.date_from) {
    query = query.gte('date', params.date_from);
  }
  if (params.date_to) {
    query = query.lte('date', params.date_to);
  }
  if (params.amount_min) {
    query = query.gte('amount', parseFloat(params.amount_min));
  }
  if (params.amount_max) {
    query = query.lte('amount', parseFloat(params.amount_max));
  }
  if (params.category_id) {
    query = query.eq('category_id', params.category_id);
  }

  const { data: expenses, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / EXPENSES_PER_PAGE);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Despesas</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {count ?? 0} despesa{(count ?? 0) !== 1 ? 's' : ''} encontrada{(count ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/expenses/new">
          <Button>
            <Plus size={16} />
            Nova Despesa
          </Button>
        </Link>
      </div>

      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <ExpenseFiltersContainer categories={categories ?? []} />
      </Suspense>

      <ExpenseListContainer expenses={expenses ?? []} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const params2 = new URLSearchParams();
            Object.entries(params).forEach(([k, v]) => {
              if (v && k !== 'page') params2.set(k, v);
            });
            params2.set('page', String(p));
            return (
              <Link
                key={p}
                href={`/expenses?${params2.toString()}`}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
