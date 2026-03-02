/**
 * @fileoverview Server Actions for income CRUD operations.
 */

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { incomeSchema } from '@/lib/schemas/income';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

/**
 * Calculates the next recurring date based on the interval.
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
 * Creates a new income entry.
 * @param formData - Form data with income fields
 */
export async function createIncome(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Não autenticado');

  const raw = {
    amount: formData.get('amount'),
    description: formData.get('description'),
    notes: formData.get('notes') || null,
    date: formData.get('date'),
    source: formData.get('source') || null,
    is_recurring: formData.get('is_recurring') === 'true',
    recurring_interval: formData.get('recurring_interval') || null,
  };

  const parsed = incomeSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const dateStr = parsed.data.date.toISOString().split('T')[0];

  const { error } = await supabase.from('incomes').insert({
    user_id: user.id,
    amount: parsed.data.amount,
    description: parsed.data.description,
    notes: parsed.data.notes,
    date: dateStr,
    source: parsed.data.source,
    is_recurring: parsed.data.is_recurring,
    recurring_interval: parsed.data.recurring_interval,
    recurring_next_date:
      parsed.data.is_recurring && parsed.data.recurring_interval
        ? getNextRecurringDate(parsed.data.date, parsed.data.recurring_interval)
        : null,
  });

  if (error) return { error: error.message };

  revalidatePath('/incomes');
  revalidatePath('/');
  redirect('/incomes');
}

/**
 * Updates an existing income entry.
 * @param id - Income UUID
 * @param formData - Form data with updated fields
 */
export async function updateIncome(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Não autenticado');

  const raw = {
    amount: formData.get('amount'),
    description: formData.get('description'),
    notes: formData.get('notes') || null,
    date: formData.get('date'),
    source: formData.get('source') || null,
    is_recurring: formData.get('is_recurring') === 'true',
    recurring_interval: formData.get('recurring_interval') || null,
  };

  const parsed = incomeSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const dateStr = parsed.data.date.toISOString().split('T')[0];

  const { error } = await supabase
    .from('incomes')
    .update({
      amount: parsed.data.amount,
      description: parsed.data.description,
      notes: parsed.data.notes,
      date: dateStr,
      source: parsed.data.source,
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

  revalidatePath('/incomes');
  revalidatePath('/');
  redirect('/incomes');
}

/**
 * Deletes an income entry by ID.
 * @param id - Income UUID
 */
export async function deleteIncome(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Não autenticado');

  const { error } = await supabase.from('incomes').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/incomes');
  revalidatePath('/');
  return { success: true };
}
