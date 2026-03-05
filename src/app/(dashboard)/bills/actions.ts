/**
 * @fileoverview Server Actions for bills and bill payments.
 */

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { billSchema } from '@/lib/schemas/bill';

/**
 * Creates a new bill definition.
 */
export async function createBill(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Não autenticado');

  const raw = {
    name: formData.get('name'),
    amount: formData.get('amount'),
    due_day: formData.get('due_day'),
    category_id: formData.get('category_id') || null,
    notes: formData.get('notes') || null,
    is_active: true,
  };

  const parsed = billSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase.from('bills').insert({
    user_id: user.id,
    name: parsed.data.name,
    amount: parsed.data.amount,
    due_day: parsed.data.due_day,
    category_id: parsed.data.category_id ?? null,
    notes: parsed.data.notes,
    is_active: parsed.data.is_active,
  });

  if (error) return { error: error.message };

  revalidatePath('/bills');
  redirect('/bills');
}

/**
 * Updates an existing bill definition.
 */
export async function updateBill(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Não autenticado');

  const raw = {
    name: formData.get('name'),
    amount: formData.get('amount'),
    due_day: formData.get('due_day'),
    category_id: formData.get('category_id') || null,
    notes: formData.get('notes') || null,
    is_active: formData.get('is_active') !== 'false',
  };

  const parsed = billSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from('bills')
    .update({
      name: parsed.data.name,
      amount: parsed.data.amount,
      due_day: parsed.data.due_day,
      category_id: parsed.data.category_id ?? null,
      notes: parsed.data.notes,
      is_active: parsed.data.is_active,
    })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/bills');
  redirect('/bills');
}

/**
 * Deletes a bill definition (and all its payments cascade).
 */
export async function deleteBill(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Não autenticado');

  const { error } = await supabase.from('bills').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/bills');
  return { success: true };
}

/**
 * Toggles the paid status of a bill for a given month/year.
 * Uses upsert on the unique (bill_id, year, month) constraint — single DB round-trip.
 */
export async function toggleBillPayment(
  billId: string,
  year: number,
  month: number,
  currentlyPaid: boolean,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Não autenticado');

  const newPaid = !currentlyPaid;
  const { error } = await supabase.from('bill_payments').upsert(
    {
      bill_id: billId,
      user_id: user.id,
      year,
      month,
      paid: newPaid,
      paid_at: newPaid ? new Date().toISOString() : null,
    },
    { onConflict: 'bill_id,year,month' },
  );

  if (error) return { error: error.message };

  revalidatePath('/bills');
  return { success: true };
}
