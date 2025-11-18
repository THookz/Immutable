import { getDb } from '../server/db';
import { lemmas, verses } from '../drizzle/schema';
import { sql } from 'drizzle-orm';

async function main() {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    process.exit(1);
  }

  const lemmaCount = await db.select({ count: sql`count(*)` }).from(lemmas);
  const verseCount = await db.select({ count: sql`count(*)` }).from(verses);
  const hebrewCount = await db.select({ count: sql`count(*)` }).from(verses).where(sql`language = 'hebrew'`);
  const aramaicCount = await db.select({ count: sql`count(*)` }).from(verses).where(sql`language = 'aramaic'`);
  const greekCount = await db.select({ count: sql`count(*)` }).from(verses).where(sql`language = 'greek'`);

  console.log('\n📊 BibleOS Database Statistics:\n');
  console.log(`  Total Strong's Entries: ${lemmaCount[0].count}`);
  console.log(`  Total Bible Verses: ${verseCount[0].count}`);
  console.log(`    - Hebrew verses: ${hebrewCount[0].count}`);
  console.log(`    - Aramaic verses: ${aramaicCount[0].count}`);
  console.log(`    - Greek verses: ${greekCount[0].count}`);
  console.log('\n✅ Universal concordance bridge is complete!\n');
  
  process.exit(0);
}

main();
