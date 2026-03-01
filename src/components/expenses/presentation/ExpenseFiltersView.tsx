/**
 * @fileoverview Presentation component for expense filters.
 */

'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { Button } from '@/components/ui/Button';
import { Search, X } from 'lucide-react';

/** Props for ExpenseFiltersView */
interface ExpenseFiltersViewProps {
  search: string;
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
  categoryId: string;
  categories: Array<{ value: string; label: string }>;
  onSearchChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onAmountMinChange: (value: string) => void;
  onAmountMaxChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClear: () => void;
  hasFilters: boolean;
}

/** Renders the expense filter controls */
export function ExpenseFiltersView({
  search,
  dateFrom,
  dateTo,
  amountMin,
  amountMax,
  categoryId,
  categories,
  onSearchChange,
  onDateFromChange,
  onDateToChange,
  onAmountMinChange,
  onAmountMaxChange,
  onCategoryChange,
  onClear,
  hasFilters,
}: ExpenseFiltersViewProps) {
  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X size={14} />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="relative sm:col-span-2 lg:col-span-3 xl:col-span-2">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar despesa..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <DatePicker
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          placeholder="Data início"
        />

        <DatePicker
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          placeholder="Data fim"
        />

        <Input
          type="number"
          step="0.01"
          min="0"
          value={amountMin}
          onChange={(e) => onAmountMinChange(e.target.value)}
          placeholder="Valor mín"
        />

        <Input
          type="number"
          step="0.01"
          min="0"
          value={amountMax}
          onChange={(e) => onAmountMaxChange(e.target.value)}
          placeholder="Valor máx"
        />
      </div>

      <div className="mt-3">
        <Select
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
          options={categories}
          placeholder="Todas as categorias"
        />
      </div>
    </div>
  );
}
