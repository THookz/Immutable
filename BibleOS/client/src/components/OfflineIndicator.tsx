/**
 * Offline Indicator Component
 * Shows network status and sync status in the UI
 */

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Cloud, CloudOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSyncStatusSummary, setupAutoSync, isSyncSupported } from '@/lib/sync-manager';
import { isOfflineDataAvailable } from '@/lib/indexeddb';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    status: 'synced' | 'pending' | 'failed' | 'offline';
    message: string;
  } | null>(null);

  useEffect(() => {
    // Check offline data availability
    checkOfflineData();

    // Setup auto-sync
    if (isSyncSupported()) {
      setupAutoSync();
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      updateSyncStatus();
    };

    const handleOffline = () => {
      setIsOnline(false);
      updateSyncStatus();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Update sync status periodically
    const interval = setInterval(updateSyncStatus, 30000); // Every 30 seconds

    // Initial sync status check
    updateSyncStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  async function checkOfflineData() {
    const available = await isOfflineDataAvailable();
    setHasOfflineData(available);
  }

  async function updateSyncStatus() {
    if (!isSyncSupported()) {
      return;
    }

    try {
      const status = await getSyncStatusSummary();
      setSyncStatus(status);
    } catch (error) {
      console.error('Failed to get sync status:', error);
    }
  }

  // Don't show indicator if online and synced
  if (isOnline && syncStatus?.status === 'synced') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full shadow-lg',
          'border backdrop-blur-sm transition-all',
          !isOnline && 'bg-amber-500/90 border-amber-600 text-white',
          isOnline && syncStatus?.status === 'pending' && 'bg-blue-500/90 border-blue-600 text-white',
          isOnline && syncStatus?.status === 'failed' && 'bg-red-500/90 border-red-600 text-white',
          isOnline && syncStatus?.status === 'synced' && 'bg-green-500/90 border-green-600 text-white'
        )}
      >
        {/* Network status icon */}
        {!isOnline ? (
          <WifiOff className="h-4 w-4" />
        ) : (
          <Wifi className="h-4 w-4" />
        )}

        {/* Sync status icon */}
        {syncStatus?.status === 'pending' && <Loader2 className="h-4 w-4 animate-spin" />}
        {syncStatus?.status === 'failed' && <AlertCircle className="h-4 w-4" />}
        {syncStatus?.status === 'synced' && <CheckCircle2 className="h-4 w-4" />}
        {syncStatus?.status === 'offline' && <CloudOff className="h-4 w-4" />}

        {/* Status message */}
        <span className="text-sm font-medium">
          {!isOnline && hasOfflineData && 'Offline Mode'}
          {!isOnline && !hasOfflineData && 'No Offline Data'}
          {isOnline && syncStatus?.message}
        </span>
      </div>
    </div>
  );
}
