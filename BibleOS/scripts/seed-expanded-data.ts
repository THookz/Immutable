/**
 * Expanded seed data for Immutable App
 * Adds more symbols, verses, and historical events
 */

import {
  insertLemma,
  insertVerse,
  insertTranslation,
  insertSymbol,
  insertHistoricalEvent,
} from "../server/bible-db";

async function seedExpandedData() {
  console.log("🌱 Seeding expanded data for Immutable App...");

  // ============================================
  // ADDITIONAL SYMBOLS
  // ============================================

  console.log("🔥 Seeding additional symbols...");

  // Babylon Symbol
  await insertSymbol({
    symbolId: "babylon",
    name: "Babylon",
    originalTerms: JSON.stringify(["H894", "G897"]),
    definition: "In prophecy, Babylon represents false religious systems that oppose God's truth and persecute His people",
    biblicalUsage: JSON.stringify([
      {
        context: "Historical Babylon",
        verses: ["DAN.1.1", "DAN.4.30"],
        explanation: "Literal ancient kingdom that conquered Judah and destroyed Jerusalem",
      },
      {
        context: "Spiritual Babylon",
        verses: ["REV.14.8", "REV.17.5", "REV.18.2"],
        explanation: "Symbolic representation of apostate religious system in end times",
      },
      {
        context: "Confusion and Apostasy",
        verses: ["REV.17.2", "REV.18.3"],
        explanation: "Babylon means 'confusion' - represents mixing truth with error",
      },
    ]),
    misinterpretations: JSON.stringify([
      "Literal rebuilt city in Iraq - prophecy uses Babylon symbolically",
      "Only refers to ancient Rome - applies to end-time religious system",
      "Only Catholic Church - includes all apostate Christianity and false religions",
    ]),
    historicalContext: JSON.stringify([
      {
        event: "Papal Rome",
        date: "538-1798 AD",
        significance: "1260 years of papal supremacy, fulfilling Daniel 7:25 and Revelation 13",
      },
      {
        event: "Protestant Reformation",
        date: "16th Century",
        significance: "Reformers identified papal system as Babylon and called people out",
      },
    ]),
    typology: JSON.stringify({
      earthly: "Ancient Babylon - kingdom that opposed God and persecuted His people",
      heavenly: "Satan's counterfeit religious system opposing God's truth",
      prophetic: "End-time coalition of apostate religions (Rev 17-18) that will enforce the mark of the beast",
    }),
  });

  // Sanctuary Symbol
  await insertSymbol({
    symbolId: "sanctuary",
    name: "Sanctuary / Temple",
    originalTerms: JSON.stringify(["H4720", "H1964", "G3485"]),
    definition: "The sanctuary is God's dwelling place and the center of His plan of salvation, with earthly sanctuary pointing to heavenly reality",
    biblicalUsage: JSON.stringify([
      {
        context: "Earthly Sanctuary",
        verses: ["EXO.25.8", "HEB.8.5"],
        explanation: "Tabernacle and Temple were copies of the heavenly sanctuary",
      },
      {
        context: "Heavenly Sanctuary",
        verses: ["HEB.8.1-2", "REV.11.19"],
        explanation: "True sanctuary in heaven where Christ ministers as High Priest",
      },
      {
        context: "Cleansing of Sanctuary",
        verses: ["DAN.8.14", "LEV.16.30"],
        explanation: "Day of Atonement cleansing points to final judgment",
      },
    ]),
    misinterpretations: JSON.stringify([
      "Rebuilt Jewish temple needed for prophecy - Christ fulfilled the sanctuary service",
      "Sanctuary only symbolic - there is a literal sanctuary in heaven (Heb 8:1-2)",
      "Cleansing refers to earth - Daniel 8:14 refers to heavenly sanctuary",
    ]),
    historicalContext: JSON.stringify([
      {
        event: "Great Disappointment",
        date: "October 22, 1844",
        significance: "Understanding of Daniel 8:14 - cleansing of heavenly sanctuary began",
      },
    ]),
    typology: JSON.stringify({
      earthly: "Tabernacle/Temple with sacrifices, priests, and Day of Atonement",
      heavenly: "Heavenly sanctuary where Christ ministers as High Priest (Heb 8:1-2)",
      prophetic: "Investigative judgment beginning in 1844 (Dan 8:14), leading to final atonement",
    }),
  });

  // Woman Symbol
  await insertSymbol({
    symbolId: "woman",
    name: "Woman (Pure / Harlot)",
    originalTerms: JSON.stringify(["H802", "G1135"]),
    definition: "In prophecy, a woman represents a church - pure woman represents God's faithful church, harlot represents apostate church",
    biblicalUsage: JSON.stringify([
      {
        context: "Pure Woman - True Church",
        verses: ["REV.12.1", "2CO.11.2", "EPH.5.25-27"],
        explanation: "Clothed with sun, moon under feet, crown of 12 stars - God's faithful people",
      },
      {
        context: "Harlot Woman - Apostate Church",
        verses: ["REV.17.1-5", "REV.17.18"],
        explanation: "Sits on scarlet beast, drunk with blood of saints - apostate religious system",
      },
      {
        context: "Israel as Unfaithful Wife",
        verses: ["JER.3.20", "EZE.16.32", "HOS.1.2"],
        explanation: "Old Testament uses marriage metaphor for covenant relationship",
      },
    ]),
    misinterpretations: JSON.stringify([
      "Literal woman or Mary - symbolic representation of church/religious system",
      "Woman in Rev 12 is Israel only - represents God's faithful people through all ages",
      "Harlot is only one denomination - represents all apostate Christianity united",
    ]),
    historicalContext: JSON.stringify([
      {
        event: "Persecution of Waldenses",
        date: "12th-17th Century",
        significance: "Pure woman (faithful church) persecuted by harlot (papal system)",
      },
    ]),
    typology: JSON.stringify({
      earthly: "Marriage covenant between God and His people",
      heavenly: "Christ's bride - the faithful church",
      prophetic: "Remnant church keeping commandments vs apostate church enforcing false worship (Rev 12-17)",
    }),
  });

  // Little Horn Symbol
  await insertSymbol({
    symbolId: "little-horn",
    name: "Little Horn",
    originalTerms: JSON.stringify(["H2192", "H6996"]),
    definition: "The little horn of Daniel 7 and 8 represents a religious-political power that persecutes God's people and attempts to change His law",
    biblicalUsage: JSON.stringify([
      {
        context: "Little Horn from Fourth Beast",
        verses: ["DAN.7.8", "DAN.7.20-25"],
        explanation: "Rises among 10 horns of Rome, speaks blasphemy, persecutes saints, changes times and laws",
      },
      {
        context: "1260 Years of Persecution",
        verses: ["DAN.7.25", "REV.12.6", "REV.13.5"],
        explanation: "Time, times, and half a time = 1260 prophetic days = 1260 years (538-1798 AD)",
      },
      {
        context: "Judgment Against Little Horn",
        verses: ["DAN.7.26", "REV.13.10"],
        explanation: "Dominion taken away, leading to captivity in 1798",
      },
    ]),
    misinterpretations: JSON.stringify([
      "Antiochus Epiphanes - doesn't fit all characteristics (arose from Greece, not Rome)",
      "Future individual antichrist - little horn is a system/kingdom, not a person",
      "Islamic power - doesn't fit location (arose in Western Rome) or characteristics",
    ]),
    historicalContext: JSON.stringify([
      {
        event: "Papal Supremacy",
        date: "538 AD",
        significance: "Justinian's decree established papal authority, beginning 1260 years",
      },
      {
        event: "Papal Captivity",
        date: "1798 AD",
        significance: "Pope taken captive by French general, ending 1260 years of persecution",
      },
      {
        event: "Sunday Law Enforcement",
        date: "321-1998 AD",
        significance: "Attempt to change God's law (Sabbath to Sunday) - Dan 7:25",
      },
    ]),
    typology: JSON.stringify({
      earthly: "Historical papal system persecuting faithful believers",
      prophetic: "End-time religious-political power enforcing false worship and mark of beast",
      pattern: "Same power in Daniel 7, Revelation 13, and Revelation 17 - different perspectives",
    }),
  });

  // Mark of the Beast Symbol
  await insertSymbol({
    symbolId: "mark-of-beast",
    name: "Mark of the Beast",
    originalTerms: JSON.stringify(["G5480"]),
    definition: "The mark of the beast is a sign of allegiance to the beast power, contrasted with the seal of God (Sabbath)",
    biblicalUsage: JSON.stringify([
      {
        context: "Mark in Forehead or Hand",
        verses: ["REV.13.16-17", "REV.14.9-11"],
        explanation: "Forehead = belief/conviction, Hand = actions/compliance. Required for buying/selling",
      },
      {
        context: "Contrasted with Seal of God",
        verses: ["REV.7.3", "REV.14.1", "EZE.20.12"],
        explanation: "God's seal is the Sabbath (sign of Creator), mark of beast is counterfeit (Sunday)",
      },
      {
        context: "Worship Issue",
        verses: ["REV.14.7", "REV.14.9"],
        explanation: "Central issue is worship - Creator (Sabbath) vs beast (Sunday)",
      },
    ]),
    misinterpretations: JSON.stringify([
      "Literal physical mark or microchip - it's about worship and allegiance",
      "Already received unknowingly - mark is future, requires knowledge and choice",
      "Only about Sunday laws - includes broader submission to human authority over God",
    ]),
    historicalContext: JSON.stringify([
      {
        event: "Constantine's Sunday Law",
        date: "AD 321",
        significance: "First civil enforcement of Sunday observance",
      },
      {
        event: "Papal Claims",
        date: "Medieval Period",
        significance: "Papacy claims authority to change Sabbath to Sunday as mark of authority",
      },
    ]),
    typology: JSON.stringify({
      earthly: "Historical Sunday laws enforced by church-state union",
      prophetic: "Future global enforcement of Sunday worship as test of loyalty (Rev 13:15-17)",
      pattern: "Same issue as Daniel 3 (worship or die) and Daniel 6 (obey decree or die)",
    }),
  });

  // ============================================
  // ADDITIONAL VERSES
  // ============================================

  console.log("📜 Seeding additional verses...");

  // Exodus 31:13 - Sabbath as sign
  await insertVerse({
    verseId: "EXO.31.13",
    book: "Exodus",
    chapter: 31,
    verse: 13,
    language: "hebrew",
    text: "אַךְ אֶת־שַׁבְּתֹתַי תִּשְׁמֹרוּ כִּי אוֹת הִוא בֵּינִי וּבֵינֵיכֶם",
    wordAlignment: JSON.stringify([
      { word: "אַךְ", strongId: "H389", position: 1 },
      { word: "שַׁבְּתֹתַי", strongId: "H7676", position: 2 },
      { word: "תִּשְׁמֹרוּ", strongId: "H8104", position: 3 },
      { word: "אוֹת", strongId: "H226", position: 4 },
      { word: "בֵּינִי", strongId: "H996", position: 5 },
      { word: "וּבֵינֵיכֶם", strongId: "H996", position: 6 },
    ]),
  });

  await insertTranslation({
    verseId: "EXO.31.13",
    translation: "KJV",
    language: "english",
    text: "Verily my sabbaths ye shall keep: for it is a sign between me and you throughout your generations",
    wordAlignment: JSON.stringify([
      { word: "sabbaths", strongId: "H7676", position: 2 },
      { word: "keep", strongId: "H8104", position: 3 },
      { word: "sign", strongId: "H226", position: 4 },
      { word: "between", strongId: "H996", position: 5 },
    ]),
  });

  // Daniel 7:25 - Little Horn changes times and laws
  await insertVerse({
    verseId: "DAN.7.25",
    book: "Daniel",
    chapter: 7,
    verse: 25,
    language: "aramaic",
    text: "וְיִשְׂבַּר לְהַשְׁנָיָה זִמְנִין וְדָת",
    wordAlignment: JSON.stringify([
      { word: "יִשְׂבַּר", strongId: "H5452", position: 1 },
      { word: "לְהַשְׁנָיָה", strongId: "H8133", position: 2 },
      { word: "זִמְנִין", strongId: "H2166", position: 3 },
      { word: "דָת", strongId: "H1882", position: 4 },
    ]),
  });

  await insertTranslation({
    verseId: "DAN.7.25",
    translation: "KJV",
    language: "english",
    text: "and think to change times and laws: and they shall be given into his hand until a time and times and the dividing of time.",
    wordAlignment: JSON.stringify([
      { word: "think", strongId: "H5452", position: 1 },
      { word: "change", strongId: "H8133", position: 2 },
      { word: "times", strongId: "H2166", position: 3 },
      { word: "laws", strongId: "H1882", position: 4 },
    ]),
  });

  // Revelation 14:12 - Patience of the saints
  await insertVerse({
    verseId: "REV.14.12",
    book: "Revelation",
    chapter: 14,
    verse: 12,
    language: "greek",
    text: "Ὧδέ ἐστιν ἡ ὑπομονὴ τῶν ἁγίων, οἱ τηροῦντες τὰς ἐντολὰς τοῦ θεοῦ",
    wordAlignment: JSON.stringify([
      { word: "Ὧδέ", strongId: "G5602", position: 1 },
      { word: "ὑπομονὴ", strongId: "G5281", position: 2 },
      { word: "ἁγίων", strongId: "G40", position: 3 },
      { word: "τηροῦντες", strongId: "G5083", position: 4 },
      { word: "ἐντολὰς", strongId: "G1785", position: 5 },
      { word: "θεοῦ", strongId: "G2316", position: 6 },
    ]),
  });

  await insertTranslation({
    verseId: "REV.14.12",
    translation: "KJV",
    language: "english",
    text: "Here is the patience of the saints: here are they that keep the commandments of God, and the faith of Jesus.",
    wordAlignment: JSON.stringify([
      { word: "Here", strongId: "G5602", position: 1 },
      { word: "patience", strongId: "G5281", position: 2 },
      { word: "saints", strongId: "G40", position: 3 },
      { word: "keep", strongId: "G5083", position: 4 },
      { word: "commandments", strongId: "G1785", position: 5 },
      { word: "God", strongId: "G2316", position: 6 },
    ]),
  });

  // ============================================
  // ADDITIONAL HISTORICAL EVENTS
  // ============================================

  console.log("📅 Seeding additional historical events...");

  await insertHistoricalEvent({
    eventId: "justinian-decree",
    name: "Justinian's Decree",
    date: "533-538 AD",
    description: "Emperor Justinian issued decrees establishing the Bishop of Rome as head of all churches and 'corrector of heretics'",
    significance: "Beginning of 1260 years of papal supremacy (538-1798 AD), fulfilling Daniel 7:25 and Revelation 12:6",
    relatedSymbols: JSON.stringify(["little-horn", "woman", "beast"]),
    sourceUrl: "https://historictruth.org/blog/daniel-prophecy",
  });

  await insertHistoricalEvent({
    eventId: "papal-captivity-1798",
    name: "Papal Captivity (1798)",
    date: "February 10, 1798",
    description: "French General Berthier entered Rome, took Pope Pius VI captive, and declared the political rule of the papacy at an end",
    significance: "End of 1260 years of papal persecution, fulfilling Revelation 13:10 'he that leadeth into captivity shall go into captivity'",
    relatedSymbols: JSON.stringify(["little-horn", "beast"]),
    sourceUrl: "https://historictruth.org/blog/daniel-prophecy",
  });

  await insertHistoricalEvent({
    eventId: "waldenses-persecution",
    name: "Persecution of Waldenses",
    date: "12th-17th Century",
    description: "Waldenses (Vaudois) kept the Sabbath and rejected papal authority, suffering severe persecution and martyrdom",
    significance: "Example of pure woman (faithful church) persecuted by harlot (papal system) during 1260 years",
    relatedSymbols: JSON.stringify(["woman", "sabbath", "little-horn"]),
    sourceUrl: "https://historictruth.org/blog/protestant-reformation",
  });

  await insertHistoricalEvent({
    eventId: "jesuit-counter-reformation",
    name: "Jesuit Counter-Reformation",
    date: "1540-1648",
    description: "Jesuits founded by Ignatius Loyola to counter Protestant Reformation through education, infiltration, and Inquisition",
    significance: "Developed Futurism and Preterism to deflect Protestant identification of papacy as antichrist",
    relatedSymbols: JSON.stringify(["babylon", "little-horn"]),
    sourceUrl: "https://historictruth.org/blog/jesuit-oath",
  });

  await insertHistoricalEvent({
    eventId: "great-disappointment",
    name: "Great Disappointment",
    date: "October 22, 1844",
    description: "Millerite movement expected Christ's return based on Daniel 8:14, but Christ entered Most Holy Place in heavenly sanctuary instead",
    significance: "Beginning of investigative judgment and cleansing of heavenly sanctuary, fulfilling Daniel 8:14",
    relatedSymbols: JSON.stringify(["sanctuary"]),
    sourceUrl: "https://historictruth.org/blog/daniel-prophecy",
  });

  await insertHistoricalEvent({
    eventId: "sunday-law-movements",
    name: "Sunday Law Movements",
    date: "19th-20th Century",
    description: "Various attempts to enforce Sunday observance by civil law in America and Europe",
    significance: "Foreshadowing of final enforcement of mark of the beast through Sunday laws",
    relatedSymbols: JSON.stringify(["mark-of-beast", "sabbath"]),
    sourceUrl: "https://historictruth.org/blog/sabbath-to-sunday",
  });

  // ============================================
  // ADDITIONAL LEMMAS
  // ============================================

  console.log("📖 Seeding additional lemmas...");

  // Hebrew: Sign (H226)
  await insertLemma({
    strongId: "H226",
    language: "hebrew",
    lemma: "אוֹת",
    transliteration: "owth",
    pronunciation: "oth",
    definition: "a signal, as a flag, beacon, monument, omen, prodigy, evidence, mark, token, sign",
    root: null,
    morphology: "noun feminine",
    hebrewComparison: null,
  });

  // Aramaic: Change (H8133)
  await insertLemma({
    strongId: "H8133",
    language: "aramaic",
    lemma: "שְׁנָא",
    transliteration: "shena",
    pronunciation: "shen-aw'",
    definition: "to alter, change, be changed, be diverse",
    root: null,
    morphology: "verb",
    hebrewComparison: "Similar to Hebrew H8138 (שָׁנָה shanah), but Aramaic form used in Daniel",
  });

  // Aramaic: Times (H2166)
  await insertLemma({
    strongId: "H2166",
    language: "aramaic",
    lemma: "זְמָן",
    transliteration: "zeman",
    pronunciation: "zem-awn'",
    definition: "an appointed occasion, season, time",
    root: "H2165",
    morphology: "noun masculine",
    hebrewComparison: "Similar to Hebrew H2165 (זְמָן zeman), prophetic time period",
  });

  // Greek: Commandments (G1785)
  await insertLemma({
    strongId: "G1785",
    language: "greek",
    lemma: "ἐντολή",
    transliteration: "entole",
    pronunciation: "en-tol-ay'",
    definition: "an injunction, authoritative prescription, commandment, precept",
    root: "G1781",
    morphology: "noun feminine",
    hebrewComparison: null,
  });

  // Greek: Keep (G5083)
  await insertLemma({
    strongId: "G5083",
    language: "greek",
    lemma: "τηρέω",
    transliteration: "tereo",
    pronunciation: "tay-reh'-o",
    definition: "to guard, keep, observe, watch over",
    root: null,
    morphology: "verb",
    hebrewComparison: null,
  });

  console.log("✅ Expanded data seeded successfully!");
  console.log("\n📊 Summary:");
  console.log("  - 5 new symbols (Babylon, Sanctuary, Woman, Little Horn, Mark of Beast)");
  console.log("  - 3 new verses (Exodus 31:13, Daniel 7:25, Revelation 14:12)");
  console.log("  - 6 new historical events");
  console.log("  - 5 new lemmas");
}

// Run the seed script
seedExpandedData()
  .then(() => {
    console.log("\n🎉 Expanded seeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  });
