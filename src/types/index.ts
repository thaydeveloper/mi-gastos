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

/** Push subscription row type */
export type PushSubscription = Database['public']['Tables']['push_subscriptions']['Row'];

/** Dashboard summary data */
export interface DashboardSummary {
  totalMonth: number;
  averagePerDay: number;
  expenseCount: number;
  previousMonthTotal: number;
}

/** Spending by category for charts */
export interface SpendingByCategory {
  name: string;
  color: string;
  value: number;
}

/** Spending over time for charts */
export interface SpendingOverTime {
  month: string;
  total: number;
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
