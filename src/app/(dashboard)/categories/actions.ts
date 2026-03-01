/**
 * @fileoverview Server Actions for category CRUD operations.
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { categorySchema } from '@/lib/schemas/category';

/**
 * Creates a new category for the authenticated user.
 * @param formData - Form data with name, color, and icon fields
 */
export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Não autenticado');

  const parsed = categorySchema.safeParse({
    name: formData.get('name'),
    color: formData.get('color'),
    icon: formData.get('icon') || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase.from('categories').insert({
    user_id: user.id,
    name: parsed.data.name,
    color: parsed.data.color,
    icon: parsed.data.icon ?? null,
  });

  if (error) return { error: error.message };

  revalidatePath('/categories');
  return { success: true };
}

/**
 * Updates an existing category.
 * @param id - Category UUID
 * @param formData - Form data with updated fields
 */
export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Não autenticado');

  const parsed = categorySchema.safeParse({
    name: formData.get('name'),
    color: formData.get('color'),
    icon: formData.get('icon') || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from('categories')
    .update({
      name: parsed.data.name,
      color: parsed.data.color,
      icon: parsed.data.icon ?? null,
    })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/categories');
  return { success: true };
}

/**
 * Deletes a category by ID.
 * @param id - Category UUID
 */
export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Não autenticado');

  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/categories');
  return { success: true };
}
