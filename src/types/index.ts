/**
 * @fileoverview Shared application type definitions.
 */

import type { Database } from './supabase';

/** Category row type from Supabase */
export type Category = Database['public']['Tables']['categories']['Row'];

/** Category insert type */
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];

/** Expense row type from Supabase */
export type Expense = Database['public']['Tables']['expenses']['Row'];

/** Expense insert type */
export type ExpenseInsert = Database['public']['Tables']['expenses']['Insert'];

/** Expense with joined category data */
export interface ExpenseWithCategory extends Expense {
  categories: Pick<Category, 'name' | 'color' | 'icon'> | null;
}

/** Income row type from Supabase */
export type Income = Database['public']['Tables']['incomes']['Row'];

/** Income insert type */
export type IncomeInsert = Database['public']['Tables']['incomes']['Insert'];

/** Bill row type from Supabase */
export type Bill = Database['public']['Tables']['bills']['Row'];

/** Bill insert type */
export type BillInsert = Database['public']['Tables']['bills']['Insert'];

/** Bill payment row type from Supabase */
export type BillPayment = Database['public']['Tables']['bill_payments']['Row'];

/** Bill with its current month payment status */
export interface BillWithPayment extends Bill {
  categories: Pick<Category, 'name' | 'color'> | null;
  payment: BillPayment | null;
}

/** Push subscription row type */
export type PushSubscription = Database['public']['Tables']['push_subscriptions']['Row'];

/** Dashboard summary data */
export interface DashboardSummary {
  totalMonthExpenses: number;
  totalMonthIncome: number;
  balance: number;
  previousMonthBalance: number;
}

/** Spending by category for charts */
export interface SpendingByCategory {
  name: string;
  color: string;
  value: number;
}

/** Monthly income vs expenses for charts */
export interface MonthlyBalance {
  month: string;
  expenses: number;
  income: number;
}

/** Offline sync queue item */
export interface SyncQueueItem {
  id?: number;
  operation: 'create' | 'update' | 'delete';
  table: string;
  recordId: string;
  payload: Record<string, unknown> | null;
  createdAt: Date;
}
