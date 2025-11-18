/**
 * Complete Bible Data Import Script
 * Imports full Hebrew Old Testament, Greek New Testament, and Strong's dictionaries
 * 
 * Data sources:
 * - MorphHB: Hebrew OT with Strong's numbers
 * - MorphGNT: Greek NT with morphology
 * - OpenScriptures Strong's: Hebrew/Aramaic and Greek dictionaries
 */

import { parseStringPromise } from 'xml2js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { getDb } from '../server/db';
import { lemmas, verses, translations } from '../drizzle/schema';

// Paths to data sources
const MORPHHB_PATH = '/home/ubuntu/morphhb/wlc';
const MORPHGNT_PATH = '/home/ubuntu/sblgnt';
const STRONGS_HEBREW_PATH = '/home/ubuntu/strongs/hebrew/strongs-hebrew-dictionary.js';
const STRONGS_GREEK_PATH = '/home/ubuntu/strongs/greek/strongs-greek-dictionary.js';

// Book name mappings
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

// Aramaic sections in Daniel
const ARAMAIC_SECTIONS = {
  'Dan.2.4': true, // Daniel 2:4 through 7:28 is Aramaic
  'Dan.7.28': true
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

/**
 * Import Strong's Hebrew/Aramaic dictionary
 */
async function importHebrewStrongs() {
  console.log('Importing Hebrew/Aramaic Strong\'s dictionary...');
  
  const content = readFileSync(STRONGS_HEBREW_PATH, 'utf-8');
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse Hebrew Strong\'s dictionary');
  }
  
  const strongsData = JSON.parse(jsonMatch[0]);
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  let count = 0;
  const batch: any[] = [];

  for (const [strongId, entry] of Object.entries(strongsData)) {
    const data: any = entry;
    const cleanStrongId = strongId.replace('H', '');
    
    batch.push({
      strongId: `H${cleanStrongId}`,
      lemma: data.lemma || '',
      transliteration: data.xlit || '',
      pronunciation: data.pron || '',
      definition: data.strongs_def || '',
      kjvUsage: data.kjv_def || '',
      derivation: data.derivation || '',
      language: 'hebrew',
      partOfSpeech: null,
      morphology: null
    });

    count++;
    
    // Insert in batches of 100
    if (batch.length >= 100) {
          await db.insert(lemmas).values(batch);
      batch.length = 0;
    }
  }

  // Insert remaining
  if (batch.length > 0) {
    await db.insert(lemmas).values(batch).onDuplicateKeyUpdate({
      set: { definition: batch[0].definition }
    });
  }

  console.log(`✅ Imported ${count} Hebrew/Aramaic Strong's entries`);
}

/**
 * Import Strong's Greek dictionary
 */
async function importGreekStrongs() {
  console.log('Importing Greek Strong\'s dictionary...');
  
  const content = readFileSync(STRONGS_GREEK_PATH, 'utf-8');
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse Greek Strong\'s dictionary');
  }
  
  const strongsData = JSON.parse(jsonMatch[0]);
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  let count = 0;
  const batch: any[] = [];

  for (const [strongId, entry] of Object.entries(strongsData)) {
    const data: any = entry;
    const cleanStrongId = strongId.replace('G', '');
    
    batch.push({
      strongId: `G${cleanStrongId}`,
      lemma: data.lemma || '',
      transliteration: data.translit || data.xlit || '',
      pronunciation: data.pron || '',
      definition: data.strongs_def || data.def || '',
      kjvUsage: data.kjv_def || '',
      derivation: data.derivation || '',
      language: 'greek',
      partOfSpeech: null,
      morphology: null
    });

    count++;
    
    // Insert in batches of 100
    if (batch.length >= 100) {
      await db.insert(lemmas).values(batch);
      batch.length = 0;
    }
  }

  // Insert remaining
  if (batch.length > 0) {
    await db.insert(lemmas).values(batch).onDuplicateKeyUpdate({
      set: { definition: batch[0].definition }
    });
  }

  console.log(`✅ Imported ${count} Greek Strong's entries`);
}

/**
 * Parse Hebrew verse from XML
 */
function parseHebrewVerse(verseElement: any, bookName: string, isAramaic: boolean): any {
  const osisId = verseElement.$.osisID; // e.g., "Gen.1.1"
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

  // Build original text
  const originalText = words.map(w => w.text).join(' ');
  
  // Build word alignment JSON
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

/**
 * Extract Strong's number from lemma
 */
function extractStrongId(lemma: string, prefix: string): string {
  // Lemma format: "430" or "b/7225" or "1254 a"
  const match = lemma.match(/\d+/);
  if (!match) return '';
  return `${prefix}${match[0]}`;
}

/**
 * Import Hebrew Old Testament
 */
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

    const batch: any[] = [];

    for (const chapter of chapters) {
      if (!chapter.verse) continue;
      
      for (const verseElement of chapter.verse) {
        const osisId = verseElement.$.osisID;
        const isAramaic = bookName === 'Daniel' && isAramaicSection(osisId);
        
        const verseData = parseHebrewVerse(verseElement, bookName, isAramaic);
        batch.push(verseData);
        totalVerses++;

        // Insert in batches of 5 to avoid SQL query size limit
        if (batch.length >= 5) {
          await db.insert(verses).values(batch);
          batch.length = 0;
        }
      }
    }

    // Insert remaining
    if (batch.length > 0) {
      await db.insert(verses).values(batch);
    }
  }

  console.log(`✅ Imported ${totalVerses} Old Testament verses`);
}

/**
 * Check if verse is in Aramaic section of Daniel
 */
function isAramaicSection(osisId: string): boolean {
  const [book, chapter, verse] = osisId.split('.');
  if (book !== 'Dan') return false;
  
  const ch = parseInt(chapter);
  const v = parseInt(verse);
  
  // Daniel 2:4 through 7:28 is Aramaic
  if (ch === 2 && v >= 4) return true;
  if (ch >= 3 && ch <= 6) return true;
  if (ch === 7 && v <= 28) return true;
  
  return false;
}

/**
 * Parse Greek NT verse
 */
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

/**
 * Import Greek New Testament
 */
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
    const batch: any[] = [];

    for (const line of lines) {
      const word = parseGreekWord(line);
      if (!word) continue;

      const verseRef = word.bookChapterVerse;
      
      if (currentVerse && currentVerse !== verseRef) {
        // Save previous verse
        const verseData = buildGreekVerse(currentVerse, currentWords, bookName);
        batch.push(verseData);
        totalVerses++;

        // Insert in batches of 5 to avoid SQL query size limit
        if (batch.length >= 5) {
          await db.insert(verses).values(batch);
          batch.length = 0;
        }

        currentWords = [];
      }

      currentVerse = verseRef;
      currentWords.push(word);
    }

    // Save last verse
    if (currentWords.length > 0) {
      const verseData = buildGreekVerse(currentVerse, currentWords, bookName);
      batch.push(verseData);
      totalVerses++;
    }

    // Insert remaining
    if (batch.length > 0) {
      await db.insert(verses).values(batch);
    }
  }

  console.log(`✅ Imported ${totalVerses} New Testament verses`);
}

/**
 * Build Greek verse data
 */
function buildGreekVerse(verseRef: string, words: GreekWord[], bookName: string): any {
  // Parse verse reference (format: BBCCVV)
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

/**
 * Main import function
 */
async function main() {
  console.log('🚀 Starting complete Bible data import...\n');
  
  try {
    // Step 1: Import Strong's dictionaries
    await importHebrewStrongs();
    await importGreekStrongs();
    
    // Step 2: Import Hebrew Old Testament
    await importHebrewOT();
    
    // Step 3: Import Greek New Testament
    await importGreekNT();
    
    console.log('\n✅ Complete Bible import finished successfully!');
    console.log('📖 The universal concordance bridge is now ready.');
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

main();
