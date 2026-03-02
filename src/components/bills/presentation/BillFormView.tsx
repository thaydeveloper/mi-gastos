/**
 * @fileoverview Presentation component for bill create/edit form.
 */

'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface BillFormViewProps {
  isEditing: boolean;
  name: string;
  amount: string;
  dueDay: string;
  categoryId: string;
  notes: string;
  error: string | null;
  loading: boolean;
  categories: Array<{ value: string; label: string }>;
  onNameChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onDueDayChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function BillFormView({
  isEditing,
  name,
  amount,
  dueDay,
  categoryId,
  notes,
  error,
  loading,
  categories,
  onNameChange,
  onAmountChange,
  onDueDayChange,
  onCategoryChange,
  onNotesChange,
  onSubmit,
}: BillFormViewProps) {
  return (
    <Card className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
        {isEditing ? 'Editar Conta' : 'Nova Conta Mensal'}
      </h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          id="name"
          label="Nome da conta"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Ex: Aluguel, Internet, Netflix"
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

          <Input
            id="due_day"
            label="Dia de vencimento"
            type="number"
            min="1"
            max="31"
            value={dueDay}
            onChange={(e) => onDueDayChange(e.target.value)}
            placeholder="Ex: 10"
            required
          />
        </div>

        <Select
          id="category"
          label="Categoria (opcional)"
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
          options={categories}
          placeholder="Selecione uma categoria"
        />

        <div>
          <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notas (opcional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="Observações..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={() => window.history.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Conta'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
