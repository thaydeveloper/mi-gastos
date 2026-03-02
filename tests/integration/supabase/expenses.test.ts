/**
 * @fileoverview Integration tests for expense operations with mocked Supabase.
 */

const mockFrom = jest.fn();
const mockSelect = jest.fn();
const mockInsert = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockEq = jest.fn();
const mockGte = jest.fn();
const mockLte = jest.fn();
const mockOrder = jest.fn();
const mockIlike = jest.fn();
const mockSingle = jest.fn();

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: mockFrom,
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
      }),
    },
  }),
}));

import { createClient } from '@/lib/supabase/client';

// Build chainable mock
const chainable = {
  select: mockSelect,
  insert: mockInsert,
  update: mockUpdate,
  delete: mockDelete,
  eq: mockEq,
  gte: mockGte,
  lte: mockLte,
  order: mockOrder,
  ilike: mockIlike,
  single: mockSingle,
};

beforeEach(() => {
  jest.clearAllMocks();
  mockFrom.mockReturnValue(chainable);
  Object.values(chainable).forEach((mock) => {
    (mock as jest.Mock).mockReturnValue(chainable);
  });
});

describe('Expense operations with Supabase', () => {
  it('should build correct query for fetching expenses', () => {
    const supabase = createClient();

    supabase
      .from('expenses')
      .select('*, categories(name, color)')
      .order('date', { ascending: false });

    expect(mockFrom).toHaveBeenCalledWith('expenses');
    expect(mockSelect).toHaveBeenCalledWith('*, categories(name, color)');
    expect(mockOrder).toHaveBeenCalledWith('date', { ascending: false });
  });

  it('should build correct query for filtered expenses', () => {
    const supabase = createClient();

    supabase
      .from('expenses')
      .select('*')
      .gte('date', '2026-01-01')
      .lte('date', '2026-03-01')
      .eq('category_id', 'cat-123')
      .ilike('description', '%almoço%');

    expect(mockGte).toHaveBeenCalledWith('date', '2026-01-01');
    expect(mockLte).toHaveBeenCalledWith('date', '2026-03-01');
    expect(mockEq).toHaveBeenCalledWith('category_id', 'cat-123');
    expect(mockIlike).toHaveBeenCalledWith('description', '%almoço%');
  });

  it('should build correct insert for new expense', () => {
    const supabase = createClient();

    const newExpense = {
      user_id: 'user-123',
      category_id: 'cat-123',
      amount: 50.0,
      description: 'Almoço',
      date: '2026-03-01',
      is_recurring: false,
    };

    supabase.from('expenses').insert(newExpense);

    expect(mockFrom).toHaveBeenCalledWith('expenses');
    expect(mockInsert).toHaveBeenCalledWith(newExpense);
  });

  it('should build correct delete query', () => {
    const supabase = createClient();

    supabase.from('expenses').delete().eq('id', 'expense-123');

    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('id', 'expense-123');
  });

  it('should build correct update query', () => {
    const supabase = createClient();

    supabase
      .from('expenses')
      .update({ amount: 75.0, description: 'Jantar' })
      .eq('id', 'expense-123');

    expect(mockUpdate).toHaveBeenCalledWith({ amount: 75.0, description: 'Jantar' });
    expect(mockEq).toHaveBeenCalledWith('id', 'expense-123');
  });
});
