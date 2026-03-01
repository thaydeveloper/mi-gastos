/**
 * @fileoverview Hook for offline sync management.
 * Monitors online/offline state and triggers sync when reconnecting.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { processSyncQueue, getPendingSyncCount } from '@/lib/offline/sync';

/** Return type for the useOfflineSync hook */
interface OfflineSyncState {
  isOnline: boolean;
  pendingCount: number;
  isSyncing: boolean;
  syncNow: () => Promise<void>;
}

/**
 * Hook that manages offline state and automatic sync on reconnection.
 * @returns Offline sync state and controls
 */
export function useOfflineSync(): OfflineSyncState {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshPendingCount = useCallback(async () => {
    const count = await getPendingSyncCount();
    setPendingCount(count);
  }, []);

  const syncNow = useCallback(async () => {
    if (isSyncing || !navigator.onLine) return;
    setIsSyncing(true);
    try {
      await processSyncQueue();
      await refreshPendingCount();
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, refreshPendingCount]);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    refreshPendingCount();

    const handleOnline = () => {
      setIsOnline(true);
      syncNow();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleSyncMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SYNC_REQUESTED') {
        syncNow();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    navigator.serviceWorker?.addEventListener('message', handleSyncMessage);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      navigator.serviceWorker?.removeEventListener('message', handleSyncMessage);
    };
  }, [refreshPendingCount, syncNow]);

  return { isOnline, pendingCount, isSyncing, syncNow };
}
