/**
 * @fileoverview Zod validation schemas for income operations.
 */

import { z } from 'zod';

/** Schema for creating/updating an income */
export const incomeSchema = z.object({
  amount: z.coerce
    .number()
    .positive('Valor deve ser positivo')
    .max(999999999.99, 'Valor máximo excedido'),
  description: z.string().min(1, 'Descrição é obrigatória').max(255).trim(),
  notes: z.string().max(1000).trim().optional().nullable(),
  date: z.coerce.date(),
  source: z.string().max(100).trim().optional().nullable(),
  is_recurring: z.boolean().default(false),
  recurring_interval: z.enum(['daily', 'weekly', 'monthly', 'yearly']).nullable().optional(),
});

export type IncomeInput = z.infer<typeof incomeSchema>;
