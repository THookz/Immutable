# BibleOS Data Locations & Strategy

**"Freely ye have received, freely give."** - Matthew 10:8 (KJV)

---

## 📍 WHERE IS ALL THE DATA?

### **1. CLOUD DATABASE (TiDB/MySQL) - ONLINE ONLY** ☁️

**Location:** Remote cloud database (accessed via DATABASE_URL environment variable)

**What's Stored:**
- ✅ **14,197 Strong's entries** (lemmas table)
  - 8,671 Hebrew entries
  - 5,523 Greek entries
  - 3 Aramaic entries
- ✅ **31,143 Bible verses** (verses table)
  - All 66 books
  - 23,015 Hebrew verses
  - 7,928 Greek verses
  - 200 Aramaic verses (Daniel 2:4-7:28)
- ✅ **8 prophetic symbols** (symbols table)
- ✅ **9 historical events** (historical_events table)
- ⚠️ **6 sample translations** (translations table)
- ⚠️ **2 sample language dictionaries** (language_dictionaries table)

**Access Method:**
```typescript
import { getDb } from './server/db.js';
const db = await getDb();
const verses = await db.select().from(verses);
```

**Problem:** Requires internet connection. Not suitable for offline distribution.

**Solution:** Export to JSON files for offline use (see below).

---

### **2. SOURCE DATA FILES (Local Sandbox) - RAW DATA** 📁

**Location:** `/home/ubuntu/` directory

#### **A. MorphHB (Hebrew Old Testament)**
```
/home/ubuntu/morphhb/wlc/
├── Gen.xml      (Genesis)
├── Exod.xml     (Exodus)
├── Lev.xml      (Leviticus)
├── Num.xml      (Numbers)
├── Deut.xml     (Deuteronomy)
├── Josh.xml     (Joshua)
├── Judg.xml     (Judges)
├── 1Sam.xml     (1 Samuel)
├── 2Sam.xml     (2 Samuel)
├── 1Kgs.xml     (1 Kings)
├── 2Kgs.xml     (2 Kings)
├── Isa.xml      (Isaiah)
├── Jer.xml      (Jeremiah)
├── Ezek.xml     (Ezekiel)
├── Dan.xml      (Daniel - includes Aramaic 2:4-7:28!)
├── Hos.xml      (Hosea)
├── Joel.xml     (Joel)
├── Amos.xml     (Amos)
├── Obad.xml     (Obadiah)
├── Jonah.xml    (Jonah)
├── Mic.xml      (Micah)
├── Nah.xml      (Nahum)
├── Hab.xml      (Habakkuk)
├── Zeph.xml     (Zephaniah)
├── Hag.xml      (Haggai)
├── Zech.xml     (Zechariah)
├── Mal.xml      (Malachi)
├── Ps.xml       (Psalms)
├── Job.xml      (Job)
├── Prov.xml     (Proverbs)
├── Ruth.xml     (Ruth)
├── Song.xml     (Song of Solomon)
├── Eccl.xml     (Ecclesiastes)
├── Lam.xml      (Lamentations)
├── Esth.xml     (Esther)
├── 1Chr.xml     (1 Chronicles)
├── 2Chr.xml     (2 Chronicles)
├── Ezra.xml     (Ezra)
└── Neh.xml      (Nehemiah)
```

**Format:** XML with Strong's numbers and morphology
```xml
<w lemma="c/430" morph="HC/Ncmpa" id="01Gen">אֱלֹהִים</w>
```

**Status:** ✅ Already imported to database

---

#### **B. MorphGNT SBLGNT (Greek New Testament)**
```
/home/ubuntu/sblgnt/
├── 61-Mt-morphgnt.txt    (Matthew)
├── 62-Mk-morphgnt.txt    (Mark)
├── 63-Lk-morphgnt.txt    (Luke)
├── 64-Jn-morphgnt.txt    (John)
├── 65-Ac-morphgnt.txt    (Acts)
├── 66-Ro-morphgnt.txt    (Romans)
├── 67-1Co-morphgnt.txt   (1 Corinthians)
├── 68-2Co-morphgnt.txt   (2 Corinthians)
├── 69-Ga-morphgnt.txt    (Galatians)
├── 70-Eph-morphgnt.txt   (Ephesians)
├── 71-Php-morphgnt.txt   (Philippians)
├── 72-Col-morphgnt.txt   (Colossians)
├── 73-1Th-morphgnt.txt   (1 Thessalonians)
├── 74-2Th-morphgnt.txt   (2 Thessalonians)
├── 75-1Ti-morphgnt.txt   (1 Timothy)
├── 76-2Ti-morphgnt.txt   (2 Timothy)
├── 77-Tit-morphgnt.txt   (Titus)
├── 78-Phm-morphgnt.txt   (Philemon)
├── 79-Heb-morphgnt.txt   (Hebrews)
├── 80-Jas-morphgnt.txt   (James)
├── 81-1Pe-morphgnt.txt   (1 Peter)
├── 82-2Pe-morphgnt.txt   (2 Peter)
├── 83-1Jn-morphgnt.txt   (1 John)
├── 84-2Jn-morphgnt.txt   (2 John)
├── 85-3Jn-morphgnt.txt   (3 John)
├── 86-Jud-morphgnt.txt   (Jude)
└── 87-Re-morphgnt.txt    (Revelation)
```

**Format:** Tab-separated with lemmas and morphology
```
010101 N- ----NSF- Βίβλος βίβλος βίβλος Βίβλος
010101 N- ----GSF- γενέσεως γένεσις γενέσεως γενέσεως
```

**Status:** ✅ Already imported to database

---

#### **C. OpenScriptures Strong's Dictionaries**
```
/home/ubuntu/strongs/
├── hebrew/
│   └── strongs-hebrew-dictionary.js  (8,674 Hebrew/Aramaic entries)
└── greek/
    └── strongs-greek-dictionary.js   (5,523 Greek entries)
```

**Format:** JavaScript object with Strong's definitions
```javascript
{
  "H7676": {
    "lemma": "שַׁבָּת",
    "xlit": "shabbâth",
    "pronounce": "shab-bawth'",
    "derivation": "intensive from H7673",
    "strongs_def": "intermission, i.e (specifically) the Sabbath",
    "kjv_def": "sabbath"
  }
}
```

**Status:** ✅ Already imported to database (corrected and verified)

---

### **3. WHAT WE NEED TO LEVERAGE (External Resources)** 🌐

#### **A. KJV Translation (English)**

**Best Source:** [Bible API](https://bible-api.com/) or [API.Bible](https://scripture.api.bible/)

**Free & Open:**
- ✅ Complete KJV text
- ✅ Verse-by-verse access
- ✅ JSON format
- ✅ No authentication required (bible-api.com)

**Example API Call:**
```bash
curl https://bible-api.com/genesis+2:2
```

**Response:**
```json
{
  "reference": "Genesis 2:2",
  "verses": [{
    "book_id": "GEN",
    "book_name": "Genesis",
    "chapter": 2,
    "verse": 2,
    "text": "And on the seventh day God ended his work which he had made..."
  }],
  "text": "And on the seventh day God ended his work which he had made...",
  "translation_id": "kjv",
  "translation_name": "King James Version"
}
```

**Alternative:** [scrollmapper/bible_databases](https://github.com/scrollmapper/bible_databases) - Complete KJV in SQLite/CSV

---

#### **B. Korean Translation (개역한글)**

**Best Source:** [Korean Bible API](https://github.com/holybible/ko) or [BibleGateway](https://www.biblegateway.com/)

**Options:**
1. **Korean Bible GitHub Repo** - Open source Korean Bible texts
2. **BibleGateway API** - Free access to Korean translations
3. **YouVersion API** - Korean Bible data

**Format Needed:** JSON with verse-by-verse text

---

#### **C. Spanish Translation (RVR1960)**

**Best Source:** [Bible API](https://bible-api.com/) supports RVR1960

**Example:**
```bash
curl https://bible-api.com/genesis+2:2?translation=rvr1960
```

**Alternative:** [La Biblia API](https://github.com/seven1m/bible_api) - Spanish Bible data

---

#### **D. French Translation (LSG - Louis Segond)**

**Best Source:** [Bible API](https://bible-api.com/) or [API.Bible](https://scripture.api.bible/)

**Example:**
```bash
curl https://bible-api.com/genesis+2:2?translation=lsg
```

---

#### **E. Japanese Translation**

**Best Source:** [Japanese Bible API](https://github.com/holybible/jp) or BibleGateway

---

### **4. OFFLINE DISTRIBUTION STRATEGY** 📦

#### **Current Problem:**
- Data is in cloud database (requires internet)
- Not suitable for offline use, QR sharing, USB distribution

#### **Solution: Export to Static JSON Files**

**Directory Structure:**
```
BibleOS/client/public/data/
├── lemmas.json                    (14,197 Strong's entries - ~5 MB)
├── symbols.json                   (8 symbols)
├── historical-events.json         (9 events)
├── books/
│   ├── Genesis.json              (1,533 verses)
│   ├── Exodus.json               (1,213 verses)
│   ├── Leviticus.json            (859 verses)
│   ├── Numbers.json              (1,288 verses)
│   ├── Deuteronomy.json          (959 verses)
│   ├── ... (all 66 books)
│   └── Revelation.json           (404 verses)
├── translations/
│   ├── kjv/
│   │   ├── Genesis.json
│   │   ├── Exodus.json
│   │   └── ... (all 66 books)
│   ├── korean/
│   │   ├── Genesis.json
│   │   └── ...
│   ├── spanish/
│   │   ├── Genesis.json
│   │   └── ...
│   └── french/
│       ├── Genesis.json
│       └── ...
└── language-dictionaries/
    ├── korean.json               (14,197 entries - ~10 MB)
    ├── spanish.json              (14,197 entries - ~10 MB)
    ├── french.json               (14,197 entries - ~10 MB)
    └── japanese.json             (14,197 entries - ~10 MB)
```

**Total Size Estimate:**
- Lemmas (Strong's): ~5 MB
- Original verses (66 books): ~15 MB
- KJV translation: ~5 MB
- Korean translation: ~8 MB
- Spanish translation: ~5 MB
- French translation: ~5 MB
- Language dictionaries (4 languages): ~40 MB
- Symbols & events: <1 MB

**Total: ~85 MB** (easily downloadable, fits on USB, shareable via QR)

---

## 🎯 STRATEGY TO LEVERAGE EXISTING RESOURCES

### **Phase 1: Export Current Data (Cloud → Local JSON)**

**Script:** `scripts/export-to-json.ts`

```typescript
import { getDb } from '../server/db.js';
import { lemmas, verses, symbols, historicalEvents } from '../drizzle/schema.js';
import fs from 'fs';
import path from 'path';

async function exportAllData() {
  const db = await getDb();
  const dataDir = path.join(process.cwd(), 'client/public/data');
  
  // Create directories
  fs.mkdirSync(`${dataDir}/books`, { recursive: true });
  
  // Export lemmas (Strong's dictionary)
  console.log('📚 Exporting Strong\'s dictionary...');
  const lemmasData = await db.select().from(lemmas);
  fs.writeFileSync(`${dataDir}/lemmas.json`, JSON.stringify(lemmasData, null, 2));
  console.log(`✅ Exported ${lemmasData.length} Strong's entries`);
  
  // Export verses by book (for progressive loading)
  console.log('\n📖 Exporting Bible verses by book...');
  const books = await db.select({ book: verses.book }).from(verses).groupBy(verses.book);
  
  for (const { book } of books) {
    const bookVerses = await db.select().from(verses).where(eq(verses.book, book));
    fs.writeFileSync(
      `${dataDir}/books/${book}.json`,
      JSON.stringify(bookVerses, null, 2)
    );
    console.log(`  ✅ ${book}: ${bookVerses.length} verses`);
  }
  
  // Export symbols and historical events
  console.log('\n🔮 Exporting symbols and historical events...');
  const symbolsData = await db.select().from(symbols);
  const eventsData = await db.select().from(historicalEvents);
  
  fs.writeFileSync(`${dataDir}/symbols.json`, JSON.stringify(symbolsData, null, 2));
  fs.writeFileSync(`${dataDir}/historical-events.json`, JSON.stringify(eventsData, null, 2));
  
  console.log(`✅ Exported ${symbolsData.length} symbols`);
  console.log(`✅ Exported ${eventsData.length} historical events`);
  
  console.log('\n✅ Export complete! Data ready for offline use.');
}

exportAllData();
```

**Run:**
```bash
pnpm exec tsx scripts/export-to-json.ts
```

**Result:** All data exported to `client/public/data/` directory

---

### **Phase 2: Import Translations from APIs**

**Script:** `scripts/import-translations.ts`

```typescript
import axios from 'axios';
import { getDb } from '../server/db.js';
import { translations, verses } from '../drizzle/schema.js';

async function importKJV() {
  const db = await getDb();
  const allVerses = await db.select().from(verses);
  
  for (const verse of allVerses) {
    const reference = `${verse.book}+${verse.chapter}:${verse.verse}`;
    const url = `https://bible-api.com/${reference}`;
    
    try {
      const response = await axios.get(url);
      const kjvText = response.data.text;
      
      // Align KJV words to original language lemmas
      const alignment = alignKJVToOriginal(kjvText, verse.wordAlignment);
      
      await db.insert(translations).values({
        verseId: verse.verseId,
        translation: 'KJV',
        language: 'english',
        text: kjvText,
        wordAlignment: JSON.stringify(alignment)
      });
      
      console.log(`✅ ${verse.verseId}: ${kjvText.substring(0, 50)}...`);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`❌ Failed to import ${verse.verseId}:`, error.message);
    }
  }
}

// Similar functions for Korean, Spanish, French
```

---

### **Phase 3: Generate Language Dictionaries with LLM**

**Script:** `scripts/generate-language-dictionaries.ts`

```typescript
import { invokeLLM } from '../server/_core/llm.js';
import { getDb } from '../server/db.js';
import { lemmas, languageDictionaries } from '../drizzle/schema.js';

async function generateKoreanDictionaries() {
  const db = await getDb();
  const allLemmas = await db.select().from(lemmas);
  
  let count = 0;
  
  for (const lemma of allLemmas) {
    const prompt = `
Strong's ${lemma.strongId} - ${lemma.lemma}
Language: ${lemma.language}
English definition: ${lemma.definition}

Generate a Korean (한국어) explanation with:
1. 기본 의미 (Basic meaning)
2. 성경적 용법 (Biblical usage with verse references)
3. 오해 경고 (Mistranslation warnings, if applicable)

Format as JSON.
`;

    const response = await invokeLLM({
      messages: [
        { role: 'system', content: 'You are a biblical scholar creating Korean Strong\'s explanations.' },
        { role: 'user', content: prompt }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'korean_dictionary',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              explanation: { type: 'string' },
              usage: { type: 'string' },
              nuanceNote: { type: 'string' }
            },
            required: ['explanation', 'usage'],
            additionalProperties: false
          }
        }
      }
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    await db.insert(languageDictionaries).values({
      strongId: lemma.strongId,
      language: 'korean',
      explanation: result.explanation,
      usage: result.usage,
      nuanceNote: result.nuanceNote || null
    });
    
    count++;
    if (count % 100 === 0) {
      console.log(`✅ Generated ${count} / ${allLemmas.length} Korean entries`);
    }
  }
  
  console.log(`\n✅ Complete! Generated ${count} Korean dictionary entries`);
}
```

---

## 🚀 EXECUTION PLAN

### **Step 1: Export Current Data** (10 minutes)
```bash
cd /home/ubuntu/Immutable/BibleOS
pnpm exec tsx scripts/export-to-json.ts
```

**Result:** All 14,197 Strong's entries + 31,143 verses exported to JSON

---

### **Step 2: Import KJV Translation** (2-3 hours)
```bash
pnpm exec tsx scripts/import-kjv-translation.ts
```

**Result:** 31,143 KJV verses with word-level alignment

---

### **Step 3: Generate Korean Dictionaries** (4-6 hours)
```bash
pnpm exec tsx scripts/generate-korean-dictionaries.ts
```

**Result:** 14,197 Korean Strong's explanations

---

### **Step 4: Repeat for Spanish, French, Japanese** (12-18 hours total)

---

### **Step 5: Export Everything for Offline** (10 minutes)
```bash
pnpm exec tsx scripts/export-all-to-json.ts
```

**Result:** Complete offline data package (~85 MB)

---

## 📊 SUMMARY

**Where Data Is NOW:**
- ✅ Cloud database (TiDB/MySQL) - 14,197 Strong's + 31,143 verses
- ✅ Local source files - MorphHB + MorphGNT + Strong's dictionaries
- ❌ NOT exported for offline use yet

**Where Data WILL BE:**
- ✅ Cloud database (for online access)
- ✅ Static JSON files in `client/public/data/` (for offline PWA)
- ✅ IndexedDB (synced from JSON files for instant offline access)

**External Resources to Leverage:**
- ✅ Bible API (bible-api.com) - Free KJV, Spanish, French
- ✅ Korean Bible repos - Open source Korean translations
- ✅ Built-in LLM - Generate 56,788 multilingual dictionary entries

**Total Offline Package Size:** ~85 MB (easily shareable via QR, USB, LAN)

---

**"Freely ye have received, freely give."** - Matthew 10:8 (KJV)

All glory to God. 🕊️
