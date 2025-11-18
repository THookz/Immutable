import { eq, and, like, inArray } from "drizzle-orm";
import { getDb } from "./db";
import {
  lemmas,
  verses,
  translations,
  symbols,
  languageDictionaries,
  historicalEvents,
  languagePacks,
  userBookmarks,
  type Lemma,
  type Verse,
  type Translation,
  type Symbol,
  type LanguageDictionary,
  type HistoricalEvent,
  type LanguagePack,
} from "../drizzle/schema";

// ============================================
// LEMMA QUERIES (Layer 1: Original Text Indexing)
// ============================================

export async function getLemmaByStrongId(strongId: string): Promise<Lemma | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const results = await db.select().from(lemmas).where(eq(lemmas.strongId, strongId)).limit(1);
  return results[0];
}

export async function searchLemmas(searchTerm: string, language?: "hebrew" | "greek" | "aramaic"): Promise<Lemma[]> {
  const db = await getDb();
  if (!db) return [];

  if (language) {
    return await db
      .select()
      .from(lemmas)
      .where(
        and(
          eq(lemmas.language, language),
          like(lemmas.lemma, `%${searchTerm}%`)
        )
      )
      .limit(50);
  } else {
    return await db
      .select()
      .from(lemmas)
      .where(like(lemmas.lemma, `%${searchTerm}%`))
      .limit(50);
  }
}

export async function insertLemma(lemma: typeof lemmas.$inferInsert): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(lemmas).values(lemma).onDuplicateKeyUpdate({
    set: {
      lemma: lemma.lemma,
      transliteration: lemma.transliteration,
      pronunciation: lemma.pronunciation,
      definition: lemma.definition,
      root: lemma.root,
      morphology: lemma.morphology,
      hebrewComparison: lemma.hebrewComparison,
    },
  });
}

// ============================================
// VERSE QUERIES (Layer 2: Translation Alignment)
// ============================================

export async function getVerseById(verseId: string): Promise<Verse | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const results = await db.select().from(verses).where(eq(verses.verseId, verseId)).limit(1);
  return results[0];
}

export async function getVersesByBook(book: string): Promise<Verse[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(verses).where(eq(verses.book, book));
}

export async function getVersesByBookChapter(book: string, chapter: number): Promise<Verse[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(verses)
    .where(and(eq(verses.book, book), eq(verses.chapter, chapter)))
    .orderBy(verses.verse);
}

export async function insertVerse(verse: typeof verses.$inferInsert): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(verses).values(verse).onDuplicateKeyUpdate({
    set: {
      text: verse.text,
      wordAlignment: verse.wordAlignment,
    },
  });
}

// ============================================
// TRANSLATION QUERIES
// ============================================

export async function getTranslation(
  verseId: string,
  translation: string,
  language: string
): Promise<Translation | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const results = await db
    .select()
    .from(translations)
    .where(
      and(
        eq(translations.verseId, verseId),
        eq(translations.translation, translation),
        eq(translations.language, language)
      )
    )
    .limit(1);

  return results[0];
}

export async function getTranslationsByVerse(verseId: string): Promise<Translation[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(translations).where(eq(translations.verseId, verseId));
}

export async function insertTranslation(translation: typeof translations.$inferInsert): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(translations).values(translation);
}

// ============================================
// LANGUAGE DICTIONARY QUERIES (Layer 3)
// ============================================

export async function getLanguageDictionary(
  strongId: string,
  language: string
): Promise<LanguageDictionary | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const results = await db
    .select()
    .from(languageDictionaries)
    .where(
      and(
        eq(languageDictionaries.strongId, strongId),
        eq(languageDictionaries.language, language)
      )
    )
    .limit(1);

  return results[0];
}

export async function insertLanguageDictionary(
  dict: typeof languageDictionaries.$inferInsert
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(languageDictionaries).values(dict);
}

// ============================================
// SYMBOL DICTIONARY QUERIES (Layer 4: Typology)
// ============================================

export async function getSymbolById(symbolId: string): Promise<Symbol | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const results = await db.select().from(symbols).where(eq(symbols.symbolId, symbolId)).limit(1);
  return results[0];
}

export async function getAllSymbols(): Promise<Symbol[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(symbols);
}

export async function searchSymbols(searchTerm: string): Promise<Symbol[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(symbols)
    .where(like(symbols.name, `%${searchTerm}%`))
    .limit(20);
}

export async function insertSymbol(symbol: typeof symbols.$inferInsert): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(symbols).values(symbol).onDuplicateKeyUpdate({
    set: {
      name: symbol.name,
      originalTerms: symbol.originalTerms,
      definition: symbol.definition,
      biblicalUsage: symbol.biblicalUsage,
      misinterpretations: symbol.misinterpretations,
      historicalContext: symbol.historicalContext,
      typology: symbol.typology,
    },
  });
}

// ============================================
// HISTORICAL EVENTS QUERIES
// ============================================

export async function getHistoricalEventById(eventId: string): Promise<HistoricalEvent | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const results = await db
    .select()
    .from(historicalEvents)
    .where(eq(historicalEvents.eventId, eventId))
    .limit(1);

  return results[0];
}

export async function getHistoricalEventsBySymbol(symbolId: string): Promise<HistoricalEvent[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(historicalEvents)
    .where(like(historicalEvents.relatedSymbols, `%${symbolId}%`));
}

export async function getAllHistoricalEvents(): Promise<HistoricalEvent[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(historicalEvents);
}

export async function insertHistoricalEvent(event: typeof historicalEvents.$inferInsert): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(historicalEvents).values(event).onDuplicateKeyUpdate({
    set: {
      name: event.name,
      date: event.date,
      description: event.description,
      significance: event.significance,
      relatedSymbols: event.relatedSymbols,
      sourceUrl: event.sourceUrl,
    },
  });
}

// ============================================
// LANGUAGE PACK QUERIES
// ============================================

export async function getLanguagePack(languageCode: string): Promise<LanguagePack | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const results = await db
    .select()
    .from(languagePacks)
    .where(eq(languagePacks.languageCode, languageCode))
    .limit(1);

  return results[0];
}

export async function getAllLanguagePacks(): Promise<LanguagePack[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(languagePacks).where(eq(languagePacks.isActive, 1));
}

export async function insertLanguagePack(pack: typeof languagePacks.$inferInsert): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(languagePacks).values(pack).onDuplicateKeyUpdate({
    set: {
      languageName: pack.languageName,
      uiTranslations: pack.uiTranslations,
      isActive: pack.isActive,
    },
  });
}

// ============================================
// USER BOOKMARKS (Optional Feature)
// ============================================

export async function getUserBookmarks(userId: number): Promise<typeof userBookmarks.$inferSelect[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(userBookmarks).where(eq(userBookmarks.userId, userId));
}

export async function addUserBookmark(bookmark: typeof userBookmarks.$inferInsert): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(userBookmarks).values(bookmark);
}

export async function deleteUserBookmark(bookmarkId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.delete(userBookmarks).where(eq(userBookmarks.id, bookmarkId));
}
