/**
 * Data Sync Manager
 * Handles loading Bible data from JSON files into IndexedDB for offline use
 */

import {
  initDB,
  bulkPutData,
  getMetadata,
  setMetadata,
  getStoreCount,
  STORES,
} from './indexeddb';

export interface SyncProgress {
  stage: string;
  current: number;
  total: number;
  percentage: number;
  message: string;
}

export type SyncProgressCallback = (progress: SyncProgress) => void;

/**
 * Load all Bible data from JSON files into IndexedDB
 */
export async function syncAllData(
  onProgress?: SyncProgressCallback
): Promise<void> {
  try {
    // Initialize database
    await initDB();

    // Check if data is already synced
    const lastSync = await getMetadata('lastSyncTimestamp');
    const dataVersion = await getMetadata('dataVersion');
    
    // If data exists and version matches, skip sync
    const lemmasCount = await getStoreCount(STORES.LEMMAS);
    if (lemmasCount > 0 && dataVersion === '1.0') {
      console.log('Data already synced, skipping...');
      return;
    }

    // Sync lemmas (Strong's dictionary)
    await syncLemmas(onProgress);

    // Sync verses (all 66 books)
    await syncVerses(onProgress);

    // Sync translations
    await syncTranslations(onProgress);

    // Sync symbols
    await syncSymbols(onProgress);

    // Sync historical events
    await syncHistoricalEvents(onProgress);

    // Sync language dictionaries
    await syncLanguageDictionaries(onProgress);

    // Update metadata
    await setMetadata('lastSyncTimestamp', Date.now());
    await setMetadata('dataVersion', '1.0');

    if (onProgress) {
      onProgress({
        stage: 'complete',
        current: 100,
        total: 100,
        percentage: 100,
        message: 'All data synced successfully!',
      });
    }
  } catch (error) {
    console.error('Error syncing data:', error);
    throw error;
  }
}

/**
 * Sync lemmas from JSON file
 */
async function syncLemmas(onProgress?: SyncProgressCallback): Promise<void> {
  if (onProgress) {
    onProgress({
      stage: 'lemmas',
      current: 0,
      total: 14197,
      percentage: 0,
      message: 'Loading Strong\'s dictionary...',
    });
  }

  try {
    const response = await fetch('/data/lemmas.json');
    if (!response.ok) {
      throw new Error('Failed to fetch lemmas');
    }

    const lemmas = await response.json();
    
    // Batch insert for better performance
    const batchSize = 500;
    for (let i = 0; i < lemmas.length; i += batchSize) {
      const batch = lemmas.slice(i, i + batchSize);
      await bulkPutData(STORES.LEMMAS, batch);

      if (onProgress) {
        onProgress({
          stage: 'lemmas',
          current: Math.min(i + batchSize, lemmas.length),
          total: lemmas.length,
          percentage: Math.round((Math.min(i + batchSize, lemmas.length) / lemmas.length) * 100),
          message: `Loading Strong's dictionary... ${Math.min(i + batchSize, lemmas.length)}/${lemmas.length}`,
        });
      }
    }

    console.log(`✅ Synced ${lemmas.length} lemmas`);
  } catch (error) {
    console.error('Error syncing lemmas:', error);
    throw error;
  }
}

/**
 * Sync verses from book JSON files
 */
async function syncVerses(onProgress?: SyncProgressCallback): Promise<void> {
  const books = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
    '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
    'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
    'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
    'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
    'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
    'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
    'Matthew', 'Mark', 'Luke', 'John', 'Acts',
    'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
    'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
    '1 Timothy', '2 Timothy', 'Titus', 'Philemon',
    'Hebrews', 'James', '1 Peter', '2 Peter',
    '1 John', '2 John', '3 John', 'Jude', 'Revelation',
  ];

  let totalVerses = 0;
  let processedVerses = 0;

  for (let bookIndex = 0; bookIndex < books.length; bookIndex++) {
    const book = books[bookIndex];
    
    if (onProgress) {
      onProgress({
        stage: 'verses',
        current: bookIndex + 1,
        total: books.length,
        percentage: Math.round(((bookIndex + 1) / books.length) * 100),
        message: `Loading ${book}...`,
      });
    }

    try {
      const response = await fetch(`/data/books/${book}.json`);
      if (!response.ok) {
        console.warn(`Failed to fetch ${book}, skipping...`);
        continue;
      }

      const verses = await response.json();
      await bulkPutData(STORES.VERSES, verses);
      
      processedVerses += verses.length;
      totalVerses += verses.length;

      console.log(`✅ Synced ${verses.length} verses from ${book}`);
    } catch (error) {
      console.error(`Error syncing ${book}:`, error);
    }
  }

  console.log(`✅ Synced ${totalVerses} total verses from ${books.length} books`);
}

/**
 * Sync translations from JSON files
 */
async function syncTranslations(onProgress?: SyncProgressCallback): Promise<void> {
  if (onProgress) {
    onProgress({
      stage: 'translations',
      current: 0,
      total: 1,
      percentage: 0,
      message: 'Loading translations...',
    });
  }

  try {
    // Check if translations directory exists
    const response = await fetch('/data/translations/');
    if (!response.ok) {
      console.log('No translations available yet');
      return;
    }

    // For now, we'll just log that translations will be synced later
    // This will be implemented when translation data is available
    console.log('Translation sync will be implemented when data is available');
  } catch (error) {
    console.log('No translations to sync yet');
  }
}

/**
 * Sync symbols from JSON file
 */
async function syncSymbols(onProgress?: SyncProgressCallback): Promise<void> {
  if (onProgress) {
    onProgress({
      stage: 'symbols',
      current: 0,
      total: 1,
      percentage: 0,
      message: 'Loading prophetic symbols...',
    });
  }

  try {
    const response = await fetch('/data/symbols.json');
    if (!response.ok) {
      throw new Error('Failed to fetch symbols');
    }

    const symbols = await response.json();
    await bulkPutData(STORES.SYMBOLS, symbols);

    if (onProgress) {
      onProgress({
        stage: 'symbols',
        current: 1,
        total: 1,
        percentage: 100,
        message: `Loaded ${symbols.length} prophetic symbols`,
      });
    }

    console.log(`✅ Synced ${symbols.length} symbols`);
  } catch (error) {
    console.error('Error syncing symbols:', error);
    throw error;
  }
}

/**
 * Sync historical events from JSON file
 */
async function syncHistoricalEvents(onProgress?: SyncProgressCallback): Promise<void> {
  if (onProgress) {
    onProgress({
      stage: 'historical_events',
      current: 0,
      total: 1,
      percentage: 0,
      message: 'Loading historical events...',
    });
  }

  try {
    const response = await fetch('/data/historical-events.json');
    if (!response.ok) {
      throw new Error('Failed to fetch historical events');
    }

    const events = await response.json();
    await bulkPutData(STORES.HISTORICAL_EVENTS, events);

    if (onProgress) {
      onProgress({
        stage: 'historical_events',
        current: 1,
        total: 1,
        percentage: 100,
        message: `Loaded ${events.length} historical events`,
      });
    }

    console.log(`✅ Synced ${events.length} historical events`);
  } catch (error) {
    console.error('Error syncing historical events:', error);
    throw error;
  }
}

/**
 * Sync language dictionaries from JSON files
 */
async function syncLanguageDictionaries(onProgress?: SyncProgressCallback): Promise<void> {
  if (onProgress) {
    onProgress({
      stage: 'language_dictionaries',
      current: 0,
      total: 1,
      percentage: 0,
      message: 'Loading language dictionaries...',
    });
  }

  try {
    // Check if language dictionaries directory exists
    const response = await fetch('/data/language-dictionaries/');
    if (!response.ok) {
      console.log('No language dictionaries available yet');
      return;
    }

    // For now, we'll just log that dictionaries will be synced later
    // This will be implemented when dictionary data is available
    console.log('Language dictionary sync will be implemented when data is available');
  } catch (error) {
    console.log('No language dictionaries to sync yet');
  }
}

/**
 * Force re-sync all data (clear and reload)
 */
export async function forceSyncAllData(
  onProgress?: SyncProgressCallback
): Promise<void> {
  // Clear metadata to force re-sync
  await setMetadata('dataVersion', null);
  await syncAllData(onProgress);
}

/**
 * Get sync status
 */
export async function getSyncStatus(): Promise<{
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
}> {
  const lastSync = await getMetadata('lastSyncTimestamp');
  const dataVersion = await getMetadata('dataVersion');

  const counts = {
    lemmas: await getStoreCount(STORES.LEMMAS),
    verses: await getStoreCount(STORES.VERSES),
    translations: await getStoreCount(STORES.TRANSLATIONS),
    symbols: await getStoreCount(STORES.SYMBOLS),
    historicalEvents: await getStoreCount(STORES.HISTORICAL_EVENTS),
  };

  const isSynced = counts.lemmas > 0 && counts.verses > 0;

  return {
    isSynced,
    lastSync,
    dataVersion,
    counts,
  };
}
