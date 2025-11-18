import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Bible Concordance API
  bible: router({
    // Get lemma by Strong's ID
    getLemma: publicProcedure
      .input(z.object({ strongId: z.string() }))
      .query(async ({ input }) => {
        const { getLemmaByStrongId } = await import("./bible-db");
        return await getLemmaByStrongId(input.strongId);
      }),

    // Search lemmas
    searchLemmas: publicProcedure
      .input(
        z.object({
          searchTerm: z.string(),
          language: z.enum(["hebrew", "greek", "aramaic"]).optional(),
        })
      )
      .query(async ({ input }) => {
        const { searchLemmas } = await import("./bible-db");
        return await searchLemmas(input.searchTerm, input.language);
      }),

    // Get verse by ID
    getVerse: publicProcedure
      .input(z.object({ verseId: z.string() }))
      .query(async ({ input }) => {
        const { getVerseById } = await import("./bible-db");
        return await getVerseById(input.verseId);
      }),

    // Get verses by book and chapter
    getChapter: publicProcedure
      .input(
        z.object({
          book: z.string(),
          chapter: z.number(),
        })
      )
      .query(async ({ input }) => {
        const { getVersesByBookChapter } = await import("./bible-db");
        return await getVersesByBookChapter(input.book, input.chapter);
      }),

    // Get translations for a verse
    getTranslations: publicProcedure
      .input(z.object({ verseId: z.string() }))
      .query(async ({ input }) => {
        const { getTranslationsByVerse } = await import("./bible-db");
        return await getTranslationsByVerse(input.verseId);
      }),

    // Get language dictionary entry
    getLanguageDictionary: publicProcedure
      .input(
        z.object({
          strongId: z.string(),
          language: z.string(),
        })
      )
      .query(async ({ input }) => {
        const { getLanguageDictionary } = await import("./bible-db");
        return await getLanguageDictionary(input.strongId, input.language);
      }),
  }),

  // Symbol Dictionary (Typology)
  symbols: router({
    // Get all symbols
    getAll: publicProcedure.query(async () => {
      const { getAllSymbols } = await import("./bible-db");
      return await getAllSymbols();
    }),

    // Get symbol by ID
    getById: publicProcedure
      .input(z.object({ symbolId: z.string() }))
      .query(async ({ input }) => {
        const { getSymbolById } = await import("./bible-db");
        return await getSymbolById(input.symbolId);
      }),

    // Search symbols
    search: publicProcedure
      .input(z.object({ searchTerm: z.string() }))
      .query(async ({ input }) => {
        const { searchSymbols } = await import("./bible-db");
        return await searchSymbols(input.searchTerm);
      }),
  }),

  // Historical Events
  history: router({
    // Get all historical events
    getAll: publicProcedure.query(async () => {
      const { getAllHistoricalEvents } = await import("./bible-db");
      return await getAllHistoricalEvents();
    }),

    // Get events by symbol
    getBySymbol: publicProcedure
      .input(z.object({ symbolId: z.string() }))
      .query(async ({ input }) => {
        const { getHistoricalEventsBySymbol } = await import("./bible-db");
        return await getHistoricalEventsBySymbol(input.symbolId);
      }),
  }),

  // Language Packs
  languages: router({
    // Get all active language packs
    getAll: publicProcedure.query(async () => {
      const { getAllLanguagePacks } = await import("./bible-db");
      return await getAllLanguagePacks();
    }),

    // Get specific language pack
    get: publicProcedure
      .input(z.object({ languageCode: z.string() }))
      .query(async ({ input }) => {
        const { getLanguagePack } = await import("./bible-db");
        return await getLanguagePack(input.languageCode);
      }),
  }),

  // User Bookmarks (requires authentication)
  bookmarks: router({
    // Get user's bookmarks
    getAll: protectedProcedure.query(async ({ ctx }) => {
      const { getUserBookmarks } = await import("./bible-db");
      return await getUserBookmarks(ctx.user.id);
    }),

    // Add bookmark
    add: protectedProcedure
      .input(
        z.object({
          verseId: z.string(),
          note: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { addUserBookmark } = await import("./bible-db");
        await addUserBookmark({
          userId: ctx.user.id,
          verseId: input.verseId,
          note: input.note,
        });
        return { success: true };
      }),

    // Delete bookmark
    delete: protectedProcedure
      .input(z.object({ bookmarkId: z.number() }))
      .mutation(async ({ input }) => {
        const { deleteUserBookmark } = await import("./bible-db");
        await deleteUserBookmark(input.bookmarkId);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
