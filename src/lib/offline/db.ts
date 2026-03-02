/**
 * @fileoverview Dexie (IndexedDB) database schema for offline support.
 */

import Dexie, { type EntityTable } from 'dexie';
import type { SyncQueueItem } from '@/types';

/** Local expense cache for offline access */
interface LocalExpense {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  description: string;
  notes: string | null;
  date: string;
  is_recurring: boolean;
  recurring_interval: string | null;
  created_at: string;
  updated_at: string;
}

/** Local income cache for offline access */
interface LocalIncome {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  notes: string | null;
  date: string;
  source: string | null;
  is_recurring: boolean;
  recurring_interval: string | null;
  created_at: string;
  updated_at: string;
}

/** Dexie database for offline data */
class MeusGastosDB extends Dexie {
  expenses!: EntityTable<LocalExpense, 'id'>;
  incomes!: EntityTable<LocalIncome, 'id'>;
  syncQueue!: EntityTable<SyncQueueItem, 'id'>;

  constructor() {
    super('meus-gastos-offline');
    this.version(1).stores({
      expenses: 'id, user_id, date, category_id',
      syncQueue: '++id, table, operation, createdAt',
    });
    this.version(2).stores({
      expenses: 'id, user_id, date, category_id',
      incomes: 'id, user_id, date',
      syncQueue: '++id, table, operation, createdAt',
    });
  }
}

/** Singleton database instance */
export const offlineDb = new MeusGastosDB();
