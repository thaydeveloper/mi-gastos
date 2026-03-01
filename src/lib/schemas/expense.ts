/**
 * @fileoverview Zod validation schemas for expense operations and filtering.
 */

import { z } from 'zod';

/** Schema for creating/updating an expense */
export const expenseSchema = z.object({
  category_id: z.string().uuid('Categoria inválida').nullable(),
  amount: z.coerce
    .number()
    .positive('Valor deve ser positivo')
    .max(999999999.99, 'Valor máximo excedido'),
  description: z.string().min(1, 'Descrição é obrigatória').max(255).trim(),
  notes: z.string().max(1000).trim().optional().nullable(),
  date: z.coerce.date(),
  is_recurring: z.boolean().default(false),
  recurring_interval: z.enum(['daily', 'weekly', 'monthly', 'yearly']).nullable().optional(),
});

/** Schema for expense filter parameters */
export const expenseFilterSchema = z.object({
  date_from: z.coerce.date().optional(),
  date_to: z.coerce.date().optional(),
  amount_min: z.coerce.number().nonnegative().optional(),
  amount_max: z.coerce.number().positive().optional(),
  category_id: z.string().uuid().optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
export type ExpenseFilter = z.infer<typeof expenseFilterSchema>;
