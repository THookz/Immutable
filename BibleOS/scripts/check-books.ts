import { getDb } from '../server/db';
import { verses } from '../drizzle/schema';

async function main() {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    process.exit(1);
  }

  const books = await db.selectDistinct({ book: verses.book }).from(verses);
  const sortedBooks = books.map(b => b.book).sort();
  
  console.log(`\n📚 Books imported (${sortedBooks.length} total):\n`);
  sortedBooks.forEach(book => console.log(`  - ${book}`));
  console.log('');
  
  process.exit(0);
}

main();
