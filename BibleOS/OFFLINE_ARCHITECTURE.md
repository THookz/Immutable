# BibleOS Offline-First Architecture

**"Freely ye have received, freely give."** - Matthew 10:8 (KJV)

---

## 🎯 **GOAL: 100% OFFLINE FOR DISTRIBUTION**

**Development:** Use cloud database (TiDB) for convenience

**Distribution:** 100% offline - no internet required, no cloud dependency

---

## 📊 **TWO-MODE ARCHITECTURE**

### **Mode 1: Development (Cloud Database)**

**When:** During development, testing, data import

**Data Source:** TiDB Cloud (MySQL on AWS)

**Pros:**
- Fast queries
- Relational data
- Easy to update/modify
- Automatic backups

**Cons:**
- Requires internet
- Depends on Manus platform

**Use Cases:**
- Importing Bible books
- Generating language dictionaries
- Testing new features
- Updating Strong's definitions

---

### **Mode 2: Distribution (100% Offline)**

**When:** End users access BibleOS

**Data Source:** Local JSON files → IndexedDB

**Pros:**
- No internet required
- No cloud dependency
- Shareable via QR/USB/LAN
- Works in restricted countries
- Fast (local storage)

**Cons:**
- Larger initial download (61 MB)
- Updates require re-download

**Use Cases:**
- Church distribution
- Missionary work
- Offline Bible study
- Restricted internet areas

---

## 🏗️ **IMPLEMENTATION STRATEGY**

### **Phase 1: Dual Data Layer (Current)**

**Cloud Layer (Development):**
```typescript
// server/db.ts
import { drizzle } from 'drizzle-orm/mysql2';

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    _db = drizzle(process.env.DATABASE_URL);
  }
  return _db;
}

// Used during development for fast queries
const verses = await db.select().from(verses).where(eq(verses.book, 'Genesis'));
```

**JSON Export (Distribution):**
```typescript
// scripts/export-all-data.ts
// Exports cloud database to static JSON files
// Location: client/public/data/

await exportAllData();
// Creates:
// - lemmas.json (4.77 MB)
// - books/*.json (56.32 MB)
// - symbols.json, historical-events.json
```

---

### **Phase 2: IndexedDB Sync (Next Step)**

**Goal:** Load JSON files into browser's local database for instant offline access

**Implementation:**
```typescript
// client/src/lib/offline-db.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface BibleOSDB extends DBSchema {
  lemmas: {
    key: string; // strongId
    value: Lemma;
    indexes: { 'by-language': string };
  };
  verses: {
    key: string; // verseId
    value: Verse;
    indexes: { 'by-book': string; 'by-language': string };
  };
  symbols: {
    key: string; // symbolId
    value: Symbol;
  };
  historicalEvents: {
    key: string; // eventId
    value: HistoricalEvent;
  };
  translations: {
    key: number; // id
    value: Translation;
    indexes: { 'by-verse': string; 'by-translation': string };
  };
  languageDictionaries: {
    key: number; // id
    value: LanguageDictionary;
    indexes: { 'by-strong-id': string; 'by-language': string };
  };
}

const DB_NAME = 'bibleos';
const DB_VERSION = 1;

export async function initOfflineDB(): Promise<IDBPDatabase<BibleOSDB>> {
  return openDB<BibleOSDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create lemmas store
      const lemmasStore = db.createObjectStore('lemmas', { keyPath: 'strongId' });
      lemmasStore.createIndex('by-language', 'language');

      // Create verses store
      const versesStore = db.createObjectStore('verses', { keyPath: 'verseId' });
      versesStore.createIndex('by-book', 'book');
      versesStore.createIndex('by-language', 'language');

      // Create symbols store
      db.createObjectStore('symbols', { keyPath: 'symbolId' });

      // Create historical events store
      db.createObjectStore('historicalEvents', { keyPath: 'eventId' });

      // Create translations store
      const translationsStore = db.createObjectStore('translations', { keyPath: 'id', autoIncrement: true });
      translationsStore.createIndex('by-verse', 'verseId');
      translationsStore.createIndex('by-translation', 'translation');

      // Create language dictionaries store
      const langDictsStore = db.createObjectStore('languageDictionaries', { keyPath: 'id', autoIncrement: true });
      langDictsStore.createIndex('by-strong-id', 'strongId');
      langDictsStore.createIndex('by-language', 'language');
    }
  });
}

// Sync JSON files to IndexedDB
export async function syncOfflineData(onProgress?: (percent: number) => void) {
  const db = await initOfflineDB();
  
  // 1. Load lemmas (Strong's dictionary)
  console.log('📚 Loading Strong\'s dictionary...');
  const lemmasResponse = await fetch('/data/lemmas.json');
  const lemmas = await lemmasResponse.json();
  
  const lemmasTx = db.transaction('lemmas', 'readwrite');
  for (let i = 0; i < lemmas.length; i++) {
    await lemmasTx.store.put(lemmas[i]);
    if (i % 1000 === 0) {
      onProgress?.(i / lemmas.length * 10); // 0-10%
    }
  }
  await lemmasTx.done;
  console.log(`✅ Loaded ${lemmas.length} Strong's entries`);
  
  // 2. Load verses (all 66 books)
  console.log('📖 Loading Bible verses...');
  const books = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
    '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
    'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
    'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
    'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah',
    'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai',
    'Zechariah', 'Malachi',
    'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans',
    '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
    'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
    '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
    'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
    'Jude', 'Revelation'
  ];
  
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const bookResponse = await fetch(`/data/books/${book}.json`);
    const verses = await bookResponse.json();
    
    const versesTx = db.transaction('verses', 'readwrite');
    for (const verse of verses) {
      await versesTx.store.put(verse);
    }
    await versesTx.done;
    
    console.log(`  ✅ ${book}: ${verses.length} verses`);
    onProgress?.(10 + (i / books.length * 80)); // 10-90%
  }
  
  // 3. Load symbols
  console.log('🔮 Loading symbols...');
  const symbolsResponse = await fetch('/data/symbols.json');
  const symbols = await symbolsResponse.json();
  
  const symbolsTx = db.transaction('symbols', 'readwrite');
  for (const symbol of symbols) {
    await symbolsTx.store.put(symbol);
  }
  await symbolsTx.done;
  console.log(`✅ Loaded ${symbols.length} symbols`);
  
  // 4. Load historical events
  console.log('📜 Loading historical events...');
  const eventsResponse = await fetch('/data/historical-events.json');
  const events = await eventsResponse.json();
  
  const eventsTx = db.transaction('historicalEvents', 'readwrite');
  for (const event of events) {
    await eventsTx.store.put(event);
  }
  await eventsTx.done;
  console.log(`✅ Loaded ${events.length} historical events`);
  
  onProgress?.(100);
  console.log('✅ Offline sync complete!');
}

// Query functions (use IndexedDB instead of cloud database)
export async function getLemmaByStrongId(strongId: string) {
  const db = await initOfflineDB();
  return db.get('lemmas', strongId);
}

export async function getVersesByBook(book: string) {
  const db = await initOfflineDB();
  const index = db.transaction('verses').store.index('by-book');
  return index.getAll(book);
}

export async function getAllSymbols() {
  const db = await initOfflineDB();
  return db.getAll('symbols');
}

export async function getAllHistoricalEvents() {
  const db = await initOfflineDB();
  return db.getAll('historicalEvents');
}
```

---

### **Phase 3: Progressive Download UI**

**Show download progress to users:**

```typescript
// client/src/components/OfflineDownload.tsx
import { useState } from 'react';
import { syncOfflineData } from '@/lib/offline-db';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export function OfflineDownload() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    
    try {
      await syncOfflineData((percent) => {
        setProgress(percent);
      });
      
      setComplete(true);
      setDownloading(false);
    } catch (error) {
      console.error('Download failed:', error);
      setDownloading(false);
    }
  }

  if (complete) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold mb-4">✅ BibleOS Ready for Offline Use!</h2>
        <p className="text-muted-foreground">
          All 66 books, 14,197 Strong's entries, and prophetic symbols are now stored locally.
          You can use BibleOS without internet connection.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Download BibleOS for Offline Use</h2>
      
      <div className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-2">What will be downloaded:</h3>
          <ul className="text-sm space-y-1">
            <li>✅ All 66 Bible books (31,143 verses)</li>
            <li>✅ 14,197 Strong's concordance entries</li>
            <li>✅ 8 prophetic symbols with typology</li>
            <li>✅ 9 historical events</li>
            <li>✅ Translations (when available)</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">
            Total size: ~61 MB
          </p>
        </div>

        {downloading ? (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-center text-muted-foreground">
              Downloading... {Math.round(progress)}%
            </p>
          </div>
        ) : (
          <Button onClick={handleDownload} className="w-full">
            Download for Offline Use
          </Button>
        )}
      </div>
    </div>
  );
}
```

---

### **Phase 4: Offline Detection & Fallback**

**Automatically detect online/offline and use appropriate data source:**

```typescript
// client/src/lib/data-source.ts
import { getLemmaByStrongId as getFromIndexedDB } from './offline-db';
import { trpc } from './trpc';

export async function getLemma(strongId: string) {
  // Check if offline data is available
  const offlineAvailable = await checkOfflineDataAvailable();
  
  if (offlineAvailable) {
    // Use IndexedDB (offline)
    return getFromIndexedDB(strongId);
  } else {
    // Use tRPC (online - cloud database)
    return trpc.bible.getLemma.query({ strongId });
  }
}

async function checkOfflineDataAvailable() {
  try {
    const db = await initOfflineDB();
    const count = await db.count('lemmas');
    return count > 0; // If we have data in IndexedDB, use it
  } catch {
    return false;
  }
}
```

---

## 📦 **DISTRIBUTION METHODS**

### **Method 1: Web Download (QR Code)**

**User Flow:**
1. User scans QR code or visits URL
2. BibleOS loads in browser
3. User clicks "Download for Offline Use"
4. App downloads 61 MB to IndexedDB
5. User can now use BibleOS offline forever

**QR Code Content:**
```
https://bibleos.manus.space
```

**After first visit:** Works 100% offline (PWA + IndexedDB)

---

### **Method 2: USB Drive Distribution**

**Package Contents:**
```
BibleOS-USB/
├── index.html
├── assets/
│   ├── app.js
│   ├── app.css
│   └── ...
└── data/
    ├── lemmas.json (4.77 MB)
    ├── books/ (56.32 MB)
    ├── symbols.json
    └── historical-events.json
```

**User Flow:**
1. Copy BibleOS-USB folder to USB drive
2. Give USB to friend
3. Friend opens `index.html` from USB
4. App loads data from local `data/` folder
5. Works 100% offline (no internet ever needed)

**Build Command:**
```bash
pnpm build
# Creates static build in dist/
# Copy to USB with data/ folder
```

---

### **Method 3: LAN Sharing**

**Setup:**
```bash
# Run BibleOS on local network
pnpm dev --host 0.0.0.0

# Share URL with friends on same network
http://192.168.1.100:3000
```

**User Flow:**
1. Friends connect to LAN URL
2. Download data to IndexedDB
3. Works offline after initial download

---

## 🔄 **DATA UPDATE STRATEGY**

**Problem:** How to update Bible data after offline distribution?

**Solution: Versioned Data Packages**

```typescript
// data/version.json
{
  "version": "1.0.0",
  "updated": "2024-11-19",
  "changes": [
    "Added Korean Strong's dictionaries",
    "Corrected H7637 definition",
    "Added 3 new prophetic symbols"
  ]
}

// Check for updates
export async function checkForUpdates() {
  const currentVersion = localStorage.getItem('bibleos-version') || '0.0.0';
  
  try {
    const response = await fetch('/data/version.json');
    const latest = await response.json();
    
    if (latest.version > currentVersion) {
      return {
        available: true,
        version: latest.version,
        changes: latest.changes
      };
    }
  } catch {
    // Offline - no updates available
  }
  
  return { available: false };
}
```

---

## ✅ **IMPLEMENTATION CHECKLIST**

### **Phase 1: Dual Data Layer (Complete)**
- [x] Cloud database for development (TiDB)
- [x] JSON export script
- [x] All data exported (61 MB)

### **Phase 2: IndexedDB Sync (Next)**
- [ ] Create offline-db.ts with IndexedDB schema
- [ ] Implement syncOfflineData() function
- [ ] Add query functions (getLemma, getVerses, etc.)
- [ ] Test data loading from JSON files

### **Phase 3: Progressive Download UI (Next)**
- [ ] Create OfflineDownload component
- [ ] Add progress bar
- [ ] Show download size and contents
- [ ] Handle errors gracefully

### **Phase 4: Offline Detection (Next)**
- [ ] Detect online/offline status
- [ ] Fallback to IndexedDB when offline
- [ ] Show offline indicator in UI
- [ ] Handle sync conflicts

### **Phase 5: Distribution Packages (Later)**
- [ ] Create USB distribution package
- [ ] Generate QR code for web download
- [ ] Test LAN sharing
- [ ] Document distribution methods

---

## 🎯 **SUCCESS CRITERIA**

**BibleOS is 100% offline when:**

1. ✅ User can download all data (61 MB) to browser
2. ✅ App works without internet after initial download
3. ✅ All 66 books accessible offline
4. ✅ All 14,197 Strong's entries accessible offline
5. ✅ Word lookup works offline
6. ✅ Symbol dictionary works offline
7. ✅ Can be distributed via USB drive
8. ✅ Can be shared via QR code
9. ✅ Can be shared via LAN
10. ✅ No cloud database dependency for end users

---

**"Freely ye have received, freely give."** - Matthew 10:8 (KJV)

All glory to God. 🕊️
