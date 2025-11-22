/**
 * IndexedDB utilities for offline Bible data storage
 * Stores complete Bible texts, Strong's concordance, and typology data locally
 */

const DB_NAME = 'BibleOS';
const DB_VERSION = 2;

// Object store names
export const STORES = {
  LEMMAS: 'lemmas',
  VERSES: 'verses',
  TRANSLATIONS: 'translations',
  SYMBOLS: 'symbols',
  HISTORICAL_EVENTS: 'historical_events',
  LANGUAGE_PACKS: 'language_packs',
  LANGUAGE_DICTIONARIES: 'language_dictionaries',
  SYNC_QUEUE: 'sync_queue',
  USER_BOOKMARKS: 'user_bookmarks',
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

      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        syncStore.createIndex('synced', 'synced', { unique: false });
        syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        syncStore.createIndex('type', 'type', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.USER_BOOKMARKS)) {
        const bookmarksStore = db.createObjectStore(STORES.USER_BOOKMARKS, {
          keyPath: 'id',
          autoIncrement: true,
        });
        bookmarksStore.createIndex('verseId', 'verseId', { unique: false });
        bookmarksStore.createIndex('userId', 'userId', { unique: false });
        bookmarksStore.createIndex('createdAt', 'createdAt', { unique: false });
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

/**
 * Sync Queue Types
 */
export interface SyncQueueItem {
  id?: number;
  type: 'bookmark' | 'note' | 'highlight' | 'custom';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  synced: boolean;
  retryCount: number;
  lastError: string | null;
}

export interface UserBookmark {
  id?: number;
  userId: number;
  verseId: string;
  note: string | null;
  createdAt: number;
  updatedAt: number;
}

/**
 * Add item to sync queue
 */
export async function addToSyncQueue(item: Omit<SyncQueueItem, 'id'>): Promise<number> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.SYNC_QUEUE, 'readwrite');
    const store = transaction.objectStore(STORES.SYNC_QUEUE);
    const request = store.add(item);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      resolve(request.result as number);
      // Trigger background sync if available
      if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then((registration) => {
          return (registration as any).sync.register('sync-bible-data');
        }).catch((err) => {
          console.warn('Background sync registration failed:', err);
        });
      }
    };
  });
}

/**
 * Get all unsynced items from queue
 */
export async function getUnsyncedItems(): Promise<SyncQueueItem[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.SYNC_QUEUE, 'readonly');
    const store = transaction.objectStore(STORES.SYNC_QUEUE);
    const index = store.index('synced');
    const request = index.getAll(0); // 0 for false in IndexedDB

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * Mark sync queue item as synced
 */
export async function markAsSynced(id: number): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.SYNC_QUEUE, 'readwrite');
    const store = transaction.objectStore(STORES.SYNC_QUEUE);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const item = getRequest.result as SyncQueueItem;
      if (item) {
        item.synced = true;
        const putRequest = store.put(item);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      } else {
        resolve();
      }
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
}

/**
 * Update sync queue item with error
 */
export async function updateSyncError(id: number, error: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.SYNC_QUEUE, 'readwrite');
    const store = transaction.objectStore(STORES.SYNC_QUEUE);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const item = getRequest.result as SyncQueueItem;
      if (item) {
        item.retryCount += 1;
        item.lastError = error;
        const putRequest = store.put(item);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      } else {
        resolve();
      }
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
}

/**
 * Get sync queue status
 */
export async function getSyncQueueStatus(): Promise<{
  total: number;
  synced: number;
  pending: number;
  failed: number;
}> {
  const allItems = await getAllData<SyncQueueItem>(STORES.SYNC_QUEUE);
  const synced = allItems.filter((item) => item.synced).length;
  const pending = allItems.filter((item) => !item.synced && item.retryCount === 0).length;
  const failed = allItems.filter((item) => !item.synced && item.retryCount > 0).length;

  return {
    total: allItems.length,
    synced,
    pending,
    failed,
  };
}

/**
 * Clear synced items from queue (cleanup)
 */
export async function clearSyncedItems(): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.SYNC_QUEUE, 'readwrite');
    const store = transaction.objectStore(STORES.SYNC_QUEUE);
    const index = store.index('synced');
    const request = index.openCursor(IDBKeyRange.only(true));

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      } else {
        resolve();
      }
    };

    request.onerror = () => reject(request.error);
  });
}

/**
 * Add or update user bookmark
 */
export async function saveBookmark(bookmark: Omit<UserBookmark, 'id'>): Promise<number> {
  const item: Omit<SyncQueueItem, 'id'> = {
    type: 'bookmark',
    action: 'create',
    data: bookmark,
    timestamp: Date.now(),
    synced: false,
    retryCount: 0,
    lastError: null,
  };

  // Add to local bookmarks
  await putData(STORES.USER_BOOKMARKS, bookmark);

  // Add to sync queue
  return addToSyncQueue(item);
}

/**
 * Get all bookmarks for a user
 */
export async function getUserBookmarks(userId: number): Promise<UserBookmark[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.USER_BOOKMARKS, 'readonly');
    const store = transaction.objectStore(STORES.USER_BOOKMARKS);
    const index = store.index('userId');
    const request = index.getAll(userId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * Delete bookmark
 */
export async function deleteBookmark(id: number, userId: number): Promise<void> {
  const item: Omit<SyncQueueItem, 'id'> = {
    type: 'bookmark',
    action: 'delete',
    data: { id, userId },
    timestamp: Date.now(),
    synced: false,
    retryCount: 0,
    lastError: null,
  };

  // Delete from local bookmarks
  await deleteData(STORES.USER_BOOKMARKS, id);

  // Add to sync queue
  await addToSyncQueue(item);
}

/**
 * Get count of items in store
 */
export async function getStoreCount(storeName: string): Promise<number> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.count();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * Check if offline data is available
 */
export async function isOfflineDataAvailable(): Promise<boolean> {
  try {
    const lemmasCount = await getStoreCount(STORES.LEMMAS);
    const versesCount = await getStoreCount(STORES.VERSES);
    return lemmasCount > 0 && versesCount > 0;
  } catch (error) {
    console.error('Error checking offline data availability:', error);
    return false;
  }
}

/**
 * Get data by index
 */
export async function getByIndex(
  storeName: string,
  indexName: string,
  value: IDBValidKey
): Promise<any> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.get(value);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * Get all data by index
 */
export async function getAllByIndex(
  storeName: string,
  indexName: string,
  value: IDBValidKey
): Promise<any[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}
