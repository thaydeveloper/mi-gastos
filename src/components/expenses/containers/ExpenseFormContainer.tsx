/**
 * @fileoverview Container for the expense form.
 * Manages form state, validation, and server action calls.
 */

'use client';

import { useState } from 'react';
import type { Category, ExpenseWithCategory } from '@/types';
import { createExpense, updateExpense } from '@/app/(dashboard)/expenses/actions';
import { ExpenseFormView } from '../presentation/ExpenseFormView';

/** Props for ExpenseFormContainer */
interface ExpenseFormContainerProps {
  categories: Category[];
  expense?: ExpenseWithCategory | null;
}

/** Container managing expense form state and submission */
export function ExpenseFormContainer({ categories, expense }: ExpenseFormContainerProps) {
  const isEditing = !!expense;
  const [description, setDescription] = useState(expense?.description ?? '');
  const [amount, setAmount] = useState(expense?.amount?.toString() ?? '');
  const [date, setDate] = useState(expense?.date ?? new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState(expense?.category_id ?? '');
  const [notes, setNotes] = useState(expense?.notes ?? '');
  const [isRecurring, setIsRecurring] = useState(expense?.is_recurring ?? false);
  const [recurringInterval, setRecurringInterval] = useState(expense?.recurring_interval ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set('description', description);
    formData.set('amount', amount);
    formData.set('date', date);
    formData.set('category_id', categoryId);
    formData.set('notes', notes);
    formData.set('is_recurring', String(isRecurring));
    formData.set('recurring_interval', isRecurring ? recurringInterval : '');

    const result = isEditing
      ? await updateExpense(expense.id, formData)
      : await createExpense(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <ExpenseFormView
      isEditing={isEditing}
      description={description}
      amount={amount}
      date={date}
      categoryId={categoryId}
      notes={notes}
      isRecurring={isRecurring}
      recurringInterval={recurringInterval}
      error={error}
      loading={loading}
      categories={categoryOptions}
      onDescriptionChange={setDescription}
      onAmountChange={setAmount}
      onDateChange={setDate}
      onCategoryChange={setCategoryId}
      onNotesChange={setNotes}
      onRecurringChange={setIsRecurring}
      onIntervalChange={setRecurringInterval}
      onSubmit={handleSubmit}
    />
  );
}
