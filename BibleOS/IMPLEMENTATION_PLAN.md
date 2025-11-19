# BibleOS Implementation Plan - Tasks 2 & 3

**Goal:** Complete the multilingual concordance engine and enable offline distribution

---

## 📊 CURRENT STATUS

### ✅ What We Have (Task 1 Complete)
- **14,197 Strong's entries** in cloud database
  - 8,671 Hebrew entries
  - 5,523 Greek entries
  - 3 Aramaic entries
- **31,143 Bible verses** with word-level Strong's alignment
  - All 66 books imported
  - 23,015 Hebrew verses
  - 7,928 Greek verses
  - 200 Aramaic verses (Daniel 2:4-7:28)
- **Working concordance engine**
  - Click any word → see Hebrew/Greek/Aramaic
  - Strong's popup with definition, transliteration, pronunciation
- **8 prophetic symbols** with typology
- **9 historical events** with prophetic significance

### ⚠️ What We Need (Tasks 2 & 3)
- **Translation Alignment** - KJV, Korean, Spanish, French translations mapped to original lemmas
- **Language Dictionaries** - 14,197 Strong's entries explained in Korean, Spanish, French, Japanese
- **Offline Export** - All data exportable for PWA offline use

---

## 🎯 TASK 2: TRANSLATION ALIGNMENT

**Goal:** Map every word in every translation back to the original Hebrew/Greek/Aramaic lemma

### Phase 1: KJV Translation (English)

**Data Source Options:**
1. **Bible API** - https://bible-api.com or https://api.scripture.api.bible
2. **Open Source KJV** - https://github.com/scrollmapper/bible_databases
3. **SWORD Project** - https://www.crosswire.org/sword/modules/ModInfo.jsp

**Implementation:**
```typescript
// scripts/import-kjv-translation.ts
interface KJVVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

// For each verse:
// 1. Fetch KJV text
// 2. Tokenize into words
// 3. Align with original language words using existing wordAlignment
// 4. Insert into translations table

async function importKJV() {
  for (const verse of allVerses) {
    const kjvText = await fetchKJVVerse(verse.book, verse.chapter, verse.verse);
    const alignment = alignKJVToOriginal(kjvText, verse.wordAlignment);
    
    await db.insert(translations).values({
      verseId: verse.verseId,
      translation: 'KJV',
      language: 'english',
      text: kjvText,
      wordAlignment: JSON.stringify(alignment)
    });
  }
}
```

**Word Alignment Strategy:**
```json
{
  "verseId": "GEN.2.2",
  "translation": "KJV",
  "text": "And on the seventh day God ended his work",
  "wordAlignment": [
    { "word": "seventh", "strongId": "H7637", "position": 4 },
    { "word": "day", "strongId": "H3117", "position": 5 },
    { "word": "God", "strongId": "H430", "position": 6 }
  ]
}
```

### Phase 2: Korean Translation (개역한글)

**Data Source:**
- Korean Bible API or open-source Korean Bible database
- Align Korean words to Strong's numbers using existing Hebrew/Greek alignment

**Example:**
```json
{
  "verseId": "GEN.2.2",
  "translation": "개역한글",
  "language": "korean",
  "text": "하나님이 그 하시던 일을 일곱째 날에 마치시니",
  "wordAlignment": [
    { "word": "일곱째", "strongId": "H7637", "position": 6 },
    { "word": "날에", "strongId": "H3117", "position": 7 },
    { "word": "하나님이", "strongId": "H430", "position": 1 }
  ]
}
```

### Phase 3: Spanish Translation (RVR1960)

**Data Source:**
- Reina-Valera 1960 API or database
- Align Spanish words to Strong's numbers

**Example:**
```json
{
  "verseId": "GEN.2.2",
  "translation": "RVR1960",
  "language": "spanish",
  "text": "Y acabó Dios en el día séptimo la obra que hizo",
  "wordAlignment": [
    { "word": "séptimo", "strongId": "H7637", "position": 5 },
    { "word": "día", "strongId": "H3117", "position": 4 },
    { "word": "Dios", "strongId": "H430", "position": 2 }
  ]
}
```

### Phase 4: French & Japanese

Repeat the same process for French (LSG) and Japanese translations.

---

## 🎯 TASK 3: LANGUAGE-SPECIFIC DICTIONARIES

**Goal:** Generate culturally accurate, bias-free Strong's explanations in Korean, Spanish, French, Japanese

### Strategy: LLM-Powered Generation

Use the built-in LLM to generate all 14,197 entries × 4 languages = **56,788 dictionary entries**

### Generation Script Template

```typescript
// scripts/generate-language-dictionaries.ts
import { invokeLLM } from '../server/_core/llm.js';
import { getDb } from '../server/db.js';
import { lemmas, languageDictionaries } from '../drizzle/schema.js';

const SYSTEM_PROMPT = `You are a biblical Hebrew and Greek scholar creating plain-language Strong's concordance explanations.

Your task: Explain each Strong's entry in {LANGUAGE} with:
1. Plain-language definition
2. Biblical usage examples
3. Mistranslation warnings (if applicable)
4. Cultural/historical context

Critical terms to address:
- Hell (sheol, hades, gehenna, tartarus - all different!)
- Soul (nephesh, psyche - living being, not immortal essence)
- Eternal (olam, aiōn - age-lasting, not necessarily endless)
- Sabbath (shabbat - seventh day, Saturday, NOT Sunday)

Be culturally accurate and expose doctrinal bias in translations.`;

async function generateKoreanDictionaries() {
  const db = await getDb();
  const allLemmas = await db.select().from(lemmas);
  
  for (const lemma of allLemmas) {
    const prompt = `
Strong's ${lemma.strongId} - ${lemma.lemma}
Language: ${lemma.language}
English definition: ${lemma.definition}

Generate a Korean (한국어) explanation with:
1. 기본 의미 (Basic meaning)
2. 성경적 용법 (Biblical usage)
3. 오해 경고 (Mistranslation warnings, if applicable)
4. 역사적/문화적 맥락 (Historical/cultural context)

Format as JSON:
{
  "explanation": "...",
  "usage": "...",
  "nuanceNote": "..."
}
`;

    const response = await invokeLLM({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT.replace('{LANGUAGE}', 'Korean') },
        { role: 'user', content: prompt }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'language_dictionary',
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
      nuanceNote: result.nuanceNote
    });
    
    console.log(`✅ Generated Korean entry for ${lemma.strongId}`);
  }
}
```

### Critical Terms to Emphasize

**1. Hell (Multiple Greek/Hebrew Words)**

Korean:
```
H7585 (sheol - 스올):
기본 의미: 무덤, 죽은 자의 장소
⚠️ 오해 경고: 한국어 성경에서 "지옥"으로 번역되지만, 원어는 단순히 "무덤"을 의미합니다.
불타는 지옥이 아닙니다.

G86 (hades - 하데스):
기본 의미: 보이지 않는 영역, 무덤
⚠️ 오해 경고: "지옥"으로 번역되지만, 게헨나(불의 심판)와 다릅니다.

G1067 (gehenna - 게헨나):
기본 의미: 힌놈의 골짜기, 불의 장소
성경적 용법: 최후 심판의 불 (마태복음 5:22, 마가복음 9:43)
```

Spanish:
```
H7585 (sheol):
Significado básico: La tumba, el lugar de los muertos
⚠️ Advertencia: Traducido como "infierno" pero no es el fuego eterno.
Es simplemente la tumba.

G86 (hades):
Significado básico: El reino invisible, la tumba
⚠️ Advertencia: Diferente de gehenna (fuego del juicio)

G1067 (gehenna):
Significado básico: Valle de Hinom, lugar de fuego
Uso bíblico: El fuego del juicio final
```

**2. Eternal/Forever (aiōn, aiōnios, olam)**

Korean:
```
G166 (aiōnios - 아이오니오스):
기본 의미: "시대에 속한", "그 시대의 기간 동안"
⚠️ 오해 경고: "영원한"으로 번역되지만, 원어는 "시대적"을 의미합니다.
문맥에 따라 "그 시대 동안" 또는 "다가올 시대의"를 의미합니다.
역사적 변화: 초대 교회는 이를 "시대적"으로 이해했지만, 4세기 라틴어 번역에서 
"무한한"이라는 개념이 추가되었습니다.
```

**3. Sabbath (shabbat, sabbaton)**

Korean:
```
H7676 (shabbat - 샤바트):
기본 의미: 안식일, 일곱째 날 (토요일)
성경적 용법: 창세기 2:2-3 (창조 안식일), 출애굽기 20:8-11 (십계명)
⚠️ 오해 경고: 많은 교회가 일요일(첫째 날)을 안식일이라고 가르치지만, 
성경의 안식일은 토요일(일곱째 날)입니다.
역사적 변화: AD 321년 콘스탄티누스 황제가 일요일 법령을 내린 후 변경되었습니다.
```

### Batch Processing Strategy

**Generate in batches of 100 entries** to avoid rate limits and allow progress tracking:

```typescript
async function generateAllLanguageDictionaries() {
  const languages = ['korean', 'spanish', 'french', 'japanese'];
  const batchSize = 100;
  
  for (const language of languages) {
    console.log(`\n🌍 Generating ${language} dictionaries...`);
    
    for (let i = 0; i < allLemmas.length; i += batchSize) {
      const batch = allLemmas.slice(i, i + batchSize);
      await generateBatch(batch, language);
      console.log(`  ✅ Completed ${i + batch.length} / ${allLemmas.length}`);
      
      // Save progress
      await saveProgress(language, i + batch.length);
    }
  }
}
```

---

## 🎯 TASK 4: OFFLINE DISTRIBUTION

**Goal:** Export all data for offline PWA use

### Data Export Strategy

**1. Export to JSON files**
```typescript
// scripts/export-offline-data.ts
async function exportAllData() {
  const db = await getDb();
  
  // Export lemmas (Strong's dictionary)
  const lemmasData = await db.select().from(lemmas);
  fs.writeFileSync('public/data/lemmas.json', JSON.stringify(lemmasData));
  
  // Export verses (by book for progressive loading)
  const books = await db.select({ book: verses.book }).from(verses).groupBy(verses.book);
  for (const book of books) {
    const bookVerses = await db.select().from(verses).where(eq(verses.book, book.book));
    fs.writeFileSync(`public/data/books/${book.book}.json`, JSON.stringify(bookVerses));
  }
  
  // Export translations
  const translationsData = await db.select().from(translations);
  fs.writeFileSync('public/data/translations.json', JSON.stringify(translationsData));
  
  // Export language dictionaries
  const langDicts = await db.select().from(languageDictionaries);
  fs.writeFileSync('public/data/language-dictionaries.json', JSON.stringify(langDicts));
  
  // Export symbols and historical events
  const symbolsData = await db.select().from(symbols);
  const eventsData = await db.select().from(historicalEvents);
  fs.writeFileSync('public/data/symbols.json', JSON.stringify(symbolsData));
  fs.writeFileSync('public/data/historical-events.json', JSON.stringify(eventsData));
}
```

**2. Implement IndexedDB Sync**
```typescript
// client/src/lib/offline-db.ts
import { openDB } from 'idb';

const DB_NAME = 'bibleos';
const DB_VERSION = 1;

export async function initOfflineDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore('lemmas', { keyPath: 'strongId' });
      db.createObjectStore('verses', { keyPath: 'verseId' });
      db.createObjectStore('translations', { keyPath: 'id' });
      db.createObjectStore('languageDictionaries', { keyPath: 'id' });
      db.createObjectStore('symbols', { keyPath: 'symbolId' });
      db.createObjectStore('historicalEvents', { keyPath: 'eventId' });
    }
  });
}

export async function syncOfflineData() {
  const db = await initOfflineDB();
  
  // Download and store lemmas
  const lemmas = await fetch('/data/lemmas.json').then(r => r.json());
  const tx = db.transaction('lemmas', 'readwrite');
  for (const lemma of lemmas) {
    await tx.store.put(lemma);
  }
  await tx.done;
  
  // Repeat for other data...
}
```

**3. Progressive Download UI**
```typescript
// Show download progress
export function DownloadProgress() {
  const [progress, setProgress] = useState(0);
  
  async function downloadAll() {
    // Download lemmas (14,197 entries)
    await downloadLemmas(setProgress);
    
    // Download verses by book (66 books)
    for (let i = 0; i < 66; i++) {
      await downloadBook(books[i]);
      setProgress((i + 1) / 66 * 100);
    }
    
    // Download translations, dictionaries, etc.
  }
  
  return (
    <div>
      <h2>Download Bible for Offline Use</h2>
      <progress value={progress} max={100} />
      <button onClick={downloadAll}>Download All Data</button>
    </div>
  );
}
```

---

## 📋 IMPLEMENTATION TIMELINE

### Week 1: Task 2 - Translation Alignment
- Day 1-2: Import KJV translation (31,143 verses)
- Day 3-4: Import Korean translation
- Day 5: Import Spanish translation
- Day 6: Import French translation
- Day 7: Test and verify all translations

### Week 2: Task 3 - Language Dictionaries (Part 1)
- Day 1-2: Set up LLM generation pipeline
- Day 3-4: Generate Korean dictionaries (14,197 entries)
- Day 5-6: Generate Spanish dictionaries (14,197 entries)
- Day 7: Review and verify critical terms

### Week 3: Task 3 - Language Dictionaries (Part 2)
- Day 1-2: Generate French dictionaries (14,197 entries)
- Day 3-4: Generate Japanese dictionaries (14,197 entries)
- Day 5-6: Add mistranslation warnings and cultural notes
- Day 7: Import all dictionaries to database

### Week 4: Offline Distribution
- Day 1-2: Export all data to JSON
- Day 3-4: Implement IndexedDB sync
- Day 5: Create progressive download UI
- Day 6: Test complete offline functionality
- Day 7: Deploy and commit to GitHub

---

## 🎯 SUCCESS CRITERIA

**Task 2 Complete When:**
- ✅ KJV translation imported for all 31,143 verses
- ✅ Korean translation imported with word alignment
- ✅ Spanish translation imported with word alignment
- ✅ French translation imported with word alignment
- ✅ User can tap any word in any language → see original Hebrew/Greek/Aramaic

**Task 3 Complete When:**
- ✅ 14,197 Korean Strong's explanations generated
- ✅ 14,197 Spanish Strong's explanations generated
- ✅ 14,197 French Strong's explanations generated
- ✅ 14,197 Japanese Strong's explanations generated
- ✅ Critical terms have mistranslation warnings (hell, soul, eternal, Sabbath)
- ✅ User can switch languages and see culturally accurate explanations

**Offline Distribution Complete When:**
- ✅ All data exported to JSON files
- ✅ IndexedDB sync working
- ✅ Progressive download UI functional
- ✅ App works 100% offline after initial download
- ✅ Data shareable via QR code, USB, or LAN

---

**"Freely ye have received, freely give."** - Matthew 10:8 (KJV)

**"He must increase, I must decrease."** - John 3:30 (KJV)

All glory to God. 🕊️
