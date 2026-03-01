/**
 * @fileoverview Unit tests for CSV export utility.
 */

import { generateExpenseCSV } from '@/lib/utils/export-csv';
import type { ExpenseWithCategory } from '@/types';

const mockExpenses: ExpenseWithCategory[] = [
  {
    id: '1',
    user_id: 'user-1',
    category_id: 'cat-1',
    amount: 50.0,
    description: 'Almoço',
    notes: 'No restaurante',
    date: '2026-03-01',
    is_recurring: false,
    recurring_interval: null,
    recurring_next_date: null,
    created_at: '2026-03-01T12:00:00Z',
    updated_at: '2026-03-01T12:00:00Z',
    categories: { name: 'Alimentação', color: '#ef4444', icon: 'utensils' },
  },
  {
    id: '2',
    user_id: 'user-1',
    category_id: null,
    amount: 100.0,
    description: 'Uber',
    notes: null,
    date: '2026-03-02',
    is_recurring: true,
    recurring_interval: 'monthly',
    recurring_next_date: '2026-04-02',
    created_at: '2026-03-02T12:00:00Z',
    updated_at: '2026-03-02T12:00:00Z',
    categories: null,
  },
];

describe('generateExpenseCSV', () => {
  it('should generate CSV with header and rows', () => {
    const csv = generateExpenseCSV(mockExpenses);
    const lines = csv.split('\n');

    expect(lines[0]).toBe('Data,Descrição,Categoria,Valor,Recorrente,Intervalo,Notas');
    expect(lines.length).toBe(3); // header + 2 rows
  });

  it('should include correct data in rows', () => {
    const csv = generateExpenseCSV(mockExpenses);
    const lines = csv.split('\n');

    expect(lines[1]).toContain('2026-03-01');
    expect(lines[1]).toContain('"Almoço"');
    expect(lines[1]).toContain('"Alimentação"');
    expect(lines[1]).toContain('50');
    expect(lines[1]).toContain('Não');
  });

  it('should handle recurring expenses', () => {
    const csv = generateExpenseCSV(mockExpenses);
    const lines = csv.split('\n');

    expect(lines[2]).toContain('Sim');
    expect(lines[2]).toContain('monthly');
  });

  it('should handle empty expenses array', () => {
    const csv = generateExpenseCSV([]);
    const lines = csv.split('\n');

    expect(lines.length).toBe(1); // header only
  });

  it('should escape quotes in description', () => {
    const expenses: ExpenseWithCategory[] = [
      {
        ...mockExpenses[0],
        description: 'Test "quoted" value',
      },
    ];
    const csv = generateExpenseCSV(expenses);
    expect(csv).toContain('"Test ""quoted"" value"');
  });
});
