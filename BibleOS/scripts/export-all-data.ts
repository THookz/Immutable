import { getDb } from '../server/db.js';
import { lemmas, verses, symbols, historicalEvents, translations, languageDictionaries } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

console.log('\n📦 BibleOS Data Export');
console.log('================================');
console.log('Exporting all data to JSON files for offline use...');
console.log('Cloud database will remain intact.\n');

const db = await getDb();

if (!db) {
  console.error('❌ Database connection failed');
  process.exit(1);
}

const dataDir = path.join(process.cwd(), 'client/public/data');

// Create directories
fs.mkdirSync(`${dataDir}/books`, { recursive: true });
fs.mkdirSync(`${dataDir}/translations`, { recursive: true });
fs.mkdirSync(`${dataDir}/language-dictionaries`, { recursive: true });

console.log('📁 Created directory structure:');
console.log(`  ${dataDir}/`);
console.log(`  ├── books/`);
console.log(`  ├── translations/`);
console.log(`  └── language-dictionaries/\n`);

// ============================================
// 1. Export Strong's Dictionary (Lemmas)
// ============================================
console.log('📚 Exporting Strong\'s Dictionary (Lemmas)...');
const lemmasData = await db.select().from(lemmas);
fs.writeFileSync(`${dataDir}/lemmas.json`, JSON.stringify(lemmasData, null, 2));

const hebrewCount = lemmasData.filter(l => l.language === 'hebrew').length;
const greekCount = lemmasData.filter(l => l.language === 'greek').length;
const aramaicCount = lemmasData.filter(l => l.language === 'aramaic').length;

console.log(`  ✅ Exported ${lemmasData.length} Strong's entries`);
console.log(`     - ${hebrewCount} Hebrew entries`);
console.log(`     - ${greekCount} Greek entries`);
console.log(`     - ${aramaicCount} Aramaic entries`);

const lemmasSize = (fs.statSync(`${dataDir}/lemmas.json`).size / 1024 / 1024).toFixed(2);
console.log(`     - File size: ${lemmasSize} MB\n`);

// ============================================
// 2. Export Bible Verses (by book)
// ============================================
console.log('📖 Exporting Bible verses by book...');
const books = await db.select({ book: verses.book }).from(verses).groupBy(verses.book);

let totalVerses = 0;
let totalSize = 0;

for (const { book } of books) {
  const bookVerses = await db.select().from(verses).where(eq(verses.book, book));
  const filePath = `${dataDir}/books/${book}.json`;
  fs.writeFileSync(filePath, JSON.stringify(bookVerses, null, 2));
  
  const fileSize = fs.statSync(filePath).size;
  totalSize += fileSize;
  totalVerses += bookVerses.length;
  
  const lang = bookVerses[0]?.language || 'unknown';
  console.log(`  ✅ ${book.padEnd(20)} ${bookVerses.length.toString().padStart(5)} verses (${lang.padEnd(7)}) - ${(fileSize / 1024).toFixed(1)} KB`);
}

console.log(`\n  📊 Total: ${totalVerses} verses across ${books.length} books`);
console.log(`     - Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB\n`);

// ============================================
// 3. Export Symbols
// ============================================
console.log('🔮 Exporting Symbols (Prophetic Typology)...');
const symbolsData = await db.select().from(symbols);
fs.writeFileSync(`${dataDir}/symbols.json`, JSON.stringify(symbolsData, null, 2));
console.log(`  ✅ Exported ${symbolsData.length} symbols`);
symbolsData.forEach(s => {
  console.log(`     - ${s.name}`);
});

const symbolsSize = (fs.statSync(`${dataDir}/symbols.json`).size / 1024).toFixed(1);
console.log(`     - File size: ${symbolsSize} KB\n`);

// ============================================
// 4. Export Historical Events
// ============================================
console.log('📜 Exporting Historical Events...');
const eventsData = await db.select().from(historicalEvents);
fs.writeFileSync(`${dataDir}/historical-events.json`, JSON.stringify(eventsData, null, 2));
console.log(`  ✅ Exported ${eventsData.length} historical events`);
eventsData.forEach(e => {
  console.log(`     - ${e.name} (${e.date})`);
});

const eventsSize = (fs.statSync(`${dataDir}/historical-events.json`).size / 1024).toFixed(1);
console.log(`     - File size: ${eventsSize} KB\n`);

// ============================================
// 5. Export Translations (if any)
// ============================================
console.log('🌍 Exporting Translations...');
const translationsData = await db.select().from(translations);

if (translationsData.length > 0) {
  // Group by translation type
  const translationGroups = translationsData.reduce((acc, t) => {
    if (!acc[t.translation]) acc[t.translation] = [];
    acc[t.translation].push(t);
    return acc;
  }, {} as Record<string, typeof translationsData>);

  for (const [translationType, verses] of Object.entries(translationGroups)) {
    const filePath = `${dataDir}/translations/${translationType}.json`;
    fs.writeFileSync(filePath, JSON.stringify(verses, null, 2));
    console.log(`  ✅ ${translationType}: ${verses.length} verses`);
  }
} else {
  console.log(`  ⚠️  No translations found (pending import)`);
}
console.log();

// ============================================
// 6. Export Language Dictionaries (if any)
// ============================================
console.log('📖 Exporting Language-Specific Dictionaries...');
const langDictsData = await db.select().from(languageDictionaries);

if (langDictsData.length > 0) {
  // Group by language
  const langGroups = langDictsData.reduce((acc, d) => {
    if (!acc[d.language]) acc[d.language] = [];
    acc[d.language].push(d);
    return acc;
  }, {} as Record<string, typeof langDictsData>);

  for (const [language, entries] of Object.entries(langGroups)) {
    const filePath = `${dataDir}/language-dictionaries/${language}.json`;
    fs.writeFileSync(filePath, JSON.stringify(entries, null, 2));
    console.log(`  ✅ ${language}: ${entries.length} entries`);
  }
} else {
  console.log(`  ⚠️  No language dictionaries found (pending generation)`);
}
console.log();

// ============================================
// Summary
// ============================================
console.log('================================');
console.log('✅ Export Complete!\n');

console.log('📊 Summary:');
console.log(`  ├── Strong's Dictionary: ${lemmasData.length} entries (${lemmasSize} MB)`);
console.log(`  ├── Bible Verses: ${totalVerses} verses in ${books.length} books (${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
console.log(`  ├── Symbols: ${symbolsData.length} entries (${symbolsSize} KB)`);
console.log(`  ├── Historical Events: ${eventsData.length} entries (${eventsSize} KB)`);
console.log(`  ├── Translations: ${translationsData.length} verses`);
console.log(`  └── Language Dictionaries: ${langDictsData.length} entries\n`);

const totalExportSize = parseFloat(lemmasSize) + (totalSize / 1024 / 1024) + parseFloat(symbolsSize) / 1024 + parseFloat(eventsSize) / 1024;
console.log(`📦 Total Export Size: ${totalExportSize.toFixed(2)} MB\n`);

console.log('📍 Data Location: client/public/data/');
console.log('☁️  Cloud Database: Intact (no data removed)\n');

console.log('🎯 Next Steps:');
console.log('  1. Import translations (KJV, Korean, Spanish, French)');
console.log('  2. Generate language-specific dictionaries (56,788 entries)');
console.log('  3. Implement IndexedDB sync for offline PWA');
console.log('  4. Test complete offline functionality\n');

console.log('✅ Data ready for offline distribution!\n');

process.exit(0);
