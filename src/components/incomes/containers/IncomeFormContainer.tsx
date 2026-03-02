/**
 * @fileoverview Container for the income form.
 * Manages form state, validation, and server action calls.
 */

'use client';

import { useState } from 'react';
import type { Income } from '@/types';
import { createIncome, updateIncome } from '@/app/(dashboard)/incomes/actions';
import { IncomeFormView } from '../presentation/IncomeFormView';

/** Props for IncomeFormContainer */
interface IncomeFormContainerProps {
  income?: Income | null;
}

/** Container managing income form state and submission */
export function IncomeFormContainer({ income }: IncomeFormContainerProps) {
  const isEditing = !!income;
  const [description, setDescription] = useState(income?.description ?? '');
  const [amount, setAmount] = useState(income?.amount?.toString() ?? '');
  const [date, setDate] = useState(income?.date ?? new Date().toISOString().split('T')[0]);
  const [source, setSource] = useState(income?.source ?? '');
  const [notes, setNotes] = useState(income?.notes ?? '');
  const [isRecurring, setIsRecurring] = useState(income?.is_recurring ?? false);
  const [recurringInterval, setRecurringInterval] = useState(income?.recurring_interval ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set('description', description);
    formData.set('amount', amount);
    formData.set('date', date);
    formData.set('source', source);
    formData.set('notes', notes);
    formData.set('is_recurring', String(isRecurring));
    formData.set('recurring_interval', isRecurring ? recurringInterval : '');

    const result = isEditing
      ? await updateIncome(income.id, formData)
      : await createIncome(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <IncomeFormView
      isEditing={isEditing}
      description={description}
      amount={amount}
      date={date}
      source={source}
      notes={notes}
      isRecurring={isRecurring}
      recurringInterval={recurringInterval}
      error={error}
      loading={loading}
      onDescriptionChange={setDescription}
      onAmountChange={setAmount}
      onDateChange={setDate}
      onSourceChange={setSource}
      onNotesChange={setNotes}
      onRecurringChange={setIsRecurring}
      onIntervalChange={setRecurringInterval}
      onSubmit={handleSubmit}
    />
  );
}
