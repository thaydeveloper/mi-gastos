/**
 * @fileoverview Container for the bill definition form.
 */

'use client';

import { useState } from 'react';
import type { Bill, Category } from '@/types';
import { createBill, updateBill } from '@/app/(dashboard)/bills/actions';
import { BillFormView } from '../presentation/BillFormView';

interface BillFormContainerProps {
  bill?: Bill | null;
  categories: Category[];
}

export function BillFormContainer({ bill, categories }: BillFormContainerProps) {
  const isEditing = !!bill;
  const [name, setName] = useState(bill?.name ?? '');
  const [amount, setAmount] = useState(bill?.amount?.toString() ?? '');
  const [dueDay, setDueDay] = useState(bill?.due_day?.toString() ?? '');
  const [categoryId, setCategoryId] = useState(bill?.category_id ?? '');
  const [notes, setNotes] = useState(bill?.notes ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set('name', name);
    formData.set('amount', amount);
    formData.set('due_day', dueDay);
    formData.set('category_id', categoryId);
    formData.set('notes', notes);

    const result = isEditing
      ? await updateBill(bill.id, formData)
      : await createBill(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <BillFormView
      isEditing={isEditing}
      name={name}
      amount={amount}
      dueDay={dueDay}
      categoryId={categoryId}
      notes={notes}
      error={error}
      loading={loading}
      categories={categoryOptions}
      onNameChange={setName}
      onAmountChange={setAmount}
      onDueDayChange={setDueDay}
      onCategoryChange={setCategoryId}
      onNotesChange={setNotes}
      onSubmit={handleSubmit}
    />
  );
}
