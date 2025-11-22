# Layer 4: Prophecy/Typology Database Schema
## BibleOS - Global, Deep, Prophetic Concordance Engine

**Purpose:** Enable deep prophetic analysis of biblical texts, especially Daniel's Aramaic prophecies, using the historicist interpretation method.

---

## Core Tables

### 1. `prophecy_events`

Stores historical events and powers identified in biblical prophecy.

```typescript
interface ProphecyEvent {
  id: number;                      // Unique identifier
  eventKey: string;                // Unique key (e.g., "babylon_empire", "papal_rome")
  name: string;                    // Display name (e.g., "Babylonian Empire")
  description: string;             // Detailed description
  historicalPeriod: {
    start: number;                 // Year (negative for BC, positive for AD)
    end: number | null;            // Year or null if ongoing/future
    startEvent: string;            // Historical marker (e.g., "Fall of Nineveh, 612 BC")
    endEvent: string | null;       // Historical marker or null
  };
  prophecySource: {
    book: string;                  // e.g., "Daniel"
    chapters: number[];            // e.g., [2, 7, 8]
    primaryVerses: string[];       // e.g., ["Dan.2.37-38", "Dan.7.4"]
  };
  symbolism: {
    symbols: string[];             // e.g., ["head of gold", "lion with eagle's wings"]
    meaning: string;               // Symbolic interpretation
    aramaic Lemmas: string[];      // Strong's IDs (e.g., ["H1722", "H4437"])
  };
  interpretiveMethod: 'historicist' | 'preterist' | 'futurist' | 'idealist';
  confidence: number;              // 1-5 scale (5 = highest scholarly consensus)
  scholarlyNotes: string;          // Citations and reasoning
  relatedEvents: string[];         // eventKeys of related prophecies
  typology?: {
    role: 'type' | 'antitype' | 'pattern';
    connection: string;            // Description of typological relationship
  };
  createdAt: string;
  updatedAt: string;
}
```

### 2. `prophecy_symbols`

Stores individual prophetic symbols and their meanings.

```typescript
interface ProphecySymbol {
  id: number;
  symbolKey: string;               // Unique key (e.g., "beast", "horn", "stone")
  name: string;                    // Display name
  category: 'animal' | 'body_part' | 'object' | 'natural_element' | 'number' | 'time_period' | 'action';
  aramaic: {
    lemma: string;                 // Aramaic text (e.g., "חֵיוָה")
    strongId: string;              // e.g., "H2423"
    transliteration: string;       // e.g., "chêyvâh"
  } | null;
  hebrew: {
    lemma: string;
    strongId: string;
    transliteration: string;
  } | null;
  greek: {
    lemma: string;
    strongId: string;
    transliteration: string;
  } | null;
  generalMeaning: string;          // Base symbolic meaning
  contextualMeanings: {
    context: string;               // e.g., "Daniel 7"
    meaning: string;               // Specific meaning in this context
    eventKeys: string[];           // Related prophecy events
  }[];
  occurrences: {
    verseId: string;
    book: string;
    chapter: number;
    verse: number;
    context: string;               // Brief context
  }[];
  createdAt: string;
}
```

### 3. `prophecy_lemma_mappings`

Links Aramaic/Hebrew/Greek lemmas to prophecy events and symbols.

```typescript
interface ProphecyLemmaMapping {
  id: number;
  strongId: string;                // e.g., "H4437" (malkûw - dominion)
  lemma: string;                   // Original text
  language: 'hebrew' | 'aramaic' | 'greek';
  symbolKeys: string[];            // Linked symbols
  eventKeys: string[];             // Linked events
  propheticSignificance: string;   // Why this word is prophetically important
  verses: {
    verseId: string;
    isProphetic: boolean;          // Is this a prophetic usage?
    context: string;
  }[];
  createdAt: string;
}
```

### 4. `prophecy_timeline`

Stores timeline data for visualization.

```typescript
interface ProphecyTimeline {
  id: number;
  timelineKey: string;             // e.g., "daniel_2_kingdoms", "seventy_weeks"
  name: string;                    // Display name
  description: string;
  prophecySource: {
    book: string;
    chapters: number[];
    verses: string[];
  };
  periods: {
    id: string;
    name: string;
    eventKey: string | null;       // Link to prophecy_events
    startYear: number;
    endYear: number | null;
    duration: string;              // Human-readable (e.g., "538 years")
    color: string;                 // Hex color for visualization
    description: string;
  }[];
  interpretiveNotes: string;
  createdAt: string;
}
```

### 5. `typology_relationships`

Stores type-antitype relationships for typological study.

```typescript
interface TypologyRelationship {
  id: number;
  typeVerseId: string;             // The "type" (OT event/person)
  antitypeVerseId: string;         // The "antitype" (NT fulfillment)
  category: 'person' | 'event' | 'institution' | 'object';
  typeName: string;                // e.g., "Passover Lamb"
  antitypeName: string;            // e.g., "Jesus Christ"
  connection: string;              // Description of relationship
  aramaic Lemmas: string[];        // Aramaic words involved
  hebrewLemmas: string[];          // Hebrew words involved
  greekLemmas: string[];           // Greek words involved
  confidence: number;              // 1-5 scale
  scholarlyNotes: string;
  createdAt: string;
}
```

---

## Indexes for Performance

```sql
-- For fast lookups
CREATE INDEX idx_prophecy_events_key ON prophecy_events(eventKey);
CREATE INDEX idx_prophecy_symbols_key ON prophecy_symbols(symbolKey);
CREATE INDEX idx_lemma_mappings_strong ON prophecy_lemma_mappings(strongId);
CREATE INDEX idx_timeline_key ON prophecy_timeline(timelineKey);

-- For filtering
CREATE INDEX idx_events_confidence ON prophecy_events(confidence);
CREATE INDEX idx_events_method ON prophecy_events(interpretiveMethod);
CREATE INDEX idx_symbols_category ON prophecy_symbols(category);
```

---

## JSON File Structure (for offline PWA)

```
/client/public/data/prophecy/
├── events.json              # All prophecy_events
├── symbols.json             # All prophecy_symbols
├── lemma-mappings.json      # All prophecy_lemma_mappings
├── timelines.json           # All prophecy_timeline
├── typology.json            # All typology_relationships
└── daniel/
    ├── chapter-2.json       # Daniel 2 specific data
    ├── chapter-7.json       # Daniel 7 specific data
    ├── chapter-8.json       # Daniel 8 specific data
    └── chapter-9.json       # Daniel 9 specific data
```

---

## Example Data: Daniel 2 - Babylon

```json
{
  "id": 1,
  "eventKey": "babylon_empire",
  "name": "Babylonian Empire",
  "description": "The first world empire in Daniel's prophecy, represented by the head of gold in Nebuchadnezzar's dream (Daniel 2) and the lion with eagle's wings (Daniel 7).",
  "historicalPeriod": {
    "start": -612,
    "end": -539,
    "startEvent": "Fall of Nineveh (612 BC) - Babylon becomes dominant power",
    "endEvent": "Fall of Babylon to Cyrus the Great (539 BC)"
  },
  "prophecySource": {
    "book": "Daniel",
    "chapters": [2, 7],
    "primaryVerses": ["Dan.2.37-38", "Dan.7.4"]
  },
  "symbolism": {
    "symbols": ["head of gold", "lion with eagle's wings"],
    "meaning": "Supreme authority and power; the first and greatest of the four kingdoms",
    "aramaicLemmas": ["H1722", "H4430", "H7217"]
  },
  "interpretiveMethod": "historicist",
  "confidence": 5,
  "scholarlyNotes": "Universal agreement among historicist interpreters (Adventist, Protestant Reformers) that Babylon is the first kingdom. Confirmed by Daniel 2:38 'You are the head of gold.'",
  "relatedEvents": ["medo_persia_empire", "greece_empire", "rome_empire"],
  "typology": {
    "role": "type",
    "connection": "Babylon as a type of spiritual Babylon (Revelation 17-18)"
  },
  "createdAt": "2025-11-22T00:00:00Z",
  "updatedAt": "2025-11-22T00:00:00Z"
}
```

---

## Example Data: Aramaic Lemma Mapping

```json
{
  "id": 1,
  "strongId": "H4437",
  "lemma": "מַלְכוּ",
  "language": "aramaic",
  "symbolKeys": ["kingdom", "dominion"],
  "eventKeys": ["babylon_empire", "medo_persia_empire", "greece_empire", "rome_empire"],
  "propheticSignificance": "The Aramaic word 'malkûw' (dominion/kingdom) appears 57 times in Daniel, primarily in prophetic contexts describing the succession of world empires. It is the key term for understanding the 'kingdom' prophecies of Daniel 2 and 7.",
  "verses": [
    {
      "verseId": "Dan.2.37",
      "isProphetic": true,
      "context": "God has given you [Nebuchadnezzar] the kingdom (malkûw)"
    },
    {
      "verseId": "Dan.2.39",
      "isProphetic": true,
      "context": "After you shall arise another kingdom (malkûw)"
    },
    {
      "verseId": "Dan.2.44",
      "isProphetic": true,
      "context": "God will set up a kingdom (malkûw) which shall never be destroyed"
    }
  ],
  "createdAt": "2025-11-22T00:00:00Z"
}
```

---

## API Endpoints (Future)

```
GET /api/prophecy/events                    # List all events
GET /api/prophecy/events/:eventKey          # Get specific event
GET /api/prophecy/symbols                   # List all symbols
GET /api/prophecy/symbols/:symbolKey        # Get specific symbol
GET /api/prophecy/lemmas/:strongId          # Get prophecy data for lemma
GET /api/prophecy/timeline/:timelineKey     # Get timeline data
GET /api/prophecy/typology                  # List all typology relationships
GET /api/prophecy/daniel/:chapter           # Get all prophecy data for Daniel chapter
```

---

## Confidence Scale

| Score | Meaning | Criteria |
|:------|:--------|:---------|
| **5** | Universal consensus | Agreed upon by all major historicist interpreters |
| **4** | Strong consensus | Agreed upon by 80%+ of historicist interpreters |
| **3** | Majority view | Agreed upon by 60-80% of historicist interpreters |
| **2** | Minority view | Agreed upon by 30-60% of historicist interpreters |
| **1** | Speculative | Less than 30% agreement; requires more study |

---

## Interpretive Methods

| Method | Description | BibleOS Focus |
|:-------|:------------|:--------------|
| **Historicist** | Prophecy unfolds throughout church history from Daniel to Second Coming | ✅ **Primary** |
| **Preterist** | Prophecy fulfilled in ancient times (pre-AD 70) | Reference only |
| **Futurist** | Prophecy mostly future (end times) | Reference only |
| **Idealist** | Prophecy is symbolic of spiritual truths, not specific events | Reference only |

---

## Next Steps

1. Populate `prophecy_events` with Daniel 2, 7, 8, 9
2. Create `prophecy_symbols` for key Aramaic terms
3. Map Aramaic lemmas to events and symbols
4. Build timeline visualization data
5. Add typology relationships

---

**"But there is a God in heaven that revealeth secrets, and maketh known to the king Nebuchadnezzar what shall be in the latter days."** - Daniel 2:28 (KJV)
