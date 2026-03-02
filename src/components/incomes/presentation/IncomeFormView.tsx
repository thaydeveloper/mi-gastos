/**
 * @fileoverview Presentation component for income create/edit form.
 */

'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RECURRING_LABELS } from '@/lib/constants';

/** Props for IncomeFormView */
interface IncomeFormViewProps {
  isEditing: boolean;
  description: string;
  amount: string;
  date: string;
  source: string;
  notes: string;
  isRecurring: boolean;
  recurringInterval: string;
  error: string | null;
  loading: boolean;
  onDescriptionChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onRecurringChange: (value: boolean) => void;
  onIntervalChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

/** Renders the income form UI */
export function IncomeFormView({
  isEditing,
  description,
  amount,
  date,
  source,
  notes,
  isRecurring,
  recurringInterval,
  error,
  loading,
  onDescriptionChange,
  onAmountChange,
  onDateChange,
  onSourceChange,
  onNotesChange,
  onRecurringChange,
  onIntervalChange,
  onSubmit,
}: IncomeFormViewProps) {
  const intervalOptions = Object.entries(RECURRING_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <Card className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
        {isEditing ? 'Editar Ganho' : 'Novo Ganho'}
      </h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          id="description"
          label="Descrição"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Ex: Salário, Freelance, Dividendos"
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="amount"
            label="Valor (R$)"
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0,00"
            required
          />

          <DatePicker
            id="date"
            label="Data"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            required
          />
        </div>

        <Input
          id="source"
          label="Fonte (opcional)"
          value={source}
          onChange={(e) => onSourceChange(e.target.value)}
          placeholder="Ex: Empresa XYZ, Cliente ABC"
        />

        <div>
          <label
            htmlFor="notes"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Notas (opcional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="Observações adicionais..."
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            id="is_recurring"
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => onRecurringChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor="is_recurring"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Ganho recorrente
          </label>
        </div>

        {isRecurring && (
          <Select
            id="recurring_interval"
            label="Intervalo de recorrência"
            value={recurringInterval}
            onChange={(e) => onIntervalChange(e.target.value)}
            options={intervalOptions}
            placeholder="Selecione o intervalo"
          />
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={() => window.history.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Ganho'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
