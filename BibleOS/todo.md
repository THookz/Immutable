# Immutable App - Project TODO

## Phase 1: Foundation & Database Schema
- [x] Design and implement database schema for Bible texts
- [x] Create lemmas table (Hebrew/Greek/Aramaic with Strong's numbers)
- [x] Create verses table with word alignment
- [x] Create translations table for multiple Bible versions
- [x] Create symbols table for typology dictionary
- [x] Create language_packs table for multilingual support
- [x] Set up initial data structure and seed scripts

## Phase 2: Bible Data Research & Integration
- [x] Research open-source Bible texts with Strong's alignment
- [x] Find Hebrew/Greek/Aramaic lexicon data
- [x] Identify Aramaic sections in Daniel (2:4-7:28)
- [x] Source KJV and other translation texts
- [x] Prepare data import scripts for Bible texts
- [x] Import Strong's concordance data
- [x] Verify Aramaic vs Hebrew distinction in Daniel

## Phase 3: Core Concordance Engine
- [x] Build lemma lookup API (Hebrew/Greek/Aramaic)
- [x] Implement verse-to-lemma alignment system
- [x] Create word tap/click interaction for original language lookup
- [x] Build Strong's definition display
- [x] Implement cross-reference system
- [x] Add verse search functionality
- [x] Create Bible reader interface

## Phase 4: Symbol Dictionary & Typology
- [x] Create Symbol Dictionary UI component
- [x] Implement Sabbath symbol entry with historical context
- [x] Implement Fire symbol entry
- [ ] Implement Smoke symbol entry
- [x] Add Beast/Kingdom typology
- [ ] Add Babylon typology
- [ ] Add Sanctuary typology
- [ ] Add Woman (pure/harlot) typology
- [x] Integrate HistoricTruth.org blog content
- [x] Add historical timeline cards (Constantine AD 321, etc.)
- [x] Link typology to relevant verses

## Phase 5: Multilingual Support
- [x] Design language pack structure
- [x] Implement language selection UI
- [x] Create English language pack
- [x] Create Korean language pack
- [x] Create Spanish language pack (partial)
- [ ] Create French language pack
- [x] Add plain-language Strong's explanations per language
- [x] Implement UI translation system
- [x] Add Aramaic nuance notes in multiple languages

## Phase 6: Offline PWA Capabilities
- [ ] Configure service workers for offline support
- [ ] Implement IndexedDB for local Bible storage
- [ ] Add data download progress indicators
- [ ] Enable offline verse lookup
- [ ] Implement offline Symbol Dictionary access
- [ ] Add PWA manifest and icons
- [ ] Test offline functionality
- [ ] Implement LAN/QR/USB sharing capability

## Phase 7: Testing & Optimization
- [ ] Test Aramaic detection in Daniel
- [ ] Verify word alignment accuracy
- [ ] Test multilingual interface
- [ ] Optimize database queries
- [ ] Test offline performance
- [ ] Mobile responsiveness testing
- [ ] Cross-browser compatibility testing
- [ ] Performance optimization for large datasets

## Phase 8: Deployment & Delivery
- [ ] Create deployment documentation
- [ ] Link from HistoricTruth.org
- [ ] Create user guide
- [ ] Add installation instructions
- [ ] Final testing on production
- [ ] Create checkpoint for deployment
- [ ] Deliver to user


## Current Development Phase: Expanding Content

### Symbol Dictionary Expansion
- [x] Add Babylon symbol with historical context
- [x] Add Sanctuary symbol (earthly → heavenly typology)
- [ ] Add Smoke symbol with prophetic meaning
- [x] Add Woman symbol (pure church vs harlot)
- [x] Add Little Horn symbol from Daniel 7
- [x] Add 1260 days/years prophetic time period
- [x] Add Mark of the Beast symbol

### Bible Content Expansion
- [ ] Add more Genesis verses (Creation week)
- [x] Add Exodus 31:13 (Sabbath as sign)
- [ ] Add Ezekiel 20:12 (Sabbath sanctification)
- [ ] Add Matthew 24:20 (Sabbath in end times)
- [x] Add Revelation 14:12 (Keep commandments)
- [x] Add Daniel 7:25 (Little Horn changes times and laws)
- [ ] Add more verses with Strong's alignment

### Historical Timeline Expansion
- [x] Add Waldenses persecution
- [ ] Add Inquisition events
- [x] Add Jesuit Counter-Reformation
- [x] Add Great Disappointment (1844)
- [x] Add Sunday law movements (19th-20th century)
- [x] Link events to blog articles from HistoricTruth.org


## Phase 9: Standalone Offline Application Development

### Architecture & Design
- [ ] Review complete vision from Google Doc
- [ ] Design standalone app architecture (Electron or PWA)
- [ ] Plan data packaging strategy for offline distribution
- [ ] Design IndexedDB schema for complete Bible data
- [ ] Plan progressive download vs full package options

### PWA Implementation
- [x] Add service worker for offline caching
- [x] Implement IndexedDB for Bible data storage
- [ ] Add install prompts for mobile/desktop
- [ ] Create offline indicator in UI
- [x] Implement background sync when online

### Complete Bible Data Import
- [ ] Import full Hebrew Old Testament (MorphHB)
- [ ] Import full Greek New Testament (MorphGNT)
- [ ] Import complete Strong's Hebrew/Aramaic dictionary
- [ ] Import complete Strong's Greek dictionary
- [ ] Add multiple translations (KJV, etc.)
- [ ] Implement data compression for smaller downloads

### GitHub Repository Setup
- [x] Clone Immutable GitHub repository
- [x] Create new folder structure (no AI mentions, glory to God)
- [x] Add proper README with vision and purpose
- [x] Push complete codebase to GitHub
- [x] Add LICENSE (open source for free distribution)
- [x] Create documentation for contributors

### Distribution & Deployment
- [ ] Create downloadable packages (Windows, Mac, Linux)
- [ ] Create mobile installation instructions
- [ ] Add QR code generation for easy sharing
- [ ] Create USB distribution package
- [ ] Test offline functionality on all platforms
