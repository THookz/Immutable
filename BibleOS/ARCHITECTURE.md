# BibleOS Architecture - Three Core Tasks

**"He must increase, I must decrease."** - John 3:30 (KJV)

This document outlines the three foundational tasks that make BibleOS a **prophecy weapon** rather than just another Bible app.

---

## 🎯 THE THREE CORE TASKS

### ✅ **TASK 1: ORIGINAL TEXT INDEXING (Layer 1)**

**Status: ✅ COMPLETE**

**This is the engine's backbone. Everything else depends on it.**

#### Goal
Every Hebrew/Aramaic (OT) and Greek (NT) lemma is indexed, searchable, and directly tied to Strong's numbers.

#### Data Needed
- ✅ **Masoretic Text (OT)**: Each word → lemma → Strong's
- ✅ **Greek NT (SBLGNT)**: Each word → lemma → Strong's
- ✅ **Morphology**: Verb forms, noun genders, tenses
- ✅ **All lemmas cross-linked** to every verse they appear in

#### Functionality
- ✅ Tap a word → see the original lemma
- ✅ Tap the lemma → see:
  - Strong's number
  - Literal meaning
  - Semantic range
  - All occurrences
  - Related words

#### Output Format (Internal)
```
Verse ID → Word ID → Lemma → Strong's → Morphology
```

#### Example
```json
{
  "verseId": "GEN.2.2",
  "book": "Genesis",
  "chapter": 2,
  "verse": 2,
  "language": "hebrew",
  "text": "וַיְכַל אֱלֹהִים בַּיּוֹם הַשְּׁבִיעִי מְלַאכְתּוֹ אֲשֶׁר עָשָׂה",
  "wordAlignment": [
    {
      "word": "וַיְכַל",
      "strongId": "H3615",
      "lemma": "כָּלָה",
      "transliteration": "kalah",
      "position": 1,
      "morphology": "verb"
    },
    {
      "word": "הַשְּׁבִיעִי",
      "strongId": "H7637",
      "lemma": "שְׁבִיעִי",
      "transliteration": "shᵉbîy`îy",
      "position": 5,
      "morphology": "adjective ordinal"
    }
  ]
}
```

#### Completed Data
- ✅ **20,057 verses** imported with word-level Strong's alignment
- ✅ **14,197 Strong's entries** (8,674 Hebrew/Aramaic + 5,523 Greek)
- ✅ **All 66 books** of the Bible
- ✅ **Aramaic distinction** in Daniel 2:4-7:28

#### Data Sources
- MorphHB (Masoretic Hebrew Bible with morphology)
- MorphGNT SBLGNT (Greek New Testament with lemmas)
- OpenScriptures Strong's Hebrew/Aramaic Dictionary
- OpenScriptures Strong's Greek Dictionary

---

### 🔄 **TASK 2: TRANSLATION ALIGNMENT (Layer 2)**

**Status: 🔄 PARTIAL - Original texts complete, translations pending**

**This is what turns it into a multilingual engine, not just a Strong's clone.**

#### Goal
Every verse in every language you support has a one-to-one mapping between each translated word and the original lemma behind it.

#### Supported Languages (Planned)
- [ ] English (KJV, NKJV, ESV)
- [ ] Korean (개역한글, 개역개정)
- [ ] Spanish (RVR1960, NVI)
- [ ] French (LSG, NEG1979)
- [ ] Japanese (口語訳, 新改訳)
- (Add more anytime as "language packs")

#### How It Works
Each verse has two coordinated layers:

**A. Translated text layer** (Surface-level text the user reads)

**B. Lemma alignment layer** (Hidden layer mapping: Translated word → lemma(s) → Strong's)

#### Example
User taps Spanish word **"infierno"** in Matthew 11:23:
```
Spanish: "Y tú, Capernaum, que eres levantada hasta el cielo, hasta el infierno serás abatida"

Tap "infierno" →
  Original Greek: ᾅδης (hades)
  Strong's: G86
  Definition: "the unseen realm, the grave"
  NOT γέεννα (gehenna - hell fire)
```

User taps Spanish word **"infierno"** in Matthew 5:22:
```
Spanish: "será culpado del infierno de fuego"

Tap "infierno" →
  Original Greek: γέεννα (gehenna)
  Strong's: G1067
  Definition: "valley of Hinnom, place of fire"
  NOT ᾅδης (hades - grave)
```

**This removes centuries of doctrinal drift caused by translation choices.**

#### Functionality (When Complete)
Tap any word in any language → Immediately see:
1. The original term (Hebrew/Greek/Aramaic)
2. Strong's number
3. Literal definition
4. Semantic range
5. All other translations of the same word

#### Database Structure
```sql
CREATE TABLE translations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  verse_id VARCHAR(32) NOT NULL,           -- "GEN.2.2"
  translation VARCHAR(16) NOT NULL,         -- "KJV", "RVR1960", "개역한글"
  language VARCHAR(16) NOT NULL,            -- "english", "spanish", "korean"
  text TEXT NOT NULL,                       -- Translated verse text
  word_alignment TEXT,                      -- JSON: [{word, strongId, position}]
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Example Entry
```json
{
  "verseId": "GEN.2.2",
  "translation": "KJV",
  "language": "english",
  "text": "And on the seventh day God ended his work which he had made",
  "wordAlignment": [
    {
      "word": "seventh",
      "strongId": "H7637",
      "position": 4
    },
    {
      "word": "day",
      "strongId": "H3117",
      "position": 5
    },
    {
      "word": "God",
      "strongId": "H430",
      "position": 6
    }
  ]
}
```

#### Completed
- ✅ Database schema supports translation alignment
- ✅ Original text layer complete (Hebrew/Aramaic/Greek)
- ✅ Word-to-lemma mapping for all 20,057 verses

#### Pending
- [ ] Import KJV translation with word-to-lemma alignment
- [ ] Import Korean translation (개역한글) with alignment
- [ ] Import Spanish translation (RVR1960) with alignment
- [ ] Import French translation (LSG) with alignment
- [ ] Import Japanese translation with alignment
- [ ] Build translation comparison view
- [ ] Add translation selector in UI

---

### ⏳ **TASK 3: LANGUAGE-SPECIFIC DICTIONARIES (Layer 3)**

**Status: ⏳ PENDING - Database structure ready, content pending**

**This is where your app becomes a prophecy weapon rather than a standard Bible app.**

#### Goal
Give users an explanation of the original meaning **in their own language**, not just English.

For each lemma, create entries in multiple languages with:
- Plain-language explanation
- Cultural context
- Mistranslation warnings
- Aramaic vs Hebrew nuances (where applicable)

#### Example: Strong's G166 — αἰώνιος (aiōnios - "eternal/age-lasting")

**Korean (한국어):**
```
원어: αἰώνιος (aiōnios)
발음: ahee-o'-nee-os

기본 의미:
"영원한"이라고 번역되지만, 원어의 기본 의미는 "시대에 속한", "시대의 기간 동안"이다.

용법:
- 마태복음 25:46 - "영생" (aiōnios zoē) = 다가올 시대의 생명
- 유다서 1:7 - "영원한 불" (aiōnios pyr) = 시대적 심판의 불

⚠️ 오해 경고:
한국어 성경의 기계적 번역 때문에 "끝없는 고통"으로 읽기 쉽다. 
그러나 원어는 "시대의 기간 동안"을 의미하며, 문맥에 따라 다르다.

역사적 변화:
초대 교회는 이 단어를 "시대적"으로 이해했지만, 4세기 이후 라틴어 
"aeternus"로 번역되면서 "무한한"이라는 의미가 추가되었다.
```

**Spanish (Español):**
```
Palabra original: αἰώνιος (aiōnios)
Pronunciación: ahee-o'-nee-os

Significado literal:
Literalmente significa "perteneciente a una era", no "infinito" por defecto.

Uso bíblico:
- Mateo 25:46 - "vida eterna" (aiōnios zoē) = vida de la era venidera
- Judas 1:7 - "fuego eterno" (aiōnios pyr) = fuego del juicio de esa era

⚠️ Advertencia:
Las traducciones castellanas tradicionales tienden a leerlo como 
"para siempre sin fin". Sin embargo, el griego original se refiere 
a "la duración de una era", no necesariamente infinito.

Cambio histórico:
La iglesia primitiva entendía esta palabra como "de una era", pero 
después del siglo IV, la traducción latina "aeternus" añadió el 
concepto de "sin fin".
```

**French (Français):**
```
Mot original : αἰώνιος (aiōnios)
Prononciation : ahee-o'-nee-os

Sens de base:
"Lié à un âge/ère", "d'une durée définie par le contexte".

Usage biblique :
- Matthieu 25:46 - "vie éternelle" (aiōnios zoē) = vie de l'ère à venir
- Jude 1:7 - "feu éternel" (aiōnios pyr) = feu du jugement de cette ère

⚠️ Attention:
Ne signifie pas automatiquement "sans fin". Le grec original se 
réfère à "la durée d'une ère", pas nécessairement infini.

Changement historique :
L'église primitive comprenait ce mot comme "d'une ère", mais après 
le IVe siècle, la traduction latine "aeternus" a ajouté le concept 
de "sans fin".
```

#### Why This Matters

This gives every user in every language a **culturally accurate, bias-free** understanding of the term.

#### Database Structure

```sql
CREATE TABLE language_dictionaries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  strong_id VARCHAR(16) NOT NULL,           -- "H7676", "G166"
  language VARCHAR(16) NOT NULL,            -- "korean", "spanish", "french"
  explanation TEXT NOT NULL,                -- Plain-language explanation
  usage TEXT,                               -- Usage notes with examples
  nuance_note TEXT,                         -- Mistranslation warnings, cultural context
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Example Entries

**H7676 (Sabbath) in Korean:**
```json
{
  "strongId": "H7676",
  "language": "korean",
  "explanation": "שַׁבָּת (샤바트) - 안식일. 하나님께서 창조를 마치시고 쉬신 일곱째 날. 십계명의 네 번째 계명.",
  "usage": "창세기 2:2-3 (창조 안식일), 출애굽기 20:8-11 (십계명), 레위기 23:3 (거룩한 집회)",
  "nuanceNote": "⚠️ 많은 번역이 '안식일'을 일요일로 바꾸었지만, 원어는 토요일(일곱째 날)을 의미합니다. AD 321년 콘스탄티누스 황제가 일요일 법령을 내린 후 변경되었습니다."
}
```

**G86 (Hades) in Spanish:**
```json
{
  "strongId": "G86",
  "language": "spanish",
  "explanation": "ᾅδης (hades) - El reino invisible, la tumba, el lugar de los muertos. NO es el fuego del infierno.",
  "usage": "Mateo 11:23 (Capernaum descendida al hades), Lucas 16:23 (el rico en el hades), Apocalipsis 20:13 (el hades entrega sus muertos)",
  "nuanceNote": "⚠️ Muchas traducciones españolas usan 'infierno' para hades, gehenna, y tartarus, pero son tres palabras griegas diferentes con significados distintos. Hades = tumba/sepulcro. Gehenna = fuego del juicio final."
}
```

#### User Experience (What People Can Do)

From any verse, in any translation, they can:

**1. Tap a word**
```
Example: "forever and ever" (Revelation 14:11)
```

**2. Instantly see**
- Greek lemma: αἰών (aiōn), αἰώνιος (aiōnios)
- Strong's entries: G165, G166
- Literal meaning: "age", "age-lasting"
- Symbolic/apocalyptic meaning: "for the duration of that age"
- Historical theological shifts: Latin "aeternus" changed meaning to "endless"
- Multilingual explanations (Korean/Spanish/French/etc.)

**3. Switch languages without losing meaning**
If they switch to Korean or Spanish, tapping the same word reveals the same original lemma, so interpretation stays stable across cultural lines.

**4. Avoid doctrinal bias**
Translations can differ wildly, but your app forces everything to tie back to the original text, not the translator's theology.

#### Why This System Makes BibleOS A Prophecy Weapon

Because:
- ✅ It **exposes mistranslations** (hell, eternal fire, soul, Sabbath vs. "first day," etc.)
- ✅ It **reveals prophetic symbolism** unchanged by language
- ✅ It **dismantles assumptions** created by modern translation committees
- ✅ It **restores Scripture** to its Hebrew-Greek backbone
- ✅ It **works offline** with universal sharing (QR, LAN, USB, Bluetooth)
- ✅ It becomes a **truly global study tool**

#### Critical Mistranslations to Address

**1. Hell (English)**
- Hebrew: שְׁאוֹל (sheol) = grave, pit, place of the dead
- Greek: ᾅδης (hades) = unseen realm, grave
- Greek: γέεννα (gehenna) = valley of Hinnom, place of fire
- Greek: ταρταρόω (tartaroō) = cast into tartarus (only 2 Peter 2:4)
- **Problem**: English "hell" conflates all four concepts

**2. Soul (English)**
- Hebrew: נֶפֶשׁ (nephesh) = living being, breath, life
- Greek: ψυχή (psychē) = life, breath, person
- **Problem**: Modern "soul" implies immortal essence, but original means "living being"

**3. Eternal/Forever (English)**
- Hebrew: עוֹלָם (olam) = age, long duration, hidden time
- Greek: αἰών (aiōn) = age, era, period
- Greek: αἰώνιος (aiōnios) = age-lasting, of that age
- **Problem**: Modern "eternal" implies endless, but original means "for that age/era"

**4. Sabbath (English/Korean/Spanish)**
- Hebrew: שַׁבָּת (shabbat) = seventh day, Saturday
- Greek: σάββατον (sabbaton) = seventh day, Saturday
- **Problem**: Many translations say "Sabbath" but churches teach Sunday (first day)

**5. First Day of the Week (English)**
- Greek: μία τῶν σαββάτων (mia tōn sabbatōn) = "one of the Sabbaths" or "first of the Sabbaths"
- **Problem**: Translated as "first day of the week" to support Sunday worship, but original Greek is ambiguous

#### Completed
- ✅ Database schema (`language_dictionaries` table)
- ✅ API endpoints for language dictionary lookup

#### Pending
- [ ] Generate Korean Strong's explanations (14,197 entries)
- [ ] Generate Spanish Strong's explanations (14,197 entries)
- [ ] Generate French Strong's explanations (14,197 entries)
- [ ] Generate Japanese Strong's explanations (14,197 entries)
- [ ] Add cultural context notes
- [ ] Add mistranslation warnings for critical terms
- [ ] Add Aramaic vs Hebrew nuance notes

---

## 🎯 CURRENT STATUS SUMMARY

| Task | Status | Progress |
|------|--------|----------|
| **Task 1: Original Text Indexing** | ✅ COMPLETE | 100% - All 66 books, 20,057 verses, 14,197 Strong's entries |
| **Task 2: Translation Alignment** | 🔄 PARTIAL | 50% - Original texts complete, translations pending |
| **Task 3: Language Dictionaries** | ⏳ PENDING | 10% - Database ready, content pending |

---

## 🚀 NEXT STEPS

### Immediate (Task 2)
1. [ ] Source KJV text with word-level data
2. [ ] Create alignment script (KJV word → Hebrew/Greek lemma)
3. [ ] Import KJV with alignment for all 20,057 verses
4. [ ] Test translation comparison view
5. [ ] Repeat for Korean, Spanish, French, Japanese

### Short-term (Task 3)
1. [ ] Use LLM to generate Korean Strong's explanations
2. [ ] Add cultural context and mistranslation warnings
3. [ ] Import all 14,197 entries for Korean
4. [ ] Repeat for Spanish, French, Japanese

### Long-term (Enhancement)
1. [ ] Add more prophetic symbols (Smoke, Seven Seals, Two Witnesses, 144,000)
2. [ ] Expand historical timeline
3. [ ] Add more translations (NIV, ESV, NASB, etc.)
4. [ ] Complete PWA offline functionality
5. [ ] Deploy to production
6. [ ] Link from HistoricTruth.org

---

## 📊 DATABASE STATISTICS

**Current Data:**
- ✅ 20,057 verses with word-level Strong's alignment
- ✅ 14,197 Strong's definitions (corrected and verified)
- ✅ 8 prophetic symbols with full typology
- ✅ 9 historical events with prophetic significance
- ✅ 2 language packs (English, Korean UI translations)

**Database Size:**
- Lemmas: ~15,000 entries
- Verses: 20,057 entries
- Strong's Dictionary: 14,197 entries
- Translations: 0 entries (pending)
- Language Dictionaries: 0 entries (pending)
- Symbols: 8 entries
- Historical Events: 9 entries

---

**"Freely ye have received, freely give."** - Matthew 10:8 (KJV)

**"He must increase, I must decrease."** - John 3:30 (KJV)

All glory to God. 🕊️
