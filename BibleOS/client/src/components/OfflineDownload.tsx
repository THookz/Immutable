import { useState, useEffect } from 'react';
import { syncAllData, getSyncStatus } from '@/lib/data-sync';
import { isOfflineDataAvailable } from '@/lib/indexeddb';
import type { SyncProgress } from '@/lib/data-sync';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function OfflineDownload() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<{
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
    checkSyncStatus();
  }, []);

  async function checkSyncStatus() {
    const status = await getSyncStatus();
    setSyncStatus(status);
  }

  async function handleDownload() {
    setDownloading(true);
    setError(null);
    setProgress(0);
    setMessage('Starting download...');
    
    try {
      await syncAllData((progressData: SyncProgress) => {
        setProgress(progressData.percentage);
        setMessage(progressData.message);
      });
      
      // Refresh sync status
      await checkSyncStatus();
      setDownloading(false);
    } catch (err) {
      console.error('Download failed:', err);
      setError(err instanceof Error ? err.message : 'Download failed');
      setDownloading(false);
    }
  }

  if (syncStatus?.isSynced) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <CardTitle>BibleOS Ready for Offline Use!</CardTitle>
          </div>
          <CardDescription>
            All data has been downloaded and stored locally. You can now use BibleOS without an internet connection.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">Downloaded Data:</h3>
            <ul className="text-sm space-y-1">
              <li>✅ {syncStatus.counts.lemmas.toLocaleString()} Strong's concordance entries</li>
              <li>✅ {syncStatus.counts.verses.toLocaleString()} Bible verses (all 66 books)</li>
              <li>✅ {syncStatus.counts.symbols} prophetic symbols</li>
              <li>✅ {syncStatus.counts.historicalEvents} historical events</li>
            </ul>
            {syncStatus.lastSync && (
              <p className="text-xs text-muted-foreground mt-2">
                Last synced: {new Date(syncStatus.lastSync).toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={downloading}
            >
              Re-download Data
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Download BibleOS for Offline Use</CardTitle>
        <CardDescription>
          Download all Bible data to your device for instant access without internet connection.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-3">What will be downloaded:</h3>
          <ul className="text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary">📚</span>
              <div>
                <strong>14,197 Strong's concordance entries</strong>
                <p className="text-muted-foreground">Hebrew, Greek, and Aramaic definitions with transliterations</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">📖</span>
              <div>
                <strong>31,143 Bible verses (all 66 books)</strong>
                <p className="text-muted-foreground">Complete Old and New Testament with word-level alignment</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">🔮</span>
              <div>
                <strong>8 prophetic symbols with typology</strong>
                <p className="text-muted-foreground">Sabbath, Fire, Beast, Babylon, Sanctuary, Woman, Little Horn, Mark of the Beast</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">📜</span>
              <div>
                <strong>9 historical events</strong>
                <p className="text-muted-foreground">Constantine's Sunday Law, Papal Captivity, Protestant Reformation, and more</p>
              </div>
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm font-semibold">Total download size: ~61 MB</p>
            <p className="text-xs text-muted-foreground mt-1">
              Data will be stored in your browser's local storage and will persist even after closing the browser.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Download Failed</p>
              <p className="text-sm text-destructive/90">{error}</p>
            </div>
          </div>
        )}

        {downloading ? (
          <div className="space-y-3">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{message}</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Downloading... Please keep this tab open.</span>
            </div>
          </div>
        ) : (
          <Button onClick={handleDownload} className="w-full" size="lg">
            <Download className="mr-2 h-5 w-5" />
            Download for Offline Use
          </Button>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 <strong>Tip:</strong> After downloading, you can use BibleOS without internet connection.</p>
          <p>🔄 <strong>Updates:</strong> Re-download to get the latest Bible data and features.</p>
          <p>📱 <strong>Mobile:</strong> Works on phones and tablets. Add to home screen for app-like experience.</p>
        </div>
      </CardContent>
    </Card>
  );
}
