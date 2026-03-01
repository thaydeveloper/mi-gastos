/**
 * @fileoverview Zod validation schemas for category operations.
 */

import { z } from 'zod';

/** Schema for creating/updating a category */
export const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome muito longo').trim(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Cor deve ser um hex válido (#RRGGBB)')
    .default('#6366f1'),
  icon: z.string().max(50).nullable().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
