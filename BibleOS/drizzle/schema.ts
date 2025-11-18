import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================
// IMMUTABLE APP - BIBLE CONCORDANCE SCHEMA
// ============================================

// LAYER 1: Original Text Indexing (Hebrew/Greek/Aramaic Lemmas)
export const lemmas = mysqlTable("lemmas", {
  id: int("id").autoincrement().primaryKey(),
  strongId: varchar("strong_id", { length: 16 }).notNull().unique(), // e.g., "H7676", "G4521", "H10778"
  language: mysqlEnum("language", ["hebrew", "greek", "aramaic"]).notNull(),
  lemma: varchar("lemma", { length: 100 }).notNull(), // Original script (שַׁבָּת, σάββατον)
  transliteration: varchar("transliteration", { length: 100 }), // "shabbat", "sabbaton"
  pronunciation: varchar("pronunciation", { length: 100 }), // "shab-bawth'"
  definition: text("definition").notNull(), // English definition from Strong's
  root: varchar("root", { length: 16 }), // Root Strong's ID if applicable
  morphology: varchar("morphology", { length: 100 }), // "noun feminine", "verb"
  hebrewComparison: text("hebrew_comparison"), // For Aramaic: how it differs from Hebrew
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Lemma = typeof lemmas.$inferSelect;
export type InsertLemma = typeof lemmas.$inferInsert;

// LAYER 2: Translation Alignment (Verses with word-to-lemma mapping)
export const verses = mysqlTable("verses", {
  id: int("id").autoincrement().primaryKey(),
  verseId: varchar("verse_id", { length: 32 }).notNull().unique(), // "GEN.2.2", "DAN.7.10"
  book: varchar("book", { length: 32 }).notNull(), // "Genesis", "Daniel"
  chapter: int("chapter").notNull(),
  verse: int("verse").notNull(),
  language: mysqlEnum("language", ["hebrew", "greek", "aramaic"]).notNull(),
  text: text("text").notNull(), // Original language text
  wordAlignment: text("word_alignment").notNull(), // JSON: [{word, strongId, position}]
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Verse = typeof verses.$inferSelect;
export type InsertVerse = typeof verses.$inferInsert;

// Translations table for multiple Bible versions
export const translations = mysqlTable("translations", {
  id: int("id").autoincrement().primaryKey(),
  verseId: varchar("verse_id", { length: 32 }).notNull(), // References verses.verseId
  translation: varchar("translation", { length: 16 }).notNull(), // "KJV", "NKJV", "ESV"
  language: varchar("language", { length: 16 }).notNull(), // "english", "korean", "spanish"
  text: text("text").notNull(), // Translated verse text
  wordAlignment: text("word_alignment"), // JSON: [{word, strongId, position}]
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Translation = typeof translations.$inferSelect;
export type InsertTranslation = typeof translations.$inferInsert;

// LAYER 3: Language-Specific Dictionaries
export const languageDictionaries = mysqlTable("language_dictionaries", {
  id: int("id").autoincrement().primaryKey(),
  strongId: varchar("strong_id", { length: 16 }).notNull(), // References lemmas.strongId
  language: varchar("language", { length: 16 }).notNull(), // "korean", "spanish", "french"
  explanation: text("explanation").notNull(), // Plain-language explanation in target language
  usage: text("usage"), // Usage notes in target language
  nuanceNote: text("nuance_note"), // Special notes about Aramaic vs Hebrew, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type LanguageDictionary = typeof languageDictionaries.$inferSelect;
export type InsertLanguageDictionary = typeof languageDictionaries.$inferInsert;

// LAYER 4: Typology & Symbol Dictionary
export const symbols = mysqlTable("symbols", {
  id: int("id").autoincrement().primaryKey(),
  symbolId: varchar("symbol_id", { length: 64 }).notNull().unique(), // "sabbath", "fire", "beast"
  name: varchar("name", { length: 100 }).notNull(), // "Sabbath", "Fire"
  originalTerms: text("original_terms").notNull(), // JSON: ["H7676", "G4521"]
  definition: text("definition").notNull(), // Core definition
  biblicalUsage: text("biblical_usage").notNull(), // JSON: [{context, verses, explanation}]
  misinterpretations: text("misinterpretations"), // JSON: ["common error 1", "error 2"]
  historicalContext: text("historical_context"), // JSON: [{event, date, significance}]
  typology: text("typology"), // JSON: {earthly, heavenly, prophetic}
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Symbol = typeof symbols.$inferSelect;
export type InsertSymbol = typeof symbols.$inferInsert;

// Historical events/timeline for context cards
export const historicalEvents = mysqlTable("historical_events", {
  id: int("id").autoincrement().primaryKey(),
  eventId: varchar("event_id", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  date: varchar("date", { length: 64 }).notNull(), // "AD 321", "1517"
  description: text("description").notNull(),
  significance: text("significance").notNull(),
  relatedSymbols: text("related_symbols"), // JSON: ["sabbath", "babylon"]
  sourceUrl: varchar("source_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type HistoricalEvent = typeof historicalEvents.$inferSelect;
export type InsertHistoricalEvent = typeof historicalEvents.$inferInsert;

// Language packs metadata
export const languagePacks = mysqlTable("language_packs", {
  id: int("id").autoincrement().primaryKey(),
  languageCode: varchar("language_code", { length: 16 }).notNull().unique(), // "en", "ko", "es", "fr"
  languageName: varchar("language_name", { length: 64 }).notNull(), // "English", "한국어"
  uiTranslations: text("ui_translations").notNull(), // JSON: {key: translation}
  isActive: int("is_active").default(1).notNull(), // 1 = active, 0 = inactive
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type LanguagePack = typeof languagePacks.$inferSelect;
export type InsertLanguagePack = typeof languagePacks.$inferInsert;

// User bookmarks and notes (optional feature)
export const userBookmarks = mysqlTable("user_bookmarks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(), // References users.id
  verseId: varchar("verse_id", { length: 32 }).notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type UserBookmark = typeof userBookmarks.$inferSelect;
export type InsertUserBookmark = typeof userBookmarks.$inferInsert;