/**
 * @fileoverview Zod validation schemas for bill operations.
 */

import { z } from 'zod';

/** Schema for creating/updating a bill definition */
export const billSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100).trim(),
  amount: z.coerce
    .number()
    .positive('Valor deve ser positivo')
    .max(999999999.99, 'Valor máximo excedido'),
  due_day: z.coerce
    .number()
    .int()
    .min(1, 'Dia deve ser entre 1 e 31')
    .max(31, 'Dia deve ser entre 1 e 31'),
  category_id: z.string().uuid('Categoria inválida').nullable().optional(),
  notes: z.string().max(500).trim().optional().nullable(),
  is_active: z.boolean().default(true),
});

export type BillInput = z.infer<typeof billSchema>;
