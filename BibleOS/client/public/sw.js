/**
 * BibleOS Service Worker
 * Enables complete offline functionality with caching and background sync
 */

const CACHE_VERSION = 'v2';
const CACHE_NAME = `bibleos-${CACHE_VERSION}`;
const RUNTIME_CACHE = `bibleos-runtime-${CACHE_VERSION}`;
const DATA_CACHE = `bibleos-data-${CACHE_VERSION}`;

// Core files to precache (app shell)
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
];

// Data files to cache (Bible data)
const DATA_URLS = [
  '/data/lemmas.json',
  '/data/symbols.json',
  '/data/historical-events.json',
];

/**
 * Install event - precache core files and data
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache app shell
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[Service Worker] Precaching app shell');
        return cache.addAll(PRECACHE_URLS);
      }),
      // Cache essential data files
      caches.open(DATA_CACHE).then((cache) => {
        console.log('[Service Worker] Precaching data files');
        return cache.addAll(DATA_URLS).catch((err) => {
          console.warn('[Service Worker] Some data files failed to cache:', err);
        });
      }),
    ]).then(() => {
      console.log('[Service Worker] Installation complete');
      return self.skipWaiting();
    })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, DATA_CACHE];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
      })
      .then((cachesToDelete) => {
        console.log('[Service Worker] Deleting old caches:', cachesToDelete);
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => caches.delete(cacheToDelete))
        );
      })
      .then(() => {
        console.log('[Service Worker] Activation complete');
        return self.clients.claim();
      })
  );
});

/**
 * Fetch event - serve from cache with network fallback
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Handle API requests - network first, cache fallback
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/trpc/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return offline fallback
            return new Response(
              JSON.stringify({ error: 'Offline', message: 'No cached data available' }),
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({ 'Content-Type': 'application/json' }),
              }
            );
          });
        })
    );
    return;
  }

  // Handle data files - cache first, update in background (stale-while-revalidate)
  if (url.pathname.startsWith('/data/')) {
    event.respondWith(
      caches.open(DATA_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            // Update cache in background
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Network failed, return cached version
            return cachedResponse;
          });

          // Return cached version immediately, update in background
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Handle static assets - cache first, network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone and cache the response
        const responseToCache = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Return offline fallback page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});

/**
 * Background sync event - sync queued data when online
 */
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-bible-data') {
    event.waitUntil(syncBibleData());
  }
});

/**
 * Sync queued data to server
 */
async function syncBibleData() {
  console.log('[Service Worker] Starting data sync...');
  
  try {
    // Open IndexedDB to get sync queue
    const db = await openIndexedDB();
    const syncQueue = await getSyncQueue(db);
    
    console.log(`[Service Worker] Found ${syncQueue.length} items to sync`);
    
    for (const item of syncQueue) {
      try {
        // Attempt to sync item
        const response = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });

        if (response.ok) {
          // Mark as synced
          await markItemAsSynced(db, item.id);
          console.log(`[Service Worker] Synced item ${item.id}`);
        } else {
          // Update retry count
          await updateSyncError(db, item.id, `HTTP ${response.status}`);
          console.warn(`[Service Worker] Failed to sync item ${item.id}: ${response.status}`);
        }
      } catch (error) {
        // Update retry count
        await updateSyncError(db, item.id, error.message);
        console.error(`[Service Worker] Error syncing item ${item.id}:`, error);
      }
    }
    
    console.log('[Service Worker] Data sync complete');
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
    throw error;
  }
}

/**
 * Open IndexedDB
 */
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BibleOS', 2);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get unsynced items from sync queue
 */
function getSyncQueue(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['sync_queue'], 'readonly');
    const store = transaction.objectStore('sync_queue');
    const index = store.index('synced');
    const request = index.getAll(false);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Mark item as synced
 */
function markItemAsSynced(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['sync_queue'], 'readwrite');
    const store = transaction.objectStore('sync_queue');
    const getRequest = store.get(id);
    
    getRequest.onsuccess = () => {
      const item = getRequest.result;
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
 * Update sync error
 */
function updateSyncError(db, id, error) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['sync_queue'], 'readwrite');
    const store = transaction.objectStore('sync_queue');
    const getRequest = store.get(id);
    
    getRequest.onsuccess = () => {
      const item = getRequest.result;
      if (item) {
        item.retryCount = (item.retryCount || 0) + 1;
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
 * Message event - handle messages from client
 */
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls || [];
    event.waitUntil(
      caches.open(DATA_CACHE).then((cache) => {
        return cache.addAll(urls);
      })
    );
  }
});

/**
 * Push notification event (for future use)
 */
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'BibleOS';
  const options = {
    body: data.body || 'New content available',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'bibleos-notification',
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

/**
 * Notification click event
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

console.log('[Service Worker] Loaded successfully');
