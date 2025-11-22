/**
 * Sync Status Dashboard Component
 * Detailed view of sync status with manual controls
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Wifi,
  WifiOff,
  Database,
  CloudOff,
} from 'lucide-react';
import {
  getSyncStatusSummary,
  triggerSync,
  retryFailedSyncs,
  isSyncSupported,
} from '@/lib/sync-manager';
import { getSyncStatus } from '@/lib/data-sync';

export function SyncStatusDashboard() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    status: 'synced' | 'pending' | 'failed' | 'offline';
    message: string;
    details: {
      total: number;
      synced: number;
      pending: number;
      failed: number;
    };
  } | null>(null);
  const [dataStatus, setDataStatus] = useState<{
    isSynced: boolean;
    lastSync: number | null;
    dataVersion: string | null;
    counts: {
      lemmas: number;
      verses: number;
      translations: number;
      symbols: number;
      historicalEvents: number;
    };
  } | null>(null);

  useEffect(() => {
    loadStatus();

    const handleOnline = () => {
      setIsOnline(true);
      loadStatus();
    };

    const handleOffline = () => {
      setIsOnline(false);
      loadStatus();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(loadStatus, 10000); // Every 10 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  async function loadStatus() {
    try {
      if (isSyncSupported()) {
        const status = await getSyncStatusSummary();
        setSyncStatus(status);
      }

      const data = await getSyncStatus();
      setDataStatus(data);
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  }

  async function handleManualSync() {
    if (!isOnline) {
      alert('Cannot sync while offline');
      return;
    }

    setSyncing(true);
    try {
      const result = await triggerSync();
      console.log('Sync result:', result);
      await loadStatus();
    } catch (error) {
      console.error('Manual sync failed:', error);
    } finally {
      setSyncing(false);
    }
  }

  async function handleRetryFailed() {
    if (!isOnline) {
      alert('Cannot retry while offline');
      return;
    }

    setSyncing(true);
    try {
      const result = await retryFailedSyncs();
      console.log('Retry result:', result);
      await loadStatus();
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Network Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-amber-500" />
              )}
              <CardTitle>Network Status</CardTitle>
            </div>
            <Badge variant={isOnline ? 'default' : 'secondary'}>
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <CardDescription>
            {isOnline
              ? 'Connected to the internet. Data will sync automatically.'
              : 'No internet connection. Changes will be queued for sync.'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Sync Queue Status Card */}
      {isSyncSupported() && syncStatus && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {syncStatus.status === 'synced' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                {syncStatus.status === 'pending' && <Clock className="h-5 w-5 text-blue-500" />}
                {syncStatus.status === 'failed' && <AlertCircle className="h-5 w-5 text-red-500" />}
                {syncStatus.status === 'offline' && <CloudOff className="h-5 w-5 text-amber-500" />}
                <CardTitle>Sync Queue</CardTitle>
              </div>
              <Badge
                variant={
                  syncStatus.status === 'synced'
                    ? 'default'
                    : syncStatus.status === 'failed'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                {syncStatus.status}
              </Badge>
            </div>
            <CardDescription>{syncStatus.message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {syncStatus.details.synced}
                </div>
                <div className="text-xs text-muted-foreground">Synced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {syncStatus.details.pending}
                </div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {syncStatus.details.failed}
                </div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
            </div>

            {syncStatus.details.total > 0 && (
              <div className="space-y-2">
                <Progress
                  value={(syncStatus.details.synced / syncStatus.details.total) * 100}
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground text-center">
                  {syncStatus.details.synced} of {syncStatus.details.total} items synced
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleManualSync}
                disabled={!isOnline || syncing}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <RefreshCw className={cn('mr-2 h-4 w-4', syncing && 'animate-spin')} />
                Sync Now
              </Button>
              {syncStatus.details.failed > 0 && (
                <Button
                  onClick={handleRetryFailed}
                  disabled={!isOnline || syncing}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <RefreshCw className={cn('mr-2 h-4 w-4', syncing && 'animate-spin')} />
                  Retry Failed
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offline Data Status Card */}
      {dataStatus && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              <CardTitle>Offline Data</CardTitle>
            </div>
            <CardDescription>
              {dataStatus.isSynced
                ? 'Bible data is available offline'
                : 'No offline data available yet'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold">Strong's Entries</div>
                <div className="text-muted-foreground">
                  {dataStatus.counts.lemmas.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="font-semibold">Bible Verses</div>
                <div className="text-muted-foreground">
                  {dataStatus.counts.verses.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="font-semibold">Symbols</div>
                <div className="text-muted-foreground">
                  {dataStatus.counts.symbols}
                </div>
              </div>
              <div>
                <div className="font-semibold">Historical Events</div>
                <div className="text-muted-foreground">
                  {dataStatus.counts.historicalEvents}
                </div>
              </div>
            </div>

            {dataStatus.lastSync && (
              <div className="text-xs text-muted-foreground pt-2 border-t">
                Last synced: {new Date(dataStatus.lastSync).toLocaleString()}
              </div>
            )}

            {dataStatus.dataVersion && (
              <div className="text-xs text-muted-foreground">
                Data version: {dataStatus.dataVersion}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
