/**
 * @fileoverview Incomes list page - Server Component with pagination.
 */

import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { IncomeListContainer } from '@/components/incomes/containers/IncomeListContainer';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { EXPENSES_PER_PAGE } from '@/lib/constants';

export const metadata = {
  title: 'Ganhos',
};

interface IncomesPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function IncomesPage({ searchParams }: IncomesPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const page = parseInt(params.page ?? '1', 10);
  const offset = (page - 1) * EXPENSES_PER_PAGE;

  const { data: incomes, count } = await supabase
    .from('incomes')
    .select('*', { count: 'exact' })
    .order('date', { ascending: false })
    .range(offset, offset + EXPENSES_PER_PAGE - 1);

  const totalPages = Math.ceil((count ?? 0) / EXPENSES_PER_PAGE);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ganhos</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {count ?? 0} ganho{(count ?? 0) !== 1 ? 's' : ''} encontrado
            {(count ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/incomes/new">
          <Button>
            <Plus size={16} />
            Novo Ganho
          </Button>
        </Link>
      </div>

      <IncomeListContainer incomes={incomes ?? []} />

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const searchParamsCopy = new URLSearchParams();
            searchParamsCopy.set('page', String(p));
            return (
              <Link
                key={p}
                href={`/incomes?${searchParamsCopy.toString()}`}
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
