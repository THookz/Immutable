import { getDb } from '../server/db.js';
import { lemmas, verses, symbols, historicalEvents, translations, languageDictionaries } from '../drizzle/schema.js';
import { sql } from 'drizzle-orm';

const db = await getDb();

if (!db) {
  console.error('❌ Database connection failed');
  process.exit(1);
}

console.log('\n📊 BibleOS Database Verification');
console.log('================================\n');

// Count all tables
const counts = await Promise.all([
  db.select({ count: sql<number>`count(*)` }).from(lemmas),
  db.select({ count: sql<number>`count(*)` }).from(verses),
  db.select({ count: sql<number>`count(*)` }).from(symbols),
  db.select({ count: sql<number>`count(*)` }).from(historicalEvents),
  db.select({ count: sql<number>`count(*)` }).from(translations),
  db.select({ count: sql<number>`count(*)` }).from(languageDictionaries),
]);

console.log('📋 Table Counts:');
console.log(`  Lemmas (Strong's entries): ${counts[0][0].count}`);
console.log(`  Verses (Bible verses with alignment): ${counts[1][0].count}`);
console.log(`  Symbols (Prophetic typology): ${counts[2][0].count}`);
console.log(`  Historical Events: ${counts[3][0].count}`);
console.log(`  Translations (KJV, Korean, etc.): ${counts[4][0].count}`);
console.log(`  Language Dictionaries: ${counts[5][0].count}`);

// Check unique books
const booksResult = await db.select({ book: verses.book }).from(verses).groupBy(verses.book);
console.log(`\n📖 Unique Books: ${booksResult.length}`);
const sortedBooks = booksResult.map(b => b.book).sort();
console.log('Books:');
for (let i = 0; i < sortedBooks.length; i += 5) {
  console.log('  ' + sortedBooks.slice(i, i + 5).join(', '));
}

// Check language distribution in verses
const langResult = await db.select({ 
  language: verses.language,
  count: sql<number>`count(*)` 
}).from(verses).groupBy(verses.language);

console.log('\n🌍 Verse Language Distribution:');
langResult.forEach(l => {
  console.log(`  ${l.language}: ${l.count} verses`);
});

// Check Strong's distribution (lemmas table)
const strongsLangResult = await db.select({ 
  language: lemmas.language,
  count: sql<number>`count(*)` 
}).from(lemmas).groupBy(lemmas.language);

console.log('\n📚 Strong\'s Dictionary Distribution (Lemmas):');
strongsLangResult.forEach(l => {
  console.log(`  ${l.language}: ${l.count} entries`);
});

// Sample a few entries to verify data quality
console.log('\n🔍 Sample Strong\'s Entries (Verification):');

const sampleStrongs = await db.select()
  .from(lemmas)
  .where(sql`strong_id IN ('H7676', 'H7637', 'H996', 'G4521', 'G166')`)
  .limit(5);

sampleStrongs.forEach(s => {
  const def = s.definition?.substring(0, 60) || 'N/A';
  console.log(`  ${s.strongId} (${s.language}): ${def}...`);
});

console.log('\n✅ Database verification complete!');
console.log('\n📦 Current Data Location:');
console.log('  ├─ Cloud MySQL/TiDB database (online)');
console.log('  ├─ Accessible via DATABASE_URL environment variable');
console.log('  └─ NOT yet exported for offline use');

console.log('\n🎯 Next Steps for Offline Distribution:');
console.log('  1. ✅ Task 1 COMPLETE: Original Text Indexing');
console.log('  2. 🔄 Task 2 IN PROGRESS: Translation Alignment (need KJV, Korean, Spanish)');
console.log('  3. ⏳ Task 3 PENDING: Language-Specific Dictionaries (14,197 entries × 4 languages)');
console.log('  4. 📦 Export all data to JSON files for offline PWA');
console.log('  5. 💾 Implement IndexedDB sync mechanism');
console.log('  6. 📲 Enable progressive download of Bible books');
console.log('  7. 🌐 Create offline-first architecture\n');

process.exit(0);
