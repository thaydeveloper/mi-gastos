/**
 * @fileoverview Server Actions for expense CRUD operations.
 */

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { expenseSchema } from '@/lib/schemas/expense';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

/**
 * Calculates the next recurring date based on the interval.
 * @param date - Current date
 * @param interval - Recurring interval type
 * @returns Next occurrence date as ISO string
 */
function getNextRecurringDate(date: Date, interval: string): string {
  switch (interval) {
    case 'daily':
      return addDays(date, 1).toISOString().split('T')[0];
    case 'weekly':
      return addWeeks(date, 1).toISOString().split('T')[0];
    case 'monthly':
      return addMonths(date, 1).toISOString().split('T')[0];
    case 'yearly':
      return addYears(date, 1).toISOString().split('T')[0];
    default:
      return date.toISOString().split('T')[0];
  }
}

/**
 * Creates a new expense.
 * @param formData - Form data with expense fields
 */
export async function createExpense(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Não autenticado');

  const raw = {
    category_id: formData.get('category_id') || null,
    amount: formData.get('amount'),
    description: formData.get('description'),
    notes: formData.get('notes') || null,
    date: formData.get('date'),
    is_recurring: formData.get('is_recurring') === 'true',
    recurring_interval: formData.get('recurring_interval') || null,
  };

  const parsed = expenseSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const dateStr = parsed.data.date.toISOString().split('T')[0];

  const { error } = await supabase.from('expenses').insert({
    user_id: user.id,
    category_id: parsed.data.category_id,
    amount: parsed.data.amount,
    description: parsed.data.description,
    notes: parsed.data.notes,
    date: dateStr,
    is_recurring: parsed.data.is_recurring,
    recurring_interval: parsed.data.recurring_interval,
    recurring_next_date:
      parsed.data.is_recurring && parsed.data.recurring_interval
        ? getNextRecurringDate(parsed.data.date, parsed.data.recurring_interval)
        : null,
  });

  if (error) return { error: error.message };

  revalidatePath('/expenses');
  revalidatePath('/');
  redirect('/expenses');
}

/**
 * Updates an existing expense.
 * @param id - Expense UUID
 * @param formData - Form data with updated fields
 */
export async function updateExpense(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Não autenticado');

  const raw = {
    category_id: formData.get('category_id') || null,
    amount: formData.get('amount'),
    description: formData.get('description'),
    notes: formData.get('notes') || null,
    date: formData.get('date'),
    is_recurring: formData.get('is_recurring') === 'true',
    recurring_interval: formData.get('recurring_interval') || null,
  };

  const parsed = expenseSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const dateStr = parsed.data.date.toISOString().split('T')[0];

  const { error } = await supabase
    .from('expenses')
    .update({
      category_id: parsed.data.category_id,
      amount: parsed.data.amount,
      description: parsed.data.description,
      notes: parsed.data.notes,
      date: dateStr,
      is_recurring: parsed.data.is_recurring,
      recurring_interval: parsed.data.recurring_interval,
      recurring_next_date:
        parsed.data.is_recurring && parsed.data.recurring_interval
          ? getNextRecurringDate(parsed.data.date, parsed.data.recurring_interval)
          : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/expenses');
  revalidatePath('/');
  redirect('/expenses');
}

/**
 * Deletes an expense by ID.
 * @param id - Expense UUID
 */
export async function deleteExpense(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Não autenticado');

  const { error } = await supabase.from('expenses').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/expenses');
  revalidatePath('/');
  return { success: true };
}
