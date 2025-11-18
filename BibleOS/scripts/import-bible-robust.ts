/**
 * Robust Bible Import with Progress Tracking and Error Recovery
 * Imports complete Hebrew OT + Greek NT with Strong's alignment
 */

import { parseStringPromise } from 'xml2js';
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { getDb } from '../server/db';
import { verses } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const MORPHHB_PATH = '/home/ubuntu/morphhb/wlc';
const MORPHGNT_PATH = '/home/ubuntu/sblgnt';
const PROGRESS_FILE = '/home/ubuntu/Immutable/BibleOS/import-progress.json';

const OT_BOOKS: Record<string, string> = {
  'Gen': 'Genesis', 'Exod': 'Exodus', 'Lev': 'Leviticus', 'Num': 'Numbers', 'Deut': 'Deuteronomy',
  'Josh': 'Joshua', 'Judg': 'Judges', 'Ruth': 'Ruth', '1Sam': '1 Samuel', '2Sam': '2 Samuel',
  '1Kgs': '1 Kings', '2Kgs': '2 Kings', '1Chr': '1 Chronicles', '2Chr': '2 Chronicles',
  'Ezra': 'Ezra', 'Neh': 'Nehemiah', 'Esth': 'Esther', 'Job': 'Job', 'Ps': 'Psalms',
  'Prov': 'Proverbs', 'Eccl': 'Ecclesiastes', 'Song': 'Song of Solomon', 'Isa': 'Isaiah',
  'Jer': 'Jeremiah', 'Lam': 'Lamentations', 'Ezek': 'Ezekiel', 'Dan': 'Daniel',
  'Hos': 'Hosea', 'Joel': 'Joel', 'Amos': 'Amos', 'Obad': 'Obadiah', 'Jonah': 'Jonah',
  'Mic': 'Micah', 'Nah': 'Nahum', 'Hab': 'Habakkuk', 'Zeph': 'Zephaniah', 'Hag': 'Haggai',
  'Zech': 'Zechariah', 'Mal': 'Malachi'
};

const NT_BOOKS: Record<string, string> = {
  '61-Mt': 'Matthew', '62-Mk': 'Mark', '63-Lk': 'Luke', '64-Jn': 'John', '65-Ac': 'Acts',
  '66-Ro': 'Romans', '67-1Co': '1 Corinthians', '68-2Co': '2 Corinthians', '69-Ga': 'Galatians',
  '70-Eph': 'Ephesians', '71-Php': 'Philippians', '72-Col': 'Colossians',
  '73-1Th': '1 Thessalonians', '74-2Th': '2 Thessalonians', '75-1Ti': '1 Timothy',
  '76-2Ti': '2 Timothy', '77-Tit': 'Titus', '78-Phm': 'Philemon', '79-Heb': 'Hebrews',
  '80-Jas': 'James', '81-1Pe': '1 Peter', '82-2Pe': '2 Peter', '83-1Jn': '1 John',
  '84-2Jn': '2 John', '85-3Jn': '3 John', '86-Jud': 'Jude', '87-Re': 'Revelation'
};

interface Progress {
  completedBooks: string[];
  currentBook: string;
  versesImported: number;
  lastError?: string;
}

function loadProgress(): Progress {
  if (existsSync(PROGRESS_FILE)) {
    return JSON.parse(readFileSync(PROGRESS_FILE, 'utf-8'));
  }
  return { completedBooks: [], currentBook: '', versesImported: 0 };
}

function saveProgress(progress: Progress) {
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function extractStrongId(lemma: string, prefix: string): string {
  const match = lemma.match(/\d+/);
  return match ? `${prefix}${match[0]}` : '';
}

function isAramaicSection(osisId: string): boolean {
  const [book, chapter, verse] = osisId.split('.');
  if (book !== 'Dan') return false;
  const ch = parseInt(chapter);
  const v = parseInt(verse);
  if (ch === 2 && v >= 4) return true;
  if (ch >= 3 && ch <= 6) return true;
  if (ch === 7 && v <= 28) return true;
  return false;
}

function parseHebrewVerse(verseElement: any, bookName: string, isAramaic: boolean): any {
  const osisId = verseElement.$.osisID;
  const [book, chapter, verse] = osisId.split('.');
  
  const words: any[] = [];
  const verseWords = Array.isArray(verseElement.w) ? verseElement.w : [verseElement.w];
  
  for (const word of verseWords) {
    if (!word || !word.$) continue;
    words.push({
      lemma: word.$.lemma || '',
      text: word._ || '',
      morph: word.$.morph || ''
    });
  }

  const originalText = words.map(w => w.text).join(' ');
  const wordAlignment = words.map((w, idx) => ({
    position: idx + 1,
    word: w.text,
    strongId: extractStrongId(w.lemma, 'H'),
    morphology: w.morph
  }));

  return {
    verseId: osisId,
    book: bookName,
    chapter: parseInt(chapter),
    verse: parseInt(verse),
    text: originalText,
    language: isAramaic ? 'aramaic' : 'hebrew',
    wordAlignment: JSON.stringify(wordAlignment)
  };
}

async function importHebrewBook(file: string, progress: Progress): Promise<number> {
  const bookCode = file.replace('.xml', '');
  const bookName = OT_BOOKS[bookCode];
  if (!bookName) return 0;
  
  if (progress.completedBooks.includes(bookName)) {
    console.log(`  ⏭️  Skipping ${bookName} (already completed)`);
    return 0;
  }

  console.log(`  📖 Processing ${bookName}...`);
  progress.currentBook = bookName;
  saveProgress(progress);

  const db = await getDb();
  if (!db) throw new Error('Database not available');

  try {
    const xmlContent = readFileSync(join(MORPHHB_PATH, file), 'utf-8');
    const result = await parseStringPromise(xmlContent);
    const chapters = result.osis.osisText[0].div[0].chapter;
    if (!chapters) return 0;

    let bookVerses = 0;

    for (const chapter of chapters) {
      if (!chapter.verse) continue;
      
      for (const verseElement of chapter.verse) {
        try {
          const osisId = verseElement.$.osisID;
          const isAramaic = bookName === 'Daniel' && isAramaicSection(osisId);
          const verseData = parseHebrewVerse(verseElement, bookName, isAramaic);
          
          // Check if verse already exists
          const existing = await db.select().from(verses).where(eq(verses.verseId, osisId)).limit(1);
          if (existing.length === 0) {
            await db.insert(verses).values([verseData]);
            bookVerses++;
            progress.versesImported++;
            
            if (progress.versesImported % 100 === 0) {
              console.log(`    ✓ ${progress.versesImported} total verses imported...`);
              saveProgress(progress);
            }
          }
        } catch (error: any) {
          console.error(`    ⚠️  Error importing verse:`, error.message);
          progress.lastError = error.message;
          saveProgress(progress);
        }
      }
    }

    progress.completedBooks.push(bookName);
    saveProgress(progress);
    console.log(`  ✅ ${bookName}: ${bookVerses} verses imported`);
    
    // Auto-commit to GitHub after each book
    if (bookVerses > 0) {
      try {
        execSync(`cd /home/ubuntu/Immutable && git add -A && git commit -m "Import: ${bookName} (${bookVerses} verses)" && git push origin main`, { stdio: 'inherit' });
        console.log(`  💾 Committed ${bookName} to GitHub`);
      } catch (error: any) {
        console.log(`  ⚠️  Git commit failed (continuing anyway): ${error.message}`);
      }
    }
    
    return bookVerses;
    
  } catch (error: any) {
    console.error(`  ❌ Failed to process ${bookName}:`, error.message);
    progress.lastError = error.message;
    saveProgress(progress);
    return 0;
  }
}

function parseGreekWord(line: string): any {
  const parts = line.trim().split(/\s+/);
  if (parts.length < 5) return null;
  return {
    bookChapterVerse: parts[0],
    pos: parts[1],
    morph: parts[2],
    text: parts[3],
    lemma: parts[parts.length - 1]
  };
}

function buildGreekVerse(verseRef: string, words: any[], bookName: string): any {
  const chapter = parseInt(verseRef.substring(2, 4));
  const verse = parseInt(verseRef.substring(4, 6));
  const originalText = words.map(w => w.text).join(' ');
  const wordAlignment = words.map((w, idx) => ({
    position: idx + 1,
    word: w.text,
    lemma: w.lemma,
    morphology: w.morph,
    pos: w.pos
  }));

  return {
    verseId: `${bookName}.${chapter}.${verse}`,
    book: bookName,
    chapter,
    verse,
    text: originalText,
    language: 'greek',
    wordAlignment: JSON.stringify(wordAlignment)
  };
}

async function importGreekBook(file: string, progress: Progress): Promise<number> {
  const bookCode = file.split('-')[0] + '-' + file.split('-')[1];
  const bookName = NT_BOOKS[bookCode];
  if (!bookName) return 0;

  if (progress.completedBooks.includes(bookName)) {
    console.log(`  ⏭️  Skipping ${bookName} (already completed)`);
    return 0;
  }

  console.log(`  📖 Processing ${bookName}...`);
  progress.currentBook = bookName;
  saveProgress(progress);

  const db = await getDb();
  if (!db) throw new Error('Database not available');

  try {
    const content = readFileSync(join(MORPHGNT_PATH, file), 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    let currentVerse: any = null;
    let currentWords: any[] = [];
    let bookVerses = 0;

    for (const line of lines) {
      const word = parseGreekWord(line);
      if (!word) continue;
      const verseRef = word.bookChapterVerse;
      
      if (currentVerse && currentVerse !== verseRef) {
        try {
          const verseData = buildGreekVerse(currentVerse, currentWords, bookName);
          const existing = await db.select().from(verses).where(eq(verses.verseId, verseData.verseId)).limit(1);
          if (existing.length === 0) {
            await db.insert(verses).values([verseData]);
            bookVerses++;
            progress.versesImported++;
            
            if (progress.versesImported % 100 === 0) {
              console.log(`    ✓ ${progress.versesImported} total verses imported...`);
              saveProgress(progress);
            }
          }
        } catch (error: any) {
          console.error(`    ⚠️  Error importing verse:`, error.message);
          progress.lastError = error.message;
          saveProgress(progress);
        }
        currentWords = [];
      }

      currentVerse = verseRef;
      currentWords.push(word);
    }

    // Last verse
    if (currentWords.length > 0) {
      try {
        const verseData = buildGreekVerse(currentVerse, currentWords, bookName);
        const existing = await db.select().from(verses).where(eq(verses.verseId, verseData.verseId)).limit(1);
        if (existing.length === 0) {
          await db.insert(verses).values([verseData]);
          bookVerses++;
          progress.versesImported++;
        }
      } catch (error: any) {
        console.error(`    ⚠️  Error importing last verse:`, error.message);
      }
    }

    progress.completedBooks.push(bookName);
    saveProgress(progress);
    console.log(`  ✅ ${bookName}: ${bookVerses} verses imported`);
    
    // Auto-commit to GitHub after each book
    if (bookVerses > 0) {
      try {
        execSync(`cd /home/ubuntu/Immutable && git add -A && git commit -m "Import: ${bookName} (${bookVerses} verses)" && git push origin main`, { stdio: 'inherit' });
        console.log(`  💾 Committed ${bookName} to GitHub`);
      } catch (error: any) {
        console.log(`  ⚠️  Git commit failed (continuing anyway): ${error.message}`);
      }
    }
    
    return bookVerses;
    
  } catch (error: any) {
    console.error(`  ❌ Failed to process ${bookName}:`, error.message);
    progress.lastError = error.message;
    saveProgress(progress);
    return 0;
  }
}

async function main() {
  console.log('🚀 Starting robust Bible import with progress tracking...\n');
  
  const progress = loadProgress();
  console.log(`📊 Progress: ${progress.versesImported} verses already imported`);
  console.log(`📚 Completed books: ${progress.completedBooks.length}\n`);

  try {
    // Import Old Testament
    console.log('📖 OLD TESTAMENT\n');
    const otFiles = readdirSync(MORPHHB_PATH).filter(f => f.endsWith('.xml')).sort();
    for (const file of otFiles) {
      await importHebrewBook(file, progress);
    }

    // Import New Testament
    console.log('\n📖 NEW TESTAMENT\n');
    const ntFiles = readdirSync(MORPHGNT_PATH).filter(f => f.endsWith('-morphgnt.txt')).sort();
    for (const file of ntFiles) {
      await importGreekBook(file, progress);
    }

    console.log('\n✅ Complete Bible import finished!');
    console.log(`📊 Total verses imported: ${progress.versesImported}`);
    console.log(`📚 Books completed: ${progress.completedBooks.length}/66`);
    
  } catch (error: any) {
    console.error('\n❌ Import failed:', error.message);
    console.log('💾 Progress saved. Run again to resume.');
    process.exit(1);
  }
}

main();
