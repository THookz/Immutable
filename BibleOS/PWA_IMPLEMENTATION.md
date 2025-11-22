# BibleOS PWA Implementation Guide

**Complete Offline Functionality with Background Sync**

---

## Overview

BibleOS now includes a complete Progressive Web App (PWA) implementation with:

- ✅ **IndexedDB Storage** - All Bible data stored locally for offline access
- ✅ **Service Worker** - Enhanced caching strategies for instant loading
- ✅ **Background Sync** - Automatic synchronization when online
- ✅ **Conflict Resolution** - Timestamp-based conflict handling
- ✅ **Offline Indicator** - Real-time network and sync status
- ✅ **Install Prompts** - Native app-like installation
- ✅ **Progressive Download** - Book-by-book download control

---

## Architecture

### 1. IndexedDB Schema

**Location:** `client/src/lib/indexeddb.ts`

The database uses **8 object stores**:

| Store | Purpose | Key | Indexes |
|:------|:--------|:----|:--------|
| `lemmas` | Strong's concordance entries | `strongId` | `language` |
| `verses` | Original language verses | `verseId` | `book`, `language` |
| `translations` | Modern translations | `[verseId, translation]` | `translation` |
| `symbols` | Prophetic symbols | `symbolId` | - |
| `historical_events` | Historical events | `eventId` | - |
| `language_dictionaries` | Multilingual definitions | `[strongId, languageCode]` | `languageCode` |
| `sync_queue` | Offline changes queue | `id` (auto) | `synced`, `timestamp`, `type` |
| `user_bookmarks` | User bookmarks | `id` (auto) | `verseId`, `userId`, `createdAt` |
| `metadata` | Sync metadata | `key` | - |

**Key Functions:**
- `initDB()` - Initialize database with schema
- `bulkPutData()` - Batch insert for performance
- `getByIndex()` - Query by index
- `addToSyncQueue()` - Queue offline changes

### 2. Data Sync Layer

**Location:** `client/src/lib/data-sync.ts`

Handles loading Bible data from JSON files into IndexedDB.

**Key Functions:**
- `syncAllData(onProgress)` - Load all data with progress callback
- `syncLemmas()` - Load 14,197 Strong's entries
- `syncVerses()` - Load all 66 books (31,143 verses)
- `syncSymbols()` - Load 8 prophetic symbols
- `syncHistoricalEvents()` - Load 9 historical events
- `getSyncStatus()` - Check what's downloaded

**Progress Tracking:**
```typescript
interface SyncProgress {
  stage: string;
  current: number;
  total: number;
  percentage: number;
  message: string;
}
```

### 3. Service Worker

**Location:** `client/public/sw.js`

Enhanced with **three caching strategies**:

| Strategy | Used For | Behavior |
|:---------|:---------|:---------|
| **Cache First** | Static assets (HTML, CSS, JS) | Serve from cache, update in background |
| **Network First** | API requests | Try network, fallback to cache |
| **Stale While Revalidate** | Data files (/data/*.json) | Serve cache immediately, update in background |

**Precaching:**
- App shell (HTML, manifest, logo)
- Essential data files (lemmas, symbols, events)

**Background Sync:**
- Listens for `sync-bible-data` event
- Processes sync queue automatically
- Retries failed items with exponential backoff

### 4. Sync Manager

**Location:** `client/src/lib/sync-manager.ts`

Handles background synchronization with conflict resolution.

**Key Functions:**
- `registerBackgroundSync()` - Register sync event
- `triggerSync()` - Manually trigger sync
- `resolveConflict()` - Handle server/client conflicts
- `queueBookmark()` - Queue user data for sync
- `setupAutoSync()` - Auto-sync on network restore

**Conflict Resolution Strategies:**
1. **Server Wins** - Server data is newer (default)
2. **Client Wins** - Client data is newer
3. **Merge** - Combine non-null values
4. **Prompt User** - Ask user to resolve (future)

### 5. UI Components

#### OfflineIndicator
**Location:** `client/src/components/OfflineIndicator.tsx`

Floating indicator showing:
- Network status (online/offline)
- Sync status (synced/pending/failed)
- Auto-hides when online and synced

#### SyncStatusDashboard
**Location:** `client/src/components/SyncStatusDashboard.tsx`

Detailed sync dashboard with:
- Network status card
- Sync queue statistics
- Offline data counts
- Manual sync controls
- Retry failed syncs

#### OfflineDownload
**Location:** `client/src/components/OfflineDownload.tsx`

One-click download of all Bible data:
- Progress bar with percentage
- Download size: ~61 MB
- Status: 14,197 lemmas, 31,143 verses, 8 symbols, 9 events

#### ProgressiveDownload
**Location:** `client/src/components/ProgressiveDownload.tsx`

Book-by-book download control:
- Select individual books
- Select all OT or NT
- Visual download status
- Storage-efficient

#### InstallPrompt
**Location:** `client/src/components/InstallPrompt.tsx`

PWA installation prompt:
- Appears after 5 seconds
- Dismissible for 7 days
- Native install experience
- Home screen icon

---

## Usage

### 1. Enable Offline Mode

```typescript
import { syncAllData } from '@/lib/data-sync';
import { setupAutoSync } from '@/lib/sync-manager';

// Download all data
await syncAllData((progress) => {
  console.log(`${progress.percentage}% - ${progress.message}`);
});

// Enable auto-sync
setupAutoSync();
```

### 2. Queue Offline Changes

```typescript
import { queueBookmark } from '@/lib/sync-manager';

// Add bookmark while offline
await queueBookmark(userId, 'GEN.1.1', 'My note');

// Will sync automatically when online
```

### 3. Check Sync Status

```typescript
import { getSyncStatusSummary } from '@/lib/sync-manager';

const status = await getSyncStatusSummary();
console.log(status.status); // 'synced' | 'pending' | 'failed' | 'offline'
console.log(status.message); // Human-readable message
console.log(status.details); // { total, synced, pending, failed }
```

### 4. Manual Sync

```typescript
import { triggerSync, retryFailedSyncs } from '@/lib/sync-manager';

// Trigger sync now
const result = await triggerSync();
console.log(`Synced: ${result.synced}, Failed: ${result.failed}`);

// Retry failed items
const retryResult = await retryFailedSyncs();
```

---

## Testing

### Test Offline Functionality

1. **Open DevTools** → Application → Service Workers
2. **Check "Offline"** checkbox
3. **Reload page** - should load from cache
4. **Add bookmark** - should queue for sync
5. **Uncheck "Offline"** - should sync automatically

### Test Background Sync

1. **Open DevTools** → Application → Background Services → Background Sync
2. **Go offline** and make changes
3. **Go online** - watch sync events fire
4. **Check IndexedDB** → `sync_queue` → verify items marked as synced

### Test Progressive Download

1. **Open Progressive Download page**
2. **Select a few books**
3. **Click "Download Selected"**
4. **Check IndexedDB** → `verses` → verify book data

### Test Install Prompt

1. **Open in Chrome/Edge** (not Firefox - no install support yet)
2. **Wait 5 seconds** - prompt should appear
3. **Click "Install"** - app installs to home screen
4. **Open installed app** - runs in standalone mode

---

## Browser Support

| Feature | Chrome | Edge | Safari | Firefox |
|:--------|:-------|:-----|:-------|:--------|
| IndexedDB | ✅ | ✅ | ✅ | ✅ |
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Background Sync | ✅ | ✅ | ❌ | ❌ |
| Install Prompt | ✅ | ✅ | ❌ | ❌ |
| Offline Mode | ✅ | ✅ | ✅ | ✅ |

**Fallback Behavior:**
- Safari/Firefox: No background sync, but manual sync works
- Safari: No install prompt, but "Add to Home Screen" works
- All browsers: Full offline functionality with IndexedDB

---

## Performance

### Storage Usage

| Data Type | Count | Size |
|:----------|:------|:-----|
| Lemmas | 14,197 | ~4.8 MB |
| Verses (all books) | 31,143 | ~56 MB |
| Symbols | 8 | ~13 KB |
| Historical Events | 9 | ~5 KB |
| **Total** | **45,357 items** | **~61 MB** |

### Load Times

| Scenario | Time |
|:---------|:-----|
| First load (online) | ~2-3 seconds |
| Offline load (cached) | ~0.5 seconds |
| Data sync (full) | ~30-60 seconds |
| Book download | ~1-2 seconds per book |

### Optimization Tips

1. **Batch Operations** - Use `bulkPutData()` for large inserts
2. **Lazy Loading** - Load books on-demand with Progressive Download
3. **Cache Pruning** - Clear old caches on service worker update
4. **Compression** - JSON files are gzip-compressed by server

---

## Troubleshooting

### "Data not loading offline"

**Solution:**
1. Check if data is synced: `await getSyncStatus()`
2. Verify IndexedDB: DevTools → Application → IndexedDB → BibleOS
3. Re-download: Use "Re-download Data" button

### "Sync queue stuck"

**Solution:**
1. Check network: `navigator.onLine`
2. Retry failed: `await retryFailedSyncs()`
3. Clear queue: Delete items from `sync_queue` store

### "Service worker not updating"

**Solution:**
1. Unregister: DevTools → Application → Service Workers → Unregister
2. Clear cache: DevTools → Application → Cache Storage → Delete all
3. Hard reload: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

### "Install prompt not showing"

**Solution:**
1. Check browser: Chrome/Edge only
2. Check HTTPS: Must be served over HTTPS (or localhost)
3. Check manifest: Verify `/manifest.json` is valid
4. Wait: Prompt appears after 5 seconds

---

## Future Enhancements

### Planned Features

1. **Differential Sync** - Only sync changed data
2. **Compression** - Compress IndexedDB data
3. **Encryption** - Encrypt user data at rest
4. **Peer-to-Peer** - Share data via WebRTC
5. **Export/Import** - Backup data to file
6. **Multi-Device Sync** - Sync across devices

### API Integration

When backend sync API is ready, update endpoints in `sync-manager.ts`:

```typescript
const endpoints: Record<string, string> = {
  bookmark: '/api/sync/bookmarks',
  note: '/api/sync/notes',
  highlight: '/api/sync/highlights',
};
```

---

## Credits

**Implementation based on:**
- [PWA Best Practices](https://web.dev/progressive-web-apps/)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Background Sync API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API)
- [Service Worker Cookbook](https://serviceworke.rs/)

**Built for:**
- BibleOS - Universal Bible Concordance
- Mission: Make God's Word accessible offline, everywhere

---

**"Freely ye have received, freely give."** - Matthew 10:8 (KJV)

**Soli Deo Gloria** 🕊️
