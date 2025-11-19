import { getDb } from '../server/db';
import { lemmas } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

async function checkStrongs() {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    return;
  }

  // Check H996
  const h996 = await db.select().from(lemmas).where(eq(lemmas.strongId, 'H996'));
  console.log('\n=== H996 (should be "between") ===');
  console.log(JSON.stringify(h996, null, 2));

  // Check H7637
  const h7637 = await db.select().from(lemmas).where(eq(lemmas.strongId, 'H7637'));
  console.log('\n=== H7637 (should be "seventh") ===');
  console.log(JSON.stringify(h7637, null, 2));

  process.exit(0);
}

checkStrongs();
