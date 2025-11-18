# BibleOS - Universal Bible Concordance

> *"Freely ye have received, freely give."* - Matthew 10:8 (KJV)

## Vision

BibleOS is a universal concordance bridge that connects the original languages of Scripture (Hebrew, Greek, and Aramaic) to modern translations in every language. This tool exists to help God's people understand His Word more deeply, revealing the prophetic patterns and typology woven throughout Scripture.

### Core Purpose

To provide **free, offline-capable** access to:
- Original language texts with Strong's concordance
- Word-level alignment between original languages and translations
- Multilingual explanations in plain language (Korean, Spanish, French, etc.)
- Prophetic typology and historical context
- Symbol dictionary revealing biblical patterns

## Features

### Four-Layer Concordance Architecture

1. **Original Text Indexing**
   - Hebrew Old Testament (including Aramaic sections in Daniel 2:4-7:28)
   - Greek New Testament
   - Strong's numbers for every word

2. **Translation Alignment**
   - Each verse matched to original language lemmas
   - Word-level clickable interface
   - Multiple translations (KJV, and more)

3. **Language-Specific Dictionaries**
   - Plain-language Strong's explanations
   - Available in multiple languages
   - Expandable language pack system

4. **Typology Layer**
   - Prophetic symbols (Sabbath, Beast, Babylon, Sanctuary, etc.)
   - Historical events with prophetic significance
   - Earthly → Heavenly → Prophetic connections

### Offline Capability

BibleOS works **completely offline** after initial download:
- Progressive Web App (PWA) installable on any device
- IndexedDB storage for complete Bible data
- Shareable via LAN, QR code, or USB drive
- No internet required for study

## Technology Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS 4
- **Backend**: Express + tRPC for type-safe API
- **Database**: MySQL/TiDB (with Drizzle ORM)
- **Offline Storage**: IndexedDB + Service Workers
- **UI Components**: shadcn/ui

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- pnpm package manager

### Installation

```bash
# Install dependencies
pnpm install

# Set up database
pnpm db:push

# Seed sample data
pnpm exec tsx scripts/seed-sample-data.ts
pnpm exec tsx scripts/seed-expanded-data.ts

# Start development server
pnpm dev
```

### Building for Production

```bash
# Build the application
pnpm build

# The built files will be in the dist/ directory
```

## Data Sources

BibleOS uses open-source biblical texts:

- **Hebrew Old Testament**: [OpenScriptures MorphHB](https://github.com/openscriptures/morphhb) (CC BY 4.0)
- **Greek New Testament**: [MorphGNT SBLGNT](https://github.com/morphgnt/sblgnt) (CC BY-SA 3.0)
- **Strong's Concordance**: [OpenScriptures Strong's](https://github.com/openscriptures/strongs) (CC BY 4.0)
- **Historical Content**: [HistoricTruth.org](https://historictruth.org)

## Project Structure

```
BibleOS/
├── client/           # Frontend React application
│   ├── src/
│   │   ├── pages/    # Page components (Home, BibleReader, SymbolDictionary)
│   │   ├── components/ # Reusable UI components
│   │   └── lib/      # tRPC client and utilities
├── server/           # Backend Express + tRPC server
│   ├── routers.ts    # API routes
│   ├── db.ts         # Database helpers
│   └── bible-db.ts   # Bible-specific database functions
├── drizzle/          # Database schema and migrations
│   └── schema.ts     # Complete database schema
├── scripts/          # Data seeding scripts
└── shared/           # Shared types and constants
```

## Database Schema

### Core Tables

- **lemmas**: Hebrew/Greek/Aramaic words with Strong's numbers
- **verses**: Original language verse texts with word alignment
- **translations**: Modern language translations (KJV, etc.)
- **symbols**: Prophetic symbol dictionary entries
- **historical_events**: Key events with prophetic significance
- **language_packs**: Multilingual UI translations
- **language_dictionaries**: Language-specific Strong's explanations

## Contributing

We welcome contributions that advance the mission of making God's Word accessible to all. Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

### Areas for Contribution

- **Bible Data**: Import complete Old Testament and New Testament texts
- **Translations**: Add more Bible versions (NIV, ESV, NASB, etc.)
- **Languages**: Create language packs (Korean, Spanish, French, Japanese, etc.)
- **Symbols**: Expand the typology dictionary with more prophetic symbols
- **Historical Events**: Add more events from church history
- **Documentation**: Improve user guides and developer docs

## License

- **Code**: MIT License - see [LICENSE](../LICENSE)
- **Content**: CC BY 4.0 - see [CONTENT_LICENSE.md](../CONTENT_LICENSE.md)

## Acknowledgments

This project stands on the shoulders of:
- The open-source biblical text communities (OpenScriptures, MorphGNT)
- The Protestant Reformers who gave their lives for Scripture in the common tongue
- The faithful Waldenses, Albigenses, and others who preserved God's Word
- All who have labored to make Scripture accessible to every nation

## Mission Statement

> *"And this gospel of the kingdom shall be preached in all the world for a witness unto all nations; and then shall the end come."* - Matthew 24:14 (KJV)

BibleOS exists to equip God's people with the tools to understand His Word deeply, in their own language, anywhere in the world—even without internet access. May this tool be used to advance His kingdom and prepare hearts for His soon return.

**Soli Deo Gloria** - To God Alone Be the Glory

---

For questions or support, please open an issue on GitHub or visit [HistoricTruth.org](https://historictruth.org).
