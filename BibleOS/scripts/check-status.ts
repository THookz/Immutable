import { getDb } from '../server/db.js';
import { lemmas, verses, strongsDictionary, symbols, historicalEvents } from '../drizzle/schema.js';
import { sql } from 'drizzle-orm';

const db = await getDb();

if (!db) {
  console.error('❌ Database connection failed');
  process.exit(1);
}

const counts = await Promise.all([
  db.select({ count: sql<number>`count(*)` }).from(lemmas),
  db.select({ count: sql<number>`count(*)` }).from(verses),
  db.select({ count: sql<number>`count(*)` }).from(strongsDictionary),
  db.select({ count: sql<number>`count(*)` }).from(symbols),
  db.select({ count: sql<number>`count(*)` }).from(historicalEvents),
]);

console.log('\n📊 BibleOS Database Status:');
console.log('================================');
console.log('  Lemmas (Hebrew/Greek words):', counts[0][0].count);
console.log('  Verses:', counts[1][0].count);
console.log('  Strong\'s Dictionary:', counts[2][0].count);
console.log('  Symbols:', counts[3][0].count);
console.log('  Historical Events:', counts[4][0].count);
console.log('================================\n');

process.exit(0);
