/**
 * IndexedDB utilities for offline Bible data storage
 * Stores complete Bible texts, Strong's concordance, and typology data locally
 */

const DB_NAME = 'BibleOS';
const DB_VERSION = 1;

// Object store names
export const STORES = {
  LEMMAS: 'lemmas',
  VERSES: 'verses',
  TRANSLATIONS: 'translations',
  SYMBOLS: 'symbols',
  HISTORICAL_EVENTS: 'historical_events',
  LANGUAGE_PACKS: 'language_packs',
  LANGUAGE_DICTIONARIES: 'language_dictionaries',
  METADATA: 'metadata',
} as const;

let dbInstance: IDBDatabase | null = null;

/**
 * Initialize IndexedDB database
 */
export async function initDB(): Promise<IDBDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.LEMMAS)) {
        const lemmasStore = db.createObjectStore(STORES.LEMMAS, { keyPath: 'strongId' });
        lemmasStore.createIndex('language', 'language', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.VERSES)) {
        const versesStore = db.createObjectStore(STORES.VERSES, { keyPath: 'verseId' });
        versesStore.createIndex('book', 'book', { unique: false });
        versesStore.createIndex('language', 'language', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.TRANSLATIONS)) {
        const translationsStore = db.createObjectStore(STORES.TRANSLATIONS, {
          keyPath: ['verseId', 'translation'],
        });
        translationsStore.createIndex('translation', 'translation', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.SYMBOLS)) {
        db.createObjectStore(STORES.SYMBOLS, { keyPath: 'symbolId' });
      }

      if (!db.objectStoreNames.contains(STORES.HISTORICAL_EVENTS)) {
        db.createObjectStore(STORES.HISTORICAL_EVENTS, { keyPath: 'eventId' });
      }

      if (!db.objectStoreNames.contains(STORES.LANGUAGE_PACKS)) {
        db.createObjectStore(STORES.LANGUAGE_PACKS, { keyPath: 'languageCode' });
      }

      if (!db.objectStoreNames.contains(STORES.LANGUAGE_DICTIONARIES)) {
        const dictStore = db.createObjectStore(STORES.LANGUAGE_DICTIONARIES, {
          keyPath: ['strongId', 'languageCode'],
        });
        dictStore.createIndex('languageCode', 'languageCode', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.METADATA)) {
        db.createObjectStore(STORES.METADATA, { keyPath: 'key' });
      }
    };
  });
}

/**
 * Generic function to add/update data in a store
 */
export async function putData<T>(storeName: string, data: T): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Generic function to get data from a store
 */
export async function getData<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * Generic function to get all data from a store
 */
export async function getAllData<T>(storeName: string): Promise<T[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * Generic function to delete data from a store
 */
export async function deleteData(storeName: string, key: IDBValidKey): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Clear all data from a store
 */
export async function clearStore(storeName: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Bulk insert data (more efficient for large datasets)
 */
export async function bulkPutData<T>(storeName: string, dataArray: T[]): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    let completed = 0;
    const total = dataArray.length;

    dataArray.forEach((data) => {
      const request = store.put(data);
      request.onsuccess = () => {
        completed++;
        if (completed === total) {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  });
}

/**
 * Check if data exists in IndexedDB
 */
export async function hasData(storeName: string): Promise<boolean> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.count();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result > 0);
  });
}

/**
 * Get metadata (e.g., last sync time, data version)
 */
export async function getMetadata(key: string): Promise<any> {
  return getData(STORES.METADATA, key);
}

/**
 * Set metadata
 */
export async function setMetadata(key: string, value: any): Promise<void> {
  return putData(STORES.METADATA, { key, value, timestamp: Date.now() });
}

/**
 * Download progress tracking
 */
export interface DownloadProgress {
  total: number;
  completed: number;
  percentage: number;
  currentItem: string;
}

/**
 * Sync Bible data from server to IndexedDB
 */
export async function syncBibleData(
  onProgress?: (progress: DownloadProgress) => void
): Promise<void> {
  // This will be implemented to fetch data from the API and store in IndexedDB
  // For now, it's a placeholder
  console.log('Syncing Bible data to IndexedDB...');
  
  if (onProgress) {
    onProgress({
      total: 100,
      completed: 0,
      percentage: 0,
      currentItem: 'Initializing...',
    });
  }

  // TODO: Implement actual data sync
  // 1. Fetch lemmas from API
  // 2. Fetch verses from API
  // 3. Fetch translations from API
  // 4. Fetch symbols from API
  // 5. Fetch historical events from API
  // 6. Store all in IndexedDB with progress updates
}

/**
 * Get storage usage information
 */
export async function getStorageInfo(): Promise<{
  usage: number;
  quota: number;
  percentage: number;
}> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const percentage = quota > 0 ? (usage / quota) * 100 : 0;

    return { usage, quota, percentage };
  }

  return { usage: 0, quota: 0, percentage: 0 };
}
