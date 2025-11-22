/**
 * Sync Manager
 * Handles background synchronization with conflict resolution
 */

import {
  addToSyncQueue,
  getUnsyncedItems,
  markAsSynced,
  updateSyncError,
  getSyncQueueStatus,
  clearSyncedItems,
  type SyncQueueItem,
} from './indexeddb';

export interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  errors: Array<{ id: number; error: string }>;
}

export interface ConflictResolution {
  strategy: 'server_wins' | 'client_wins' | 'merge' | 'prompt_user';
  serverVersion?: any;
  clientVersion?: any;
  resolvedVersion?: any;
}

/**
 * Register background sync
 */
export async function registerBackgroundSync(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported');
    return false;
  }

  if (!('sync' in ServiceWorkerRegistration.prototype)) {
    console.warn('Background Sync not supported');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await (registration as any).sync.register('sync-bible-data');
    console.log('Background sync registered successfully');
    return true;
  } catch (error) {
    console.error('Failed to register background sync:', error);
    return false;
  }
}

/**
 * Manually trigger sync (for testing or immediate sync)
 */
export async function triggerSync(): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    synced: 0,
    failed: 0,
    errors: [],
  };

  try {
    const unsyncedItems = await getUnsyncedItems();
    console.log(`Found ${unsyncedItems.length} items to sync`);

    for (const item of unsyncedItems) {
      try {
        await syncItem(item);
        await markAsSynced(item.id!);
        result.synced++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await updateSyncError(item.id!, errorMessage);
        result.failed++;
        result.errors.push({ id: item.id!, error: errorMessage });
      }
    }

    // Clean up synced items periodically
    if (result.synced > 0) {
      await clearSyncedItems();
    }

    result.success = result.failed === 0;
    return result;
  } catch (error) {
    console.error('Sync failed:', error);
    result.success = false;
    return result;
  }
}

/**
 * Sync individual item to server
 */
async function syncItem(item: SyncQueueItem): Promise<void> {
  const endpoint = getSyncEndpoint(item.type);
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: item.action,
        data: item.data,
        timestamp: item.timestamp,
      }),
    });

    if (!response.ok) {
      // Check for conflict (409)
      if (response.status === 409) {
        const serverData = await response.json();
        const resolution = await resolveConflict(item, serverData);
        
        if (resolution.strategy !== 'client_wins') {
          // Re-sync with resolved data
          const retryResponse = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: item.action,
              data: resolution.resolvedVersion,
              timestamp: Date.now(),
              conflictResolved: true,
            }),
          });

          if (!retryResponse.ok) {
            throw new Error(`Sync failed after conflict resolution: ${retryResponse.status}`);
          }
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }

    console.log(`Successfully synced item ${item.id}`);
  } catch (error) {
    console.error(`Failed to sync item ${item.id}:`, error);
    throw error;
  }
}

/**
 * Get sync endpoint based on item type
 */
function getSyncEndpoint(type: string): string {
  const endpoints: Record<string, string> = {
    bookmark: '/api/sync/bookmarks',
    note: '/api/sync/notes',
    highlight: '/api/sync/highlights',
    custom: '/api/sync/custom',
  };

  return endpoints[type] || '/api/sync';
}

/**
 * Resolve conflict between client and server data
 */
async function resolveConflict(
  clientItem: SyncQueueItem,
  serverData: any
): Promise<ConflictResolution> {
  // Default strategy: server wins (most conservative)
  const strategy: ConflictResolution['strategy'] = 'server_wins';

  // Compare timestamps
  const clientTimestamp = clientItem.timestamp;
  const serverTimestamp = serverData.timestamp || 0;

  if (clientTimestamp > serverTimestamp) {
    // Client data is newer - client wins
    return {
      strategy: 'client_wins',
      clientVersion: clientItem.data,
      serverVersion: serverData,
      resolvedVersion: clientItem.data,
    };
  } else if (serverTimestamp > clientTimestamp) {
    // Server data is newer - server wins
    return {
      strategy: 'server_wins',
      clientVersion: clientItem.data,
      serverVersion: serverData,
      resolvedVersion: serverData,
    };
  } else {
    // Same timestamp - attempt merge
    const merged = mergeData(clientItem.data, serverData);
    return {
      strategy: 'merge',
      clientVersion: clientItem.data,
      serverVersion: serverData,
      resolvedVersion: merged,
    };
  }
}

/**
 * Merge client and server data (simple merge strategy)
 */
function mergeData(clientData: any, serverData: any): any {
  // Simple merge: prefer non-null client values, fallback to server
  if (typeof clientData !== 'object' || typeof serverData !== 'object') {
    return clientData || serverData;
  }

  const merged: any = { ...serverData };

  for (const key in clientData) {
    if (clientData[key] !== null && clientData[key] !== undefined) {
      merged[key] = clientData[key];
    }
  }

  return merged;
}

/**
 * Queue bookmark for sync
 */
export async function queueBookmark(
  userId: number,
  verseId: string,
  note: string | null
): Promise<void> {
  const item: Omit<SyncQueueItem, 'id'> = {
    type: 'bookmark',
    action: 'create',
    data: {
      userId,
      verseId,
      note,
      createdAt: Date.now(),
    },
    timestamp: Date.now(),
    synced: false,
    retryCount: 0,
    lastError: null,
  };

  await addToSyncQueue(item);
  await registerBackgroundSync();
}

/**
 * Queue bookmark deletion for sync
 */
export async function queueBookmarkDeletion(
  bookmarkId: number,
  userId: number
): Promise<void> {
  const item: Omit<SyncQueueItem, 'id'> = {
    type: 'bookmark',
    action: 'delete',
    data: {
      id: bookmarkId,
      userId,
    },
    timestamp: Date.now(),
    synced: false,
    retryCount: 0,
    lastError: null,
  };

  await addToSyncQueue(item);
  await registerBackgroundSync();
}

/**
 * Get sync status summary
 */
export async function getSyncStatusSummary(): Promise<{
  status: 'synced' | 'pending' | 'failed' | 'offline';
  message: string;
  details: {
    total: number;
    synced: number;
    pending: number;
    failed: number;
  };
}> {
  const queueStatus = await getSyncQueueStatus();

  if (queueStatus.total === 0) {
    return {
      status: 'synced',
      message: 'All data synced',
      details: queueStatus,
    };
  }

  if (queueStatus.failed > 0) {
    return {
      status: 'failed',
      message: `${queueStatus.failed} items failed to sync`,
      details: queueStatus,
    };
  }

  if (queueStatus.pending > 0) {
    return {
      status: 'pending',
      message: `${queueStatus.pending} items waiting to sync`,
      details: queueStatus,
    };
  }

  if (!navigator.onLine) {
    return {
      status: 'offline',
      message: 'Offline - will sync when online',
      details: queueStatus,
    };
  }

  return {
    status: 'synced',
    message: 'All data synced',
    details: queueStatus,
  };
}

/**
 * Retry failed sync items
 */
export async function retryFailedSyncs(): Promise<SyncResult> {
  const unsyncedItems = await getUnsyncedItems();
  const failedItems = unsyncedItems.filter((item) => item.retryCount > 0);

  const result: SyncResult = {
    success: true,
    synced: 0,
    failed: 0,
    errors: [],
  };

  for (const item of failedItems) {
    try {
      await syncItem(item);
      await markAsSynced(item.id!);
      result.synced++;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await updateSyncError(item.id!, errorMessage);
      result.failed++;
      result.errors.push({ id: item.id!, error: errorMessage });
    }
  }

  result.success = result.failed === 0;
  return result;
}

/**
 * Check if sync is supported
 */
export function isSyncSupported(): boolean {
  return (
    'serviceWorker' in navigator &&
    'sync' in ServiceWorkerRegistration.prototype
  );
}

/**
 * Listen for online/offline events and trigger sync
 */
export function setupAutoSync(): void {
  if (!isSyncSupported()) {
    console.warn('Auto-sync not supported');
    return;
  }

  // Sync when coming back online
  window.addEventListener('online', async () => {
    console.log('Network connection restored, triggering sync...');
    await registerBackgroundSync();
  });

  // Log when going offline
  window.addEventListener('offline', () => {
    console.log('Network connection lost, data will be queued for sync');
  });

  console.log('Auto-sync enabled');
}
