/**
 * @fileoverview Formatting utilities for currency, dates, and numbers in pt-BR.
 */

import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formats a number as Brazilian Real currency.
 * @param value - The numeric value to format
 * @returns Formatted currency string (e.g., "R$ 1.234,56")
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formats a date string to Brazilian format.
 * @param date - ISO date string or Date object
 * @param pattern - date-fns format pattern (default: "dd/MM/yyyy")
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, pattern = 'dd/MM/yyyy'): string {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return format(parsed, pattern, { locale: ptBR });
}

/**
 * Formats a date to a month/year label.
 * @param date - ISO date string or Date object
 * @returns Month and year string (e.g., "Mar 2026")
 */
export function formatMonthYear(date: string | Date): string {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return format(parsed, 'MMM yyyy', { locale: ptBR });
}

/**
 * Formats a compact number for display.
 * @param value - Number to format
 * @returns Formatted number string
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}
