/**
 * Clean Re-Import of Strong's Dictionaries
 * This script will UPDATE all existing Strong's entries with correct definitions
 * from the source files, fixing any corrupted data.
 */

import { readFileSync } from 'fs';
import { getDb } from '../server/db';
import { lemmas } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const STRONGS_HEBREW_PATH = '/home/ubuntu/strongs/hebrew/strongs-hebrew-dictionary.js';
const STRONGS_GREEK_PATH = '/home/ubuntu/strongs/greek/strongs-greek-dictionary.js';

interface StrongsEntry {
  lemma: string;
  xlit: string;
  pron: string;
  derivation: string;
  strongs_def: string;
  kjv_def: string;
}

/**
 * Re-import Hebrew/Aramaic Strong's dictionary
 */
async function reimportHebrewStrongs() {
  console.log('\n🔄 Re-importing Hebrew/Aramaic Strong\'s dictionary...');
  
  // Read and parse the JavaScript file
  const content = readFileSync(STRONGS_HEBREW_PATH, 'utf-8');
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse Hebrew Strong\'s dictionary');
  }
  
  const strongsData: Record<string, StrongsEntry> = JSON.parse(jsonMatch[0]);
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  let updated = 0;
  let verified = 0;
  const testEntries = ['H996', 'H7637', 'H7676', 'H784', 'H1']; // Test entries

  console.log('\n📋 Verifying source data for test entries:');
  for (const testId of testEntries) {
    const entry = strongsData[testId];
    if (entry) {
      console.log(`  ${testId}: "${entry.strongs_def.substring(0, 50)}..."`);
    }
  }

  console.log('\n⚙️  Updating database entries...');
  
  for (const [strongId, entry] of Object.entries(strongsData)) {
    try {
      // Update the entry
      await db.update(lemmas)
        .set({
          lemma: entry.lemma || '',
          transliteration: entry.xlit || '',
          pronunciation: entry.pron || '',
          definition: entry.strongs_def || '', // This is the key field!
          derivation: entry.derivation || '',
        })
        .where(eq(lemmas.strongId, strongId));
      
      updated++;
      
      // Log progress every 500 entries
      if (updated % 500 === 0) {
        console.log(`  ✓ Updated ${updated} entries...`);
      }
      
      // Verify test entries
      if (testEntries.includes(strongId)) {
        const result = await db.select().from(lemmas).where(eq(lemmas.strongId, strongId));
        if (result[0] && result[0].definition === entry.strongs_def) {
          console.log(`  ✅ ${strongId} verified: "${result[0].definition.substring(0, 50)}..."`);
          verified++;
        } else {
          console.error(`  ❌ ${strongId} MISMATCH!`);
          console.error(`     Expected: "${entry.strongs_def}"`);
          console.error(`     Got: "${result[0]?.definition}"`);
        }
      }
    } catch (error) {
      console.error(`  ❌ Error updating ${strongId}:`, error);
    }
  }

  console.log(`\n✅ Updated ${updated} Hebrew/Aramaic Strong's entries`);
  console.log(`✅ Verified ${verified}/${testEntries.length} test entries`);
  
  return updated;
}

/**
 * Re-import Greek Strong's dictionary
 */
async function reimportGreekStrongs() {
  console.log('\n🔄 Re-importing Greek Strong\'s dictionary...');
  
  // Read and parse the JavaScript file
  const content = readFileSync(STRONGS_GREEK_PATH, 'utf-8');
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse Greek Strong\'s dictionary');
  }
  
  const strongsData: Record<string, StrongsEntry> = JSON.parse(jsonMatch[0]);
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  let updated = 0;
  const testEntries = ['G4521', 'G4442', 'G166']; // Test entries (sabbaton, pur, aionios)

  console.log('\n📋 Verifying source data for test entries:');
  for (const testId of testEntries) {
    const entry = strongsData[testId];
    if (entry) {
      console.log(`  ${testId}: "${entry.strongs_def.substring(0, 50)}..."`);
    }
  }

  console.log('\n⚙️  Updating database entries...');
  
  for (const [strongId, entry] of Object.entries(strongsData)) {
    try {
      // Update the entry
      await db.update(lemmas)
        .set({
          lemma: entry.lemma || '',
          transliteration: entry.xlit || '',
          pronunciation: entry.pron || '',
          definition: entry.strongs_def || '', // This is the key field!
          derivation: entry.derivation || '',
        })
        .where(eq(lemmas.strongId, strongId));
      
      updated++;
      
      // Log progress every 500 entries
      if (updated % 500 === 0) {
        console.log(`  ✓ Updated ${updated} entries...`);
      }
      
      // Verify test entries
      if (testEntries.includes(strongId)) {
        const result = await db.select().from(lemmas).where(eq(lemmas.strongId, strongId));
        if (result[0] && result[0].definition === entry.strongs_def) {
          console.log(`  ✅ ${strongId} verified: "${result[0].definition.substring(0, 50)}..."`);
        } else {
          console.error(`  ❌ ${strongId} MISMATCH!`);
        }
      }
    } catch (error) {
      console.error(`  ❌ Error updating ${strongId}:`, error);
    }
  }

  console.log(`\n✅ Updated ${updated} Greek Strong's entries`);
  
  return updated;
}

/**
 * Final verification
 */
async function finalVerification() {
  console.log('\n🔍 Final Verification...');
  
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const criticalEntries = [
    { id: 'H996', expected: 'between' },
    { id: 'H7637', expected: 'seventh' },
    { id: 'H7676', expected: 'Sabbath' },
    { id: 'G4521', expected: 'Sabbath' },
    { id: 'G166', expected: 'perpetual, eternal' }
  ];

  console.log('\n📋 Checking critical entries:');
  let allCorrect = true;
  
  for (const entry of criticalEntries) {
    const result = await db.select().from(lemmas).where(eq(lemmas.strongId, entry.id));
    if (result[0]) {
      const def = result[0].definition.toLowerCase();
      const matches = def.includes(entry.expected.toLowerCase());
      const status = matches ? '✅' : '❌';
      console.log(`  ${status} ${entry.id}: "${result[0].definition.substring(0, 60)}..."`);
      if (!matches) {
        console.log(`     Expected to contain: "${entry.expected}"`);
        allCorrect = false;
      }
    } else {
      console.log(`  ❌ ${entry.id}: NOT FOUND`);
      allCorrect = false;
    }
  }

  if (allCorrect) {
    console.log('\n🎉 All critical entries verified correctly!');
  } else {
    console.log('\n⚠️  Some entries still have issues - manual review needed');
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🔥 Starting Clean Re-Import of Strong\'s Dictionaries');
  console.log('=' .repeat(60));
  
  try {
    const hebrewCount = await reimportHebrewStrongs();
    const greekCount = await reimportGreekStrongs();
    
    await finalVerification();
    
    console.log('\n' + '='.repeat(60));
    console.log(`✅ Re-import complete!`);
    console.log(`   - ${hebrewCount} Hebrew/Aramaic entries updated`);
    console.log(`   - ${greekCount} Greek entries updated`);
    console.log(`   - Total: ${hebrewCount + greekCount} entries`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during re-import:', error);
    process.exit(1);
  }
}

main();
