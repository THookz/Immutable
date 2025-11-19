import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Define the database schema
interface BibleOSDB extends DBSchema {
  lemmas: {
    key: string; // strongId
    value: {
      id: number;
      strongId: string;
      language: string;
      lemma: string;
      transliteration: string | null;
      pronunciation: string | null;
      definition: string;
      root: string | null;
      morphology: string | null;
      hebrewComparison: string | null;
      createdAt: string;
    };
    indexes: { 'by-language': string };
  };
  verses: {
    key: string; // verseId
    value: {
      id: number;
      verseId: string;
      book: string;
      chapter: number;
      verse: number;
      language: string;
      text: string;
      wordAlignment: string | null;
      createdAt: string;
    };
    indexes: { 'by-book': string; 'by-language': string };
  };
  symbols: {
    key: string; // symbolId
    value: {
      id: number;
      symbolId: string;
      name: string;
      originalTerms: string | null;
      definition: string;
      biblicalUsage: string | null;
      typology: string | null;
      relatedEvents: string | null;
      createdAt: string;
    };
  };
  historicalEvents: {
    key: string; // eventId
    value: {
      id: number;
      eventId: string;
      name: string;
      date: string;
      description: string;
      significance: string | null;
      relatedSymbols: string | null;
      createdAt: string;
    };
  };
  translations: {
    key: number; // id
    value: {
      id: number;
      verseId: string;
      translation: string;
      language: string;
      text: string;
      wordAlignment: string | null;
      createdAt: string;
    };
    indexes: { 'by-verse': string; 'by-translation': string };
  };
  languageDictionaries: {
    key: number; // id
    value: {
      id: number;
      strongId: string;
      language: string;
      explanation: string;
      usage: string | null;
      nuanceNote: string | null;
      createdAt: string;
    };
    indexes: { 'by-strong-id': string; 'by-language': string };
  };
  metadata: {
    key: string; // key name
    value: {
      key: string;
      value: string;
      updatedAt: string;
    };
  };
}

const DB_NAME = 'bibleos';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<BibleOSDB> | null = null;

/**
 * Initialize the IndexedDB database
 */
export async function initOfflineDB(): Promise<IDBPDatabase<BibleOSDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<BibleOSDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create lemmas store (Strong's dictionary)
      if (!db.objectStoreNames.contains('lemmas')) {
        const lemmasStore = db.createObjectStore('lemmas', { keyPath: 'strongId' });
        lemmasStore.createIndex('by-language', 'language');
      }

      // Create verses store
      if (!db.objectStoreNames.contains('verses')) {
        const versesStore = db.createObjectStore('verses', { keyPath: 'verseId' });
        versesStore.createIndex('by-book', 'book');
        versesStore.createIndex('by-language', 'language');
      }

      // Create symbols store
      if (!db.objectStoreNames.contains('symbols')) {
        db.createObjectStore('symbols', { keyPath: 'symbolId' });
      }

      // Create historical events store
      if (!db.objectStoreNames.contains('historicalEvents')) {
        db.createObjectStore('historicalEvents', { keyPath: 'eventId' });
      }

      // Create translations store
      if (!db.objectStoreNames.contains('translations')) {
        const translationsStore = db.createObjectStore('translations', { keyPath: 'id', autoIncrement: true });
        translationsStore.createIndex('by-verse', 'verseId');
        translationsStore.createIndex('by-translation', 'translation');
      }

      // Create language dictionaries store
      if (!db.objectStoreNames.contains('languageDictionaries')) {
        const langDictsStore = db.createObjectStore('languageDictionaries', { keyPath: 'id', autoIncrement: true });
        langDictsStore.createIndex('by-strong-id', 'strongId');
        langDictsStore.createIndex('by-language', 'language');
      }

      // Create metadata store
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata', { keyPath: 'key' });
      }
    },
  });

  return dbInstance;
}

/**
 * Check if offline data is available
 */
export async function isOfflineDataAvailable(): Promise<boolean> {
  try {
    const db = await initOfflineDB();
    const count = await db.count('lemmas');
    return count > 0;
  } catch {
    return false;
  }
}

/**
 * Get sync status
 */
export async function getSyncStatus(): Promise<{
  synced: boolean;
  lastSync: string | null;
  lemmasCount: number;
  versesCount: number;
  symbolsCount: number;
  eventsCount: number;
}> {
  try {
    const db = await initOfflineDB();
    
    const [lemmasCount, versesCount, symbolsCount, eventsCount] = await Promise.all([
      db.count('lemmas'),
      db.count('verses'),
      db.count('symbols'),
      db.count('historicalEvents'),
    ]);

    const lastSyncMeta = await db.get('metadata', 'lastSync');
    
    return {
      synced: lemmasCount > 0 && versesCount > 0,
      lastSync: lastSyncMeta?.value || null,
      lemmasCount,
      versesCount,
      symbolsCount,
      eventsCount,
    };
  } catch {
    return {
      synced: false,
      lastSync: null,
      lemmasCount: 0,
      versesCount: 0,
      symbolsCount: 0,
      eventsCount: 0,
    };
  }
}

/**
 * Sync all data from JSON files to IndexedDB
 */
export async function syncOfflineData(
  onProgress?: (percent: number, message: string) => void
): Promise<void> {
  const db = await initOfflineDB();
  
  try {
    // 1. Load lemmas (Strong's dictionary)
    onProgress?.(0, 'Loading Strong\'s dictionary...');
    const lemmasResponse = await fetch('/data/lemmas.json');
    const lemmas = await lemmasResponse.json();
    
    const lemmasTx = db.transaction('lemmas', 'readwrite');
    for (let i = 0; i < lemmas.length; i++) {
      await lemmasTx.store.put(lemmas[i]);
      if (i % 1000 === 0) {
        onProgress?.(Math.floor((i / lemmas.length) * 10), `Loading Strong's entries: ${i}/${lemmas.length}`);
      }
    }
    await lemmasTx.done;
    onProgress?.(10, `✅ Loaded ${lemmas.length} Strong's entries`);
    
    // 2. Load verses (all 66 books)
    onProgress?.(10, 'Loading Bible verses...');
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
      
      const progress = 10 + Math.floor((i / books.length) * 80);
      onProgress?.(progress, `Loading ${book}: ${verses.length} verses`);
    }
    onProgress?.(90, `✅ Loaded all 66 books`);
    
    // 3. Load symbols
    onProgress?.(90, 'Loading symbols...');
    const symbolsResponse = await fetch('/data/symbols.json');
    const symbols = await symbolsResponse.json();
    
    const symbolsTx = db.transaction('symbols', 'readwrite');
    for (const symbol of symbols) {
      await symbolsTx.store.put(symbol);
    }
    await symbolsTx.done;
    onProgress?.(95, `✅ Loaded ${symbols.length} symbols`);
    
    // 4. Load historical events
    onProgress?.(95, 'Loading historical events...');
    const eventsResponse = await fetch('/data/historical-events.json');
    const events = await eventsResponse.json();
    
    const eventsTx = db.transaction('historicalEvents', 'readwrite');
    for (const event of events) {
      await eventsTx.store.put(event);
    }
    await eventsTx.done;
    onProgress?.(98, `✅ Loaded ${events.length} historical events`);
    
    // 5. Save sync metadata
    const metadataTx = db.transaction('metadata', 'readwrite');
    await metadataTx.store.put({
      key: 'lastSync',
      value: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await metadataTx.done;
    
    onProgress?.(100, '✅ Offline sync complete!');
  } catch (error) {
    console.error('Sync failed:', error);
    throw error;
  }
}

// ============================================
// Query Functions
// ============================================

/**
 * Get a lemma by Strong's ID
 */
export async function getLemmaByStrongId(strongId: string) {
  const db = await initOfflineDB();
  return db.get('lemmas', strongId);
}

/**
 * Get all verses for a book
 */
export async function getVersesByBook(book: string) {
  const db = await initOfflineDB();
  const index = db.transaction('verses').store.index('by-book');
  return index.getAll(book);
}

/**
 * Get a specific verse
 */
export async function getVerse(verseId: string) {
  const db = await initOfflineDB();
  return db.get('verses', verseId);
}

/**
 * Get all symbols
 */
export async function getAllSymbols() {
  const db = await initOfflineDB();
  return db.getAll('symbols');
}

/**
 * Get a specific symbol
 */
export async function getSymbol(symbolId: string) {
  const db = await initOfflineDB();
  return db.get('symbols', symbolId);
}

/**
 * Get all historical events
 */
export async function getAllHistoricalEvents() {
  const db = await initOfflineDB();
  return db.getAll('historicalEvents');
}

/**
 * Get a specific historical event
 */
export async function getHistoricalEvent(eventId: string) {
  const db = await initOfflineDB();
  return db.get('historicalEvents', eventId);
}

/**
 * Get all books (unique list)
 */
export async function getAllBooks(): Promise<string[]> {
  const db = await initOfflineDB();
  const verses = await db.getAll('verses');
  const books = [...new Set(verses.map(v => v.book))];
  return books.sort();
}

/**
 * Clear all offline data
 */
export async function clearOfflineData(): Promise<void> {
  const db = await initOfflineDB();
  
  const tx = db.transaction(
    ['lemmas', 'verses', 'symbols', 'historicalEvents', 'translations', 'languageDictionaries', 'metadata'],
    'readwrite'
  );
  
  await Promise.all([
    tx.objectStore('lemmas').clear(),
    tx.objectStore('verses').clear(),
    tx.objectStore('symbols').clear(),
    tx.objectStore('historicalEvents').clear(),
    tx.objectStore('translations').clear(),
    tx.objectStore('languageDictionaries').clear(),
    tx.objectStore('metadata').clear(),
  ]);
  
  await tx.done;
}
