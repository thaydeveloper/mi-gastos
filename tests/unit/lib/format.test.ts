/**
 * @fileoverview Unit tests for formatting utilities.
 */

import { formatCurrency, formatDate, formatNumber } from '@/lib/utils/format';

describe('formatCurrency', () => {
  it('should format number as BRL currency', () => {
    const result = formatCurrency(1234.56);
    expect(result).toMatch(/R\$\s*1\.234,56/);
  });

  it('should handle zero', () => {
    const result = formatCurrency(0);
    expect(result).toMatch(/R\$\s*0,00/);
  });

  it('should handle large numbers', () => {
    const result = formatCurrency(999999.99);
    expect(result).toMatch(/R\$/);
  });
});

describe('formatDate', () => {
  it('should format ISO date string to dd/MM/yyyy', () => {
    const result = formatDate('2026-03-01');
    expect(result).toBe('01/03/2026');
  });

  it('should format Date object', () => {
    const result = formatDate(new Date(2026, 2, 15));
    expect(result).toBe('15/03/2026');
  });

  it('should support custom format pattern', () => {
    const result = formatDate('2026-03-01', 'yyyy-MM-dd');
    expect(result).toBe('2026-03-01');
  });
});

describe('formatNumber', () => {
  it('should format with Brazilian locale', () => {
    const result = formatNumber(1234);
    expect(result).toBe('1.234');
  });
});
