/**
 * @fileoverview Container for expense filters.
 * Manages filter state synced with URL search params.
 */

'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import type { Category } from '@/types';
import { ExpenseFiltersView } from '../presentation/ExpenseFiltersView';

/** Props for ExpenseFiltersContainer */
interface ExpenseFiltersContainerProps {
  categories: Category[];
}

/** Container managing filter state via URL search params */
export function ExpenseFiltersContainer({ categories }: ExpenseFiltersContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const dateFrom = searchParams.get('date_from') ?? '';
  const dateTo = searchParams.get('date_to') ?? '';
  const amountMin = searchParams.get('amount_min') ?? '';
  const amountMax = searchParams.get('amount_max') ?? '';
  const categoryId = searchParams.get('category_id') ?? '';

  const hasFilters = !!(search || dateFrom || dateTo || amountMin || amountMax || categoryId);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const clearFilters = () => {
    router.push(pathname);
  };

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <ExpenseFiltersView
      search={search}
      dateFrom={dateFrom}
      dateTo={dateTo}
      amountMin={amountMin}
      amountMax={amountMax}
      categoryId={categoryId}
      categories={categoryOptions}
      onSearchChange={(v) => updateParam('search', v)}
      onDateFromChange={(v) => updateParam('date_from', v)}
      onDateToChange={(v) => updateParam('date_to', v)}
      onAmountMinChange={(v) => updateParam('amount_min', v)}
      onAmountMaxChange={(v) => updateParam('amount_max', v)}
      onCategoryChange={(v) => updateParam('category_id', v)}
      onClear={clearFilters}
      hasFilters={hasFilters}
    />
  );
}
