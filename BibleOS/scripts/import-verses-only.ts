/**
 * Import Bible verses only (skips Strong's dictionaries)
 * Run this after Strong's dictionaries are already imported
 */

import { parseStringPromise } from 'xml2js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { getDb } from '../server/db';
import { verses } from '../drizzle/schema';

const MORPHHB_PATH = '/home/ubuntu/morphhb/wlc';
const MORPHGNT_PATH = '/home/ubuntu/sblgnt';

const OT_BOOKS: Record<string, string> = {
  'Gen': 'Genesis', '1Chr': '1 Chronicles', '1Kgs': '1 Kings', '1Sam': '1 Samuel',
  '2Chr': '2 Chronicles', '2Kgs': '2 Kings', '2Sam': '2 Samuel', 'Amos': 'Amos',
  'Dan': 'Daniel', 'Deut': 'Deuteronomy', 'Eccl': 'Ecclesiastes', 'Esth': 'Esther',
  'Exod': 'Exodus', 'Ezek': 'Ezekiel', 'Ezra': 'Ezra', 'Hab': 'Habakkuk',
  'Hag': 'Haggai', 'Hos': 'Hosea', 'Isa': 'Isaiah', 'Jer': 'Jeremiah',
  'Job': 'Job', 'Joel': 'Joel', 'Jonah': 'Jonah', 'Josh': 'Joshua',
  'Judg': 'Judges', 'Lam': 'Lamentations', 'Lev': 'Leviticus', 'Mal': 'Malachi',
  'Mic': 'Micah', 'Nah': 'Nahum', 'Neh': 'Nehemiah', 'Num': 'Numbers',
  'Obad': 'Obadiah', 'Prov': 'Proverbs', 'Ps': 'Psalms', 'Ruth': 'Ruth',
  'Song': 'Song of Solomon', 'Zech': 'Zechariah', 'Zeph': 'Zephaniah'
};

const NT_BOOKS: Record<string, string> = {
  '61-Mt': 'Matthew', '62-Mk': 'Mark', '63-Lk': 'Luke', '64-Jn': 'John',
  '65-Ac': 'Acts', '66-Ro': 'Romans', '67-1Co': '1 Corinthians', '68-2Co': '2 Corinthians',
  '69-Ga': 'Galatians', '70-Eph': 'Ephesians', '71-Php': 'Philippians', '72-Col': 'Colossians',
  '73-1Th': '1 Thessalonians', '74-2Th': '2 Thessalonians', '75-1Ti': '1 Timothy',
  '76-2Ti': '2 Timothy', '77-Tit': 'Titus', '78-Phm': 'Philemon', '79-Heb': 'Hebrews',
  '80-Jas': 'James', '81-1Pe': '1 Peter', '82-2Pe': '2 Peter', '83-1Jn': '1 John',
  '84-2Jn': '2 John', '85-3Jn': '3 John', '86-Jud': 'Jude', '87-Re': 'Revelation'
};

interface HebrewWord {
  lemma: string;
  text: string;
  morph: string;
  id: string;
}

interface GreekWord {
  bookChapterVerse: string;
  pos: string;
  morph: string;
  text: string;
  lemma: string;
}

function extractStrongId(lemma: string, prefix: string): string {
  const match = lemma.match(/\d+/);
  if (!match) return '';
  return `${prefix}${match[0]}`;
}

function parseHebrewVerse(verseElement: any, bookName: string, isAramaic: boolean): any {
  const osisId = verseElement.$.osisID;
  const [book, chapter, verse] = osisId.split('.');
  
  const words: HebrewWord[] = [];
  const verseWords = Array.isArray(verseElement.w) ? verseElement.w : [verseElement.w];
  
  for (const word of verseWords) {
    if (!word || !word.$) continue;
    words.push({
      lemma: word.$.lemma || '',
      text: word._ || '',
      morph: word.$.morph || '',
      id: word.$.id || ''
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
    originalText,
    language: isAramaic ? 'aramaic' : 'hebrew',
    wordAlignment: JSON.stringify(wordAlignment)
  };
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

async function importHebrewOT() {
  console.log('Importing Hebrew Old Testament...');
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const files = readdirSync(MORPHHB_PATH).filter(f => f.endsWith('.xml'));
  let totalVerses = 0;

  for (const file of files) {
    const bookCode = file.replace('.xml', '');
    const bookName = OT_BOOKS[bookCode];
    if (!bookName) continue;

    console.log(`  Processing ${bookName}...`);
    const xmlContent = readFileSync(join(MORPHHB_PATH, file), 'utf-8');
    const result = await parseStringPromise(xmlContent);
    const chapters = result.osis.osisText[0].div[0].chapter;
    if (!chapters) continue;

    for (const chapter of chapters) {
      if (!chapter.verse) continue;
      for (const verseElement of chapter.verse) {
        const osisId = verseElement.$.osisID;
        const isAramaic = bookName === 'Daniel' && isAramaicSection(osisId);
        const verseData = parseHebrewVerse(verseElement, bookName, isAramaic);
        
        try {
          await db.insert(verses).values([verseData]);
          totalVerses++;
          if (totalVerses % 100 === 0) {
            console.log(`    Imported ${totalVerses} verses...`);
          }
        } catch (error: any) {
          console.error(`Error importing ${osisId}:`, error.message);
        }
      }
    }
  }

  console.log(`✅ Imported ${totalVerses} Old Testament verses`);
}

function parseGreekWord(line: string): GreekWord | null {
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

function buildGreekVerse(verseRef: string, words: GreekWord[], bookName: string): any {
  const book = verseRef.substring(0, 2);
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
    originalText,
    language: 'greek',
    wordAlignment: JSON.stringify(wordAlignment)
  };
}

async function importGreekNT() {
  console.log('Importing Greek New Testament...');
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const files = readdirSync(MORPHGNT_PATH).filter(f => f.endsWith('-morphgnt.txt'));
  let totalVerses = 0;

  for (const file of files) {
    const bookCode = file.split('-')[0] + '-' + file.split('-')[1];
    const bookName = NT_BOOKS[bookCode];
    if (!bookName) continue;

    console.log(`  Processing ${bookName}...`);
    const content = readFileSync(join(MORPHGNT_PATH, file), 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());

    let currentVerse: any = null;
    let currentWords: GreekWord[] = [];

    for (const line of lines) {
      const word = parseGreekWord(line);
      if (!word) continue;
      const verseRef = word.bookChapterVerse;
      
      if (currentVerse && currentVerse !== verseRef) {
        const verseData = buildGreekVerse(currentVerse, currentWords, bookName);
        try {
          await db.insert(verses).values([verseData]);
          totalVerses++;
          if (totalVerses % 100 === 0) {
            console.log(`    Imported ${totalVerses} verses...`);
          }
        } catch (error: any) {
          console.error(`Error importing ${currentVerse}:`, error.message);
        }
        currentWords = [];
      }

      currentVerse = verseRef;
      currentWords.push(word);
    }

    if (currentWords.length > 0) {
      const verseData = buildGreekVerse(currentVerse, currentWords, bookName);
      try {
        await db.insert(verses).values([verseData]);
        totalVerses++;
      } catch (error: any) {
        console.error(`Error importing ${currentVerse}:`, error.message);
      }
    }
  }

  console.log(`✅ Imported ${totalVerses} New Testament verses`);
}

async function main() {
  console.log('🚀 Starting Bible verses import...\n');
  try {
    await importHebrewOT();
    await importGreekNT();
    console.log('\n✅ Complete Bible verses import finished!');
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

main();
