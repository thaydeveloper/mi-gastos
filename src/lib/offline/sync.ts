/**
 * @fileoverview Offline sync engine.
 * Replays queued operations against Supabase when back online.
 */

import { offlineDb } from './db';
import { createClient } from '@/lib/supabase/client';

/**
 * Processes all pending sync queue items against Supabase.
 * @returns Number of items synced
 */
export async function processSyncQueue(): Promise<number> {
  const supabase = createClient();
  const items = await offlineDb.syncQueue.orderBy('createdAt').toArray();

  if (items.length === 0) return 0;

  let synced = 0;

  for (const item of items) {
    try {
      switch (item.operation) {
        case 'create': {
          const { error } = await supabase
            .from(item.table)
            .insert(item.payload as Record<string, unknown>);
          if (error) throw error;
          break;
        }
        case 'update': {
          const { error } = await supabase
            .from(item.table)
            .update(item.payload as Record<string, unknown>)
            .eq('id', item.recordId);
          if (error) throw error;
          break;
        }
        case 'delete': {
          const { error } = await supabase
            .from(item.table)
            .delete()
            .eq('id', item.recordId);
          if (error) throw error;
          break;
        }
      }

      await offlineDb.syncQueue.delete(item.id!);
      synced++;
    } catch (error) {
      console.error('Sync failed for item:', item.id, error);
      break; // Stop on first failure to maintain order
    }
  }

  return synced;
}

/**
 * Adds an operation to the offline sync queue.
 * @param operation - Type of operation (create, update, delete)
 * @param table - Table name
 * @param recordId - Record UUID
 * @param payload - Data for the operation
 */
export async function queueOfflineOperation(
  operation: 'create' | 'update' | 'delete',
  table: string,
  recordId: string,
  payload: Record<string, unknown> | null,
): Promise<void> {
  await offlineDb.syncQueue.add({
    operation,
    table,
    recordId,
    payload,
    createdAt: new Date(),
  });
}

/**
 * Returns the number of pending sync operations.
 */
export async function getPendingSyncCount(): Promise<number> {
  return offlineDb.syncQueue.count();
}
