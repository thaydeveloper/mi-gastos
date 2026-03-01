/**
 * @fileoverview Unit tests for Zod validation schemas.
 */

import { expenseSchema, expenseFilterSchema } from '@/lib/schemas/expense';
import { categorySchema } from '@/lib/schemas/category';
import { loginSchema, registerSchema } from '@/lib/schemas/auth';

describe('expenseSchema', () => {
  it('should validate a valid expense', () => {
    const result = expenseSchema.safeParse({
      category_id: '550e8400-e29b-41d4-a716-446655440000',
      amount: 50.0,
      description: 'Almoço',
      date: '2026-03-01',
      is_recurring: false,
    });
    expect(result.success).toBe(true);
  });

  it('should reject negative amount', () => {
    const result = expenseSchema.safeParse({
      category_id: null,
      amount: -10,
      description: 'Test',
      date: '2026-03-01',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty description', () => {
    const result = expenseSchema.safeParse({
      category_id: null,
      amount: 10,
      description: '',
      date: '2026-03-01',
    });
    expect(result.success).toBe(false);
  });

  it('should accept null category_id', () => {
    const result = expenseSchema.safeParse({
      category_id: null,
      amount: 100,
      description: 'Compra',
      date: '2026-03-01',
    });
    expect(result.success).toBe(true);
  });

  it('should coerce amount from string', () => {
    const result = expenseSchema.safeParse({
      category_id: null,
      amount: '25.50',
      description: 'Test',
      date: '2026-03-01',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.amount).toBe(25.5);
    }
  });
});

describe('expenseFilterSchema', () => {
  it('should validate empty filters with default page', () => {
    const result = expenseFilterSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
    }
  });

  it('should validate complete filters', () => {
    const result = expenseFilterSchema.safeParse({
      date_from: '2026-01-01',
      date_to: '2026-03-01',
      amount_min: 10,
      amount_max: 1000,
      category_id: '550e8400-e29b-41d4-a716-446655440000',
      search: 'almoço',
      page: 2,
    });
    expect(result.success).toBe(true);
  });
});

describe('categorySchema', () => {
  it('should validate a valid category', () => {
    const result = categorySchema.safeParse({
      name: 'Alimentação',
      color: '#ef4444',
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty name', () => {
    const result = categorySchema.safeParse({
      name: '',
      color: '#ef4444',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid hex color', () => {
    const result = categorySchema.safeParse({
      name: 'Test',
      color: 'not-a-color',
    });
    expect(result.success).toBe(false);
  });

  it('should use default color', () => {
    const result = categorySchema.safeParse({
      name: 'Test',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.color).toBe('#6366f1');
    }
  });
});

describe('loginSchema', () => {
  it('should validate valid credentials', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: '123456',
    });
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '12345',
    });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('should validate valid registration', () => {
    const result = registerSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      password: '123456',
      confirmPassword: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('should reject password mismatch', () => {
    const result = registerSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      password: '123456',
      confirmPassword: '654321',
    });
    expect(result.success).toBe(false);
  });
});
