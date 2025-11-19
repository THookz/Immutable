# BibleOS - Universal Bible Concordance TODO

> **📖 For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md)**

## 🎯 MASTER TASK LIST

### ✅ **TASK 1: ORIGINAL TEXT INDEXING (Layer 1) - COMPLETE**

**This is the engine's backbone. Everything else depends on it.**

**Goal:** Every Hebrew/Aramaic (OT) and Greek (NT) lemma is indexed, searchable, and directly tied to Strong's numbers.

**Status: ✅ COMPLETE**

**Completed Items:**
- [x] **All 66 Bible books imported** (39 OT + 27 NT)
- [x] **20,057 verses** with word-level Strong's alignment
- [x] **14,197 Strong's entries** (8,674 Hebrew/Aramaic + 5,523 Greek)
- [x] **Masoretic Text (OT)**: Each word → lemma → Strong's number
- [x] **Greek NT (SBLGNT)**: Each word → lemma → Strong's number
- [x] **Morphology data**: Verb forms, noun genders, tenses included
- [x] **Aramaic distinction**: Daniel 2:4-7:28 properly marked as Aramaic (not Hebrew)
- [x] **All lemmas cross-linked** to every verse they appear in
- [x] **Tap-to-lookup functionality**: Click any word → see original lemma
- [x] **Strong's popup**: Shows Strong's number, literal meaning, transliteration, pronunciation
- [x] **Semantic range**: Definition field contains full semantic range
- [x] **All occurrences**: Database structure supports finding all occurrences of any lemma

**Output Format (Internal):**
```
Verse ID → Word ID → Lemma → Strong's → Morphology
```

**Example:**
```json
{
  "verseId": "GEN.2.2",
  "wordAlignment": [
    {
      "word": "וַיְכַל",
      "strongId": "H3615",
      "lemma": "כָּלָה",
      "position": 1,
      "morphology": "verb"
    },
    {
      "word": "אֱלֹהִים",
      "strongId": "H430",
      "lemma": "אֱלֹהִים",
      "position": 2,
      "morphology": "noun"
    }
  ]
}
```

**Data Sources:**
- ✅ MorphHB (Masoretic Hebrew Bible with morphology)
- ✅ MorphGNT SBLGNT (Greek New Testament with lemmas)
- ✅ OpenScriptures Strong's Hebrew/Aramaic Dictionary
- ✅ OpenScriptures Strong's Greek Dictionary

---

### 🔄 **TASK 2: TRANSLATION ALIGNMENT (Layer 2) - IN PROGRESS**

**This is what turns it into a multilingual engine, not just a Strong's clone.**

**Goal:** Every verse in every language has a one-to-one mapping between each translated word and the original lemma behind it.

**Status: 🔄 PARTIAL - Original texts complete, translations pending**

**Supported Languages (Planned):**
- [ ] English (KJV, NKJV, ESV)
- [ ] Korean (개역한글, 개역개정)
- [ ] Spanish (RVR1960, NVI)
- [ ] French (LSG, NEG1979)
- [ ] Japanese (口語訳, 新改訳)
- [ ] (Add more anytime as "language packs")

**How it works:**
Each verse has two coordinated layers:

**A. Translated text layer** (Surface-level text the user reads)
**B. Lemma alignment layer** (Hidden layer mapping: Translated word → lemma(s) → Strong's)

**Example:**
- User taps Spanish word "infierno"
- App shows original Greek: ᾅδης (hades), γέεννα (gehenna), or ταρταρόω (tartarus)
- Depending on verse context

**Completed:**
- [x] Database schema supports translation alignment
- [x] `translations` table with `wordAlignment` JSON field
- [x] Original text layer complete (Hebrew/Aramaic/Greek)
- [x] Word-to-lemma mapping for all 20,057 verses

**Pending:**
- [ ] Import KJV translation with word-to-lemma alignment
- [ ] Import Korean translation (개역한글) with alignment
- [ ] Import Spanish translation (RVR1960) with alignment
- [ ] Import French translation (LSG) with alignment
- [ ] Import Japanese translation with alignment
- [ ] Build translation comparison view
- [ ] Add translation selector in UI

**Functionality (When Complete):**
- Tap any word in any language
- Immediately see:
  1. The original term (Hebrew/Greek/Aramaic)
  2. Strong's number
  3. Literal definition
  4. Semantic range
  5. All other translations of the same word

**This removes centuries of doctrinal drift caused by translation choices.**

**Example Use Cases:**
- Spanish "infierno" → reveals hades (grave) vs gehenna (hell fire)
- Korean "영원한" (eternal) → reveals aiōn (age) vs aidios (everlasting)
- English "soul" → reveals nephesh (living being) vs psychē (life/breath)
- English "hell" → reveals sheol (grave), hades (unseen), gehenna (valley of fire)

---

### ⏳ **TASK 3: LANGUAGE-SPECIFIC DICTIONARIES (Layer 3) - PENDING**

**Goal:** Plain-language Strong's explanations in every target language with cultural context.

**Status: ⏳ PENDING - Database structure ready, content pending**

**Completed:**
- [x] Database schema (`language_dictionaries` table)
- [x] API endpoints for language dictionary lookup

**Pending:**
- [ ] Create Korean Strong's explanations (14,197 entries)
- [ ] Create Spanish Strong's explanations (14,197 entries)
- [ ] Create French Strong's explanations (14,197 entries)
- [ ] Create Japanese Strong's explanations (14,197 entries)
- [ ] Add cultural context notes
- [ ] Add mistranslation warnings
- [ ] Add Aramaic vs Hebrew nuance notes

**Example Entry:**
```json
{
  "strongId": "H7676",
  "language": "korean",
  "explanation": "שַׁבָּת (샤바트) - 안식일. 하나님께서 창조를 마치시고 쉬신 일곱째 날. 십계명의 네 번째 계명.",
  "usage": "창세기 2:2-3, 출애굽기 20:8-11, 레위기 23:3",
  "nuanceNote": "많은 번역이 '안식일'을 일요일로 바꾸었지만, 원어는 토요일(일곱째 날)을 의미합니다."
}
```

---

## 📊 Current Database Status

**Completed:**
- ✅ **20,057 verses** imported with word-level Strong's alignment
- ✅ **14,197 Strong's entries** (all corrected and verified)
- ✅ **8 prophetic symbols** with full typology
- ✅ **9 historical events** with prophetic significance
- ✅ **2 language packs** (English, Korean UI translations)

**Database Tables:**
1. ✅ `lemmas` - Hebrew/Greek/Aramaic words with Strong's numbers
2. ✅ `verses` - All Bible verses with word alignment
3. ✅ `strongs_dictionary` - 14,197 Strong's definitions (corrected)
4. ✅ `translations` - Ready for KJV, Korean, Spanish, etc.
5. ✅ `language_dictionaries` - Ready for multilingual Strong's explanations
6. ✅ `symbols` - Prophetic typology dictionary
7. ✅ `historical_events` - Timeline of prophetic fulfillment
8. ✅ `language_packs` - UI translations
9. ✅ `user_bookmarks` - User study notes (optional)

---

## 🎯 Immediate Next Steps

### To Complete Task 2 (Translation Alignment):
1. [ ] Source KJV text with word-level data
2. [ ] Create alignment script (KJV word → Hebrew/Greek lemma)
3. [ ] Import KJV with alignment for all 20,057 verses
4. [ ] Test translation comparison view
5. [ ] Repeat for Korean, Spanish, French, Japanese

### To Start Task 3 (Language Dictionaries):
1. [ ] Use LLM to generate Korean Strong's explanations
2. [ ] Add cultural context and mistranslation warnings
3. [ ] Import all 14,197 entries for Korean
4. [ ] Repeat for Spanish, French, Japanese

---

## 📚 Repository
**GitHub:** https://github.com/THookz/Immutable/tree/main/BibleOS

---

## 🎯 Vision

A free, offline-capable universal Bible concordance that bridges original languages (Hebrew/Greek/Aramaic) to modern translations in every language, revealing the true meaning of God's Word without translation bias.

**Four-Layer Architecture:**
1. ✅ **Original Text Indexing** - Hebrew/Greek/Aramaic lemmas → Strong's numbers (COMPLETE)
2. 🔄 **Translation Alignment** - Each verse word → mapped to original lemma (IN PROGRESS)
3. ⏳ **Language-Specific Dictionaries** - Plain-language explanations in Korean/Spanish/French/etc. (PENDING)
4. ✅ **Typology Layer** - Prophetic symbols and historical context (COMPLETE)

**"Freely ye have received, freely give."** - Matthew 10:8 (KJV)

**"He must increase, I must decrease."** - John 3:30 (KJV)
