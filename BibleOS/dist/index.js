var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
var users, lemmas, verses, translations, languageDictionaries, symbols, historicalEvents, languagePacks, userBookmarks;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
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
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    lemmas = mysqlTable("lemmas", {
      id: int("id").autoincrement().primaryKey(),
      strongId: varchar("strong_id", { length: 16 }).notNull().unique(),
      // e.g., "H7676", "G4521", "H10778"
      language: mysqlEnum("language", ["hebrew", "greek", "aramaic"]).notNull(),
      lemma: varchar("lemma", { length: 100 }).notNull(),
      // Original script (שַׁבָּת, σάββατον)
      transliteration: varchar("transliteration", { length: 100 }),
      // "shabbat", "sabbaton"
      pronunciation: varchar("pronunciation", { length: 100 }),
      // "shab-bawth'"
      definition: text("definition").notNull(),
      // English definition from Strong's
      root: varchar("root", { length: 16 }),
      // Root Strong's ID if applicable
      morphology: varchar("morphology", { length: 100 }),
      // "noun feminine", "verb"
      hebrewComparison: text("hebrew_comparison"),
      // For Aramaic: how it differs from Hebrew
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    verses = mysqlTable("verses", {
      id: int("id").autoincrement().primaryKey(),
      verseId: varchar("verse_id", { length: 32 }).notNull().unique(),
      // "GEN.2.2", "DAN.7.10"
      book: varchar("book", { length: 32 }).notNull(),
      // "Genesis", "Daniel"
      chapter: int("chapter").notNull(),
      verse: int("verse").notNull(),
      language: mysqlEnum("language", ["hebrew", "greek", "aramaic"]).notNull(),
      text: text("text").notNull(),
      // Original language text
      wordAlignment: text("word_alignment").notNull(),
      // JSON: [{word, strongId, position}]
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    translations = mysqlTable("translations", {
      id: int("id").autoincrement().primaryKey(),
      verseId: varchar("verse_id", { length: 32 }).notNull(),
      // References verses.verseId
      translation: varchar("translation", { length: 16 }).notNull(),
      // "KJV", "NKJV", "ESV"
      language: varchar("language", { length: 16 }).notNull(),
      // "english", "korean", "spanish"
      text: text("text").notNull(),
      // Translated verse text
      wordAlignment: text("word_alignment"),
      // JSON: [{word, strongId, position}]
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    languageDictionaries = mysqlTable("language_dictionaries", {
      id: int("id").autoincrement().primaryKey(),
      strongId: varchar("strong_id", { length: 16 }).notNull(),
      // References lemmas.strongId
      language: varchar("language", { length: 16 }).notNull(),
      // "korean", "spanish", "french"
      explanation: text("explanation").notNull(),
      // Plain-language explanation in target language
      usage: text("usage"),
      // Usage notes in target language
      nuanceNote: text("nuance_note"),
      // Special notes about Aramaic vs Hebrew, etc.
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    symbols = mysqlTable("symbols", {
      id: int("id").autoincrement().primaryKey(),
      symbolId: varchar("symbol_id", { length: 64 }).notNull().unique(),
      // "sabbath", "fire", "beast"
      name: varchar("name", { length: 100 }).notNull(),
      // "Sabbath", "Fire"
      originalTerms: text("original_terms").notNull(),
      // JSON: ["H7676", "G4521"]
      definition: text("definition").notNull(),
      // Core definition
      biblicalUsage: text("biblical_usage").notNull(),
      // JSON: [{context, verses, explanation}]
      misinterpretations: text("misinterpretations"),
      // JSON: ["common error 1", "error 2"]
      historicalContext: text("historical_context"),
      // JSON: [{event, date, significance}]
      typology: text("typology"),
      // JSON: {earthly, heavenly, prophetic}
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
    });
    historicalEvents = mysqlTable("historical_events", {
      id: int("id").autoincrement().primaryKey(),
      eventId: varchar("event_id", { length: 64 }).notNull().unique(),
      name: varchar("name", { length: 200 }).notNull(),
      date: varchar("date", { length: 64 }).notNull(),
      // "AD 321", "1517"
      description: text("description").notNull(),
      significance: text("significance").notNull(),
      relatedSymbols: text("related_symbols"),
      // JSON: ["sabbath", "babylon"]
      sourceUrl: varchar("source_url", { length: 500 }),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    languagePacks = mysqlTable("language_packs", {
      id: int("id").autoincrement().primaryKey(),
      languageCode: varchar("language_code", { length: 16 }).notNull().unique(),
      // "en", "ko", "es", "fr"
      languageName: varchar("language_name", { length: 64 }).notNull(),
      // "English", "한국어"
      uiTranslations: text("ui_translations").notNull(),
      // JSON: {key: translation}
      isActive: int("is_active").default(1).notNull(),
      // 1 = active, 0 = inactive
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
    });
    userBookmarks = mysqlTable("user_bookmarks", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("user_id").notNull(),
      // References users.id
      verseId: varchar("verse_id", { length: 32 }).notNull(),
      note: text("note"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
    };
  }
});

// server/db.ts
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
var _db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
  }
});

// server/bible-db.ts
var bible_db_exports = {};
__export(bible_db_exports, {
  addUserBookmark: () => addUserBookmark,
  deleteUserBookmark: () => deleteUserBookmark,
  getAllHistoricalEvents: () => getAllHistoricalEvents,
  getAllLanguagePacks: () => getAllLanguagePacks,
  getAllSymbols: () => getAllSymbols,
  getHistoricalEventById: () => getHistoricalEventById,
  getHistoricalEventsBySymbol: () => getHistoricalEventsBySymbol,
  getLanguageDictionary: () => getLanguageDictionary,
  getLanguagePack: () => getLanguagePack,
  getLemmaByStrongId: () => getLemmaByStrongId,
  getSymbolById: () => getSymbolById,
  getTranslation: () => getTranslation,
  getTranslationsByVerse: () => getTranslationsByVerse,
  getUserBookmarks: () => getUserBookmarks,
  getVerseById: () => getVerseById,
  getVersesByBook: () => getVersesByBook,
  getVersesByBookChapter: () => getVersesByBookChapter,
  insertHistoricalEvent: () => insertHistoricalEvent,
  insertLanguageDictionary: () => insertLanguageDictionary,
  insertLanguagePack: () => insertLanguagePack,
  insertLemma: () => insertLemma,
  insertSymbol: () => insertSymbol,
  insertTranslation: () => insertTranslation,
  insertVerse: () => insertVerse,
  searchLemmas: () => searchLemmas,
  searchSymbols: () => searchSymbols
});
import { eq as eq2, and, like } from "drizzle-orm";
async function getLemmaByStrongId(strongId) {
  const db = await getDb();
  if (!db) return void 0;
  const results = await db.select().from(lemmas).where(eq2(lemmas.strongId, strongId)).limit(1);
  return results[0];
}
async function searchLemmas(searchTerm, language) {
  const db = await getDb();
  if (!db) return [];
  if (language) {
    return await db.select().from(lemmas).where(
      and(
        eq2(lemmas.language, language),
        like(lemmas.lemma, `%${searchTerm}%`)
      )
    ).limit(50);
  } else {
    return await db.select().from(lemmas).where(like(lemmas.lemma, `%${searchTerm}%`)).limit(50);
  }
}
async function insertLemma(lemma) {
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
      hebrewComparison: lemma.hebrewComparison
    }
  });
}
async function getVerseById(verseId) {
  const db = await getDb();
  if (!db) return void 0;
  const results = await db.select().from(verses).where(eq2(verses.verseId, verseId)).limit(1);
  return results[0];
}
async function getVersesByBook(book) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(verses).where(eq2(verses.book, book));
}
async function getVersesByBookChapter(book, chapter) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(verses).where(and(eq2(verses.book, book), eq2(verses.chapter, chapter))).orderBy(verses.verse);
}
async function insertVerse(verse) {
  const db = await getDb();
  if (!db) return;
  await db.insert(verses).values(verse).onDuplicateKeyUpdate({
    set: {
      text: verse.text,
      wordAlignment: verse.wordAlignment
    }
  });
}
async function getTranslation(verseId, translation, language) {
  const db = await getDb();
  if (!db) return void 0;
  const results = await db.select().from(translations).where(
    and(
      eq2(translations.verseId, verseId),
      eq2(translations.translation, translation),
      eq2(translations.language, language)
    )
  ).limit(1);
  return results[0];
}
async function getTranslationsByVerse(verseId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(translations).where(eq2(translations.verseId, verseId));
}
async function insertTranslation(translation) {
  const db = await getDb();
  if (!db) return;
  await db.insert(translations).values(translation);
}
async function getLanguageDictionary(strongId, language) {
  const db = await getDb();
  if (!db) return void 0;
  const results = await db.select().from(languageDictionaries).where(
    and(
      eq2(languageDictionaries.strongId, strongId),
      eq2(languageDictionaries.language, language)
    )
  ).limit(1);
  return results[0];
}
async function insertLanguageDictionary(dict) {
  const db = await getDb();
  if (!db) return;
  await db.insert(languageDictionaries).values(dict);
}
async function getSymbolById(symbolId) {
  const db = await getDb();
  if (!db) return void 0;
  const results = await db.select().from(symbols).where(eq2(symbols.symbolId, symbolId)).limit(1);
  return results[0];
}
async function getAllSymbols() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(symbols);
}
async function searchSymbols(searchTerm) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(symbols).where(like(symbols.name, `%${searchTerm}%`)).limit(20);
}
async function insertSymbol(symbol) {
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
      typology: symbol.typology
    }
  });
}
async function getHistoricalEventById(eventId) {
  const db = await getDb();
  if (!db) return void 0;
  const results = await db.select().from(historicalEvents).where(eq2(historicalEvents.eventId, eventId)).limit(1);
  return results[0];
}
async function getHistoricalEventsBySymbol(symbolId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(historicalEvents).where(like(historicalEvents.relatedSymbols, `%${symbolId}%`));
}
async function getAllHistoricalEvents() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(historicalEvents);
}
async function insertHistoricalEvent(event) {
  const db = await getDb();
  if (!db) return;
  await db.insert(historicalEvents).values(event).onDuplicateKeyUpdate({
    set: {
      name: event.name,
      date: event.date,
      description: event.description,
      significance: event.significance,
      relatedSymbols: event.relatedSymbols,
      sourceUrl: event.sourceUrl
    }
  });
}
async function getLanguagePack(languageCode) {
  const db = await getDb();
  if (!db) return void 0;
  const results = await db.select().from(languagePacks).where(eq2(languagePacks.languageCode, languageCode)).limit(1);
  return results[0];
}
async function getAllLanguagePacks() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(languagePacks).where(eq2(languagePacks.isActive, 1));
}
async function insertLanguagePack(pack) {
  const db = await getDb();
  if (!db) return;
  await db.insert(languagePacks).values(pack).onDuplicateKeyUpdate({
    set: {
      languageName: pack.languageName,
      uiTranslations: pack.uiTranslations,
      isActive: pack.isActive
    }
  });
}
async function getUserBookmarks(userId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(userBookmarks).where(eq2(userBookmarks.userId, userId));
}
async function addUserBookmark(bookmark) {
  const db = await getDb();
  if (!db) return;
  await db.insert(userBookmarks).values(bookmark);
}
async function deleteUserBookmark(bookmarkId) {
  const db = await getDb();
  if (!db) return;
  await db.delete(userBookmarks).where(eq2(userBookmarks.id, bookmarkId));
}
var init_bible_db = __esm({
  "server/bible-db.ts"() {
    "use strict";
    init_db();
    init_schema();
  }
});

// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/oauth.ts
init_db();

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { z as z2 } from "zod";
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  // Bible Concordance API
  bible: router({
    // Get lemma by Strong's ID
    getLemma: publicProcedure.input(z2.object({ strongId: z2.string() })).query(async ({ input }) => {
      const { getLemmaByStrongId: getLemmaByStrongId2 } = await Promise.resolve().then(() => (init_bible_db(), bible_db_exports));
      return await getLemmaByStrongId2(input.strongId);
    }),
    // Search lemmas
    searchLemmas: publicProcedure.input(
      z2.object({
        searchTerm: z2.string(),
        language: z2.enum(["hebrew", "greek", "aramaic"]).optional()
      })
    ).query(async ({ input }) => {
      const { searchLemmas: searchLemmas2 } = await Promise.resolve().then(() => (init_bible_db(), bible_db_exports));
      return await searchLemmas2(input.searchTerm, input.language);
    }),
    // Get verse by ID
    getVerse: publicProcedure.input(z2.object({ verseId: z2.string() })).query(async ({ input }) => {
      const { getVerseById: getVerseById2 } = await Promise.resolve().then(() => (init_bible_db(), bible_db_exports));
      return await getVerseById2(input.verseId);
    }),
    // Get verses by book and chapter
    getChapter: publicProcedure.input(
      z2.object({
        book: z2.string(),
        chapter: z2.number()
      })
    ).query(async ({ input }) => {
      const { getVersesByBookChapter: getVersesByBookChapter2 } = await Promise.resolve().then(() => (init_bible_db(), bible_db_exports));
      return await getVersesByBookChapter2(input.book, input.chapter);
    }),
    // Get translations for a verse
    getTranslations: publicProcedure.input(z2.object({ verseId: z2.string() })).query(async ({ input }) => {
      const { getTranslationsByVerse: getTranslationsByVerse2 } = await Promise.resolve().then(() => (init_bible_db(), bible_db_exports));
      return await getTranslationsByVerse2(input.verseId);
    }),
    // Get language dictionary entry
    getLanguageDictionary: publicProcedure.input(
      z2.object({
        strongId: z2.string(),
        language: z2.string()
      })
    ).query(async ({ input }) => {
      const { getLanguageDictionary: getLanguageDictionary2 } = await Promise.resolve().then(() => (init_bible_db(), bible_db_exports));
      return await getLanguageDictionary2(input.strongId, input.language);
    })
  }),
  // Symbol Dictionary (Typology)
  symbols: router({
    // Get all symbols
    getAll: publicProcedure.query(async () => {
      const { getAllSymbols: getAllSymbols2 } = await Promise.resolve().then(() => (init_bible_db(), bible_db_exports));
      return await getAllSymbols2();
    }),
    // Get symbol by ID
    getById: publicProcedure.input(z2.object({ symbolId: z2.string() })).query(async ({ input }) => {
      const { getSymbolById: getSymbolById2 } = await Promise.resolve().then(() => (init_bible_db(), bible_db_exports));
      return await getSymbolById2(input.symbolId);
    }),
    // Search symbols
    search: publicProcedure.input(z2.object({ searchTerm: z2.string() })).query(async ({ input }) => {
      const { searchSymbols: searchSymbols2 } = await Promise.resolve().then(() => (init_bible_db(), bible_db_exports));
      return await searchSymbols2(input.searchTerm);
    })
  }),
  // Historical Events
  history: router({
    // Get all historical events
    getAll: publicProcedure.query(async () => {
      const { getAllHistoricalEvents: getAllHistoricalEvents2 } = await Promise.resolve().then(() => (init_bible_db(), bible_db_exports));
      return await getAllHistoricalEvents2();
    }),
    // Get events by symbol
    getBySymbol: publicProcedure.input(z2.object({ symbolId: z2.string() })).query(async ({ input }) => {
      const { getHistoricalEventsBySymbol: getHistoricalEventsBySymbol2 } = await Promise.resolve().then(() => (init_bible_db(), bible_db_exports));
      return await getHistoricalEventsBySymbol2(input.symbolId);
    })
  }),
  // Language Packs
  languages: router({
    // Get all active language packs
    getAll: publicProcedure.query(async () => {
      const { getAllLanguagePacks: getAllLanguagePacks2 } = await Promise.resolve().then(() => (init_bible_db(), bible_db_exports));
      return await getAllLanguagePacks2();
    }),
    // Get specific language pack
    get: publicProcedure.input(z2.object({ languageCode: z2.string() })).query(async ({ input }) => {
      const { getLanguagePack: getLanguagePack2 } = await Promise.resolve().then(() => (init_bible_db(), bible_db_exports));
      return await getLanguagePack2(input.languageCode);
    })
  }),
  // User Bookmarks (requires authentication)
  bookmarks: router({
    // Get user's bookmarks
    getAll: protectedProcedure.query(async ({ ctx }) => {
      const { getUserBookmarks: getUserBookmarks2 } = await Promise.resolve().then(() => (init_bible_db(), bible_db_exports));
      return await getUserBookmarks2(ctx.user.id);
    }),
    // Add bookmark
    add: protectedProcedure.input(
      z2.object({
        verseId: z2.string(),
        note: z2.string().optional()
      })
    ).mutation(async ({ ctx, input }) => {
      const { addUserBookmark: addUserBookmark2 } = await Promise.resolve().then(() => (init_bible_db(), bible_db_exports));
      await addUserBookmark2({
        userId: ctx.user.id,
        verseId: input.verseId,
        note: input.note
      });
      return { success: true };
    }),
    // Delete bookmark
    delete: protectedProcedure.input(z2.object({ bookmarkId: z2.number() })).mutation(async ({ input }) => {
      const { deleteUserBookmark: deleteUserBookmark2 } = await Promise.resolve().then(() => (init_bible_db(), bible_db_exports));
      await deleteUserBookmark2(input.bookmarkId);
      return { success: true };
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist", "public") : path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
