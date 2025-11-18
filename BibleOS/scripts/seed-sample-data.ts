/**
 * Seed sample data for Immutable App demonstration
 * This includes sample verses, lemmas, symbols, and historical events
 */

import { getDb } from "../server/db";
import {
  insertLemma,
  insertVerse,
  insertTranslation,
  insertSymbol,
  insertHistoricalEvent,
  insertLanguagePack,
  insertLanguageDictionary,
} from "../server/bible-db";

async function seedSampleData() {
  console.log("🌱 Seeding sample data for Immutable App...");

  // ============================================
  // SAMPLE LEMMAS (Strong's Numbers)
  // ============================================
  
  console.log("📖 Seeding lemmas...");

  // Hebrew: Sabbath (H7676)
  await insertLemma({
    strongId: "H7676",
    language: "hebrew",
    lemma: "שַׁבָּת",
    transliteration: "shabbath",
    pronunciation: "shab-bawth'",
    definition: "intermission, i.e (specifically) the Sabbath:--sabbath.",
    root: "H7673",
    morphology: "noun feminine",
    hebrewComparison: null,
  });

  // Greek: Sabbath (G4521)
  await insertLemma({
    strongId: "G4521",
    language: "greek",
    lemma: "σάββατον",
    transliteration: "sabbaton",
    pronunciation: "sab'-bat-on",
    definition: "the Sabbath (i.e. Shabbath), or day of weekly repose from secular avocations",
    root: "H7676",
    morphology: "noun neuter",
    hebrewComparison: null,
  });

  // Hebrew: Fire (H784)
  await insertLemma({
    strongId: "H784",
    language: "hebrew",
    lemma: "אֵשׁ",
    transliteration: "esh",
    pronunciation: "aysh",
    definition: "fire (literally or figuratively)",
    root: null,
    morphology: "noun feminine",
    hebrewComparison: null,
  });

  // Greek: Fire (G4442)
  await insertLemma({
    strongId: "G4442",
    language: "greek",
    lemma: "πῦρ",
    transliteration: "pur",
    pronunciation: "poor",
    definition: "fire (literally or figuratively, specially lightning)",
    root: null,
    morphology: "noun neuter",
    hebrewComparison: null,
  });

  // Aramaic: Kingdom (H4437)
  await insertLemma({
    strongId: "H4437",
    language: "aramaic",
    lemma: "מַלְכוּ",
    transliteration: "malkuw",
    pronunciation: "mal-koo'",
    definition: "dominion (abstractly or concretely):--kingdom, kingly, realm, reign.",
    root: "H4430",
    morphology: "noun feminine",
    hebrewComparison: "Similar to Hebrew H4438 (מַלְכוּת), but Aramaic form used in Daniel 2-7",
  });

  // ============================================
  // SAMPLE VERSES
  // ============================================

  console.log("📜 Seeding verses...");

  // Genesis 2:2 (Sabbath creation)
  await insertVerse({
    verseId: "GEN.2.2",
    book: "Genesis",
    chapter: 2,
    verse: 2,
    language: "hebrew",
    text: "וַיְכַל אֱלֹהִים בַּיּוֹם הַשְּׁבִיעִי מְלַאכְתּוֹ אֲשֶׁר עָשָׂה וַיִּשְׁבֹּת בַּיּוֹם הַשְּׁבִיעִי",
    wordAlignment: JSON.stringify([
      { word: "וַיְכַל", strongId: "H3615", position: 1 },
      { word: "אֱלֹהִים", strongId: "H430", position: 2 },
      { word: "בַּיּוֹם", strongId: "H3117", position: 3 },
      { word: "הַשְּׁבִיעִי", strongId: "H7637", position: 4 },
      { word: "מְלַאכְתּוֹ", strongId: "H4399", position: 5 },
      { word: "וַיִּשְׁבֹּת", strongId: "H7673", position: 6 },
    ]),
  });

  await insertTranslation({
    verseId: "GEN.2.2",
    translation: "KJV",
    language: "english",
    text: "And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made.",
    wordAlignment: JSON.stringify([
      { word: "ended", strongId: "H3615", position: 1 },
      { word: "God", strongId: "H430", position: 2 },
      { word: "day", strongId: "H3117", position: 3 },
      { word: "seventh", strongId: "H7637", position: 4 },
      { word: "work", strongId: "H4399", position: 5 },
      { word: "rested", strongId: "H7673", position: 6 },
    ]),
  });

  // Exodus 20:8 (Sabbath commandment)
  await insertVerse({
    verseId: "EXO.20.8",
    book: "Exodus",
    chapter: 20,
    verse: 8,
    language: "hebrew",
    text: "זָכוֹר אֶת־יוֹם הַשַּׁבָּת לְקַדְּשׁוֹ",
    wordAlignment: JSON.stringify([
      { word: "זָכוֹר", strongId: "H2142", position: 1 },
      { word: "יוֹם", strongId: "H3117", position: 2 },
      { word: "הַשַּׁבָּת", strongId: "H7676", position: 3 },
      { word: "לְקַדְּשׁוֹ", strongId: "H6942", position: 4 },
    ]),
  });

  await insertTranslation({
    verseId: "EXO.20.8",
    translation: "KJV",
    language: "english",
    text: "Remember the sabbath day, to keep it holy.",
    wordAlignment: JSON.stringify([
      { word: "Remember", strongId: "H2142", position: 1 },
      { word: "day", strongId: "H3117", position: 2 },
      { word: "sabbath", strongId: "H7676", position: 3 },
      { word: "holy", strongId: "H6942", position: 4 },
    ]),
  });

  // Daniel 7:10 (Aramaic - Judgment scene)
  await insertVerse({
    verseId: "DAN.7.10",
    book: "Daniel",
    chapter: 7,
    verse: 10,
    language: "aramaic",
    text: "דִּינָא יְתִב וְסִפְרִין פְּתִיחוּ",
    wordAlignment: JSON.stringify([
      { word: "דִּינָא", strongId: "H1780", position: 1 },
      { word: "יְתִב", strongId: "H3488", position: 2 },
      { word: "סִפְרִין", strongId: "H5609", position: 3 },
      { word: "פְּתִיחוּ", strongId: "H6606", position: 4 },
    ]),
  });

  await insertTranslation({
    verseId: "DAN.7.10",
    translation: "KJV",
    language: "english",
    text: "the judgment was set, and the books were opened.",
    wordAlignment: JSON.stringify([
      { word: "judgment", strongId: "H1780", position: 1 },
      { word: "set", strongId: "H3488", position: 2 },
      { word: "books", strongId: "H5609", position: 3 },
      { word: "opened", strongId: "H6606", position: 4 },
    ]),
  });

  // ============================================
  // SYMBOL DICTIONARY (Typology)
  // ============================================

  console.log("🔥 Seeding symbols...");

  // Sabbath Symbol
  await insertSymbol({
    symbolId: "sabbath",
    name: "Sabbath",
    originalTerms: JSON.stringify(["H7676", "G4521"]),
    definition: "The seventh-day Sabbath, a memorial of Creation and a sign of sanctification",
    biblicalUsage: JSON.stringify([
      {
        context: "Creation Week",
        verses: ["GEN.2.2", "GEN.2.3"],
        explanation: "God rested on the seventh day and blessed it, establishing the Sabbath at Creation",
      },
      {
        context: "Fourth Commandment",
        verses: ["EXO.20.8-11"],
        explanation: "Remember the Sabbath day to keep it holy, pointing back to Creation",
      },
      {
        context: "Sign of Sanctification",
        verses: ["EXO.31.13", "EZE.20.12"],
        explanation: "The Sabbath is a sign between God and His people",
      },
    ]),
    misinterpretations: JSON.stringify([
      "Sunday worship as 'Christian Sabbath' - no biblical basis",
      "Sabbath was only for Jews - established at Creation before Jews existed",
      "Sabbath was abolished at the cross - Jesus kept it and said it continues (Matt 24:20)",
    ]),
    historicalContext: JSON.stringify([
      {
        event: "Constantine's Sunday Law",
        date: "AD 321",
        significance: "Roman Emperor Constantine mandated Sunday rest, beginning the shift from Sabbath to Sunday",
      },
      {
        event: "Council of Laodicea",
        date: "AD 364",
        significance: "Church council forbade Sabbath-keeping and promoted Sunday observance",
      },
    ]),
    typology: JSON.stringify({
      earthly: "Weekly rest from labor, memorial of Creation",
      heavenly: "Eternal rest in Christ, cessation from sin",
      prophetic: "Points to the final rest in the new earth (Heb 4:9, Isa 66:22-23)",
    }),
  });

  // Fire Symbol
  await insertSymbol({
    symbolId: "fire",
    name: "Fire",
    originalTerms: JSON.stringify(["H784", "G4442"]),
    definition: "Fire in Scripture represents God's presence, purification, judgment, and destruction",
    biblicalUsage: JSON.stringify([
      {
        context: "God's Presence",
        verses: ["EXO.3.2", "EXO.19.18"],
        explanation: "God appeared to Moses in the burning bush and on Mount Sinai in fire",
      },
      {
        context: "Purification",
        verses: ["MAL.3.2-3", "1PE.1.7"],
        explanation: "Fire refines and purifies like gold in a furnace",
      },
      {
        context: "Judgment and Destruction",
        verses: ["REV.20.14-15", "2PE.3.10"],
        explanation: "The wicked will be destroyed by fire - complete annihilation, not eternal torment",
      },
    ]),
    misinterpretations: JSON.stringify([
      "Eternal hellfire - Bible teaches fire consumes and destroys (Mal 4:1-3)",
      "Purgatory - no biblical support for purifying fire after death",
      "Immortal souls burning forever - Bible teaches the soul that sins shall die (Eze 18:4)",
    ]),
    historicalContext: JSON.stringify([
      {
        event: "Greek Philosophy Influence",
        date: "2nd-3rd Century AD",
        significance: "Platonic idea of immortal soul merged with Christian doctrine, leading to eternal torment theology",
      },
    ]),
    typology: JSON.stringify({
      earthly: "Physical fire that consumes and destroys",
      heavenly: "God's holy presence and purifying power",
      prophetic: "Final judgment fire that destroys sin and sinners completely (Rev 20:9, Mal 4:1)",
    }),
  });

  // Beast Symbol
  await insertSymbol({
    symbolId: "beast",
    name: "Beast / Kingdom",
    originalTerms: JSON.stringify(["H2416", "G2342", "H4437"]),
    definition: "In prophecy, beasts represent kingdoms or political powers",
    biblicalUsage: JSON.stringify([
      {
        context: "Daniel's Four Beasts",
        verses: ["DAN.7.1-8"],
        explanation: "Four beasts represent four successive kingdoms: Babylon, Medo-Persia, Greece, Rome",
      },
      {
        context: "Revelation's Beasts",
        verses: ["REV.13.1-18"],
        explanation: "Sea beast and earth beast represent religious-political powers in end times",
      },
    ]),
    misinterpretations: JSON.stringify([
      "Futurist interpretation - placing all prophecy in the future ignores historical fulfillment",
      "Literal beasts - Bible interprets its own symbols (Dan 7:17, 23)",
    ]),
    historicalContext: JSON.stringify([
      {
        event: "Protestant Reformation",
        date: "16th Century",
        significance: "Reformers identified papal Rome as the little horn power of Daniel 7",
      },
    ]),
    typology: JSON.stringify({
      earthly: "Historical kingdoms (Babylon, Medo-Persia, Greece, Rome)",
      prophetic: "End-time religious-political powers opposing God's people",
      pattern: "Same characteristics: persecution of saints, blasphemy, time period (1260 years)",
    }),
  });

  // ============================================
  // HISTORICAL EVENTS
  // ============================================

  console.log("📅 Seeding historical events...");

  await insertHistoricalEvent({
    eventId: "constantine-sunday-law",
    name: "Constantine's Sunday Law",
    date: "March 7, AD 321",
    description: "Roman Emperor Constantine issued the first civil Sunday law, requiring rest on 'the venerable day of the Sun'",
    significance: "This marked the beginning of the official transition from Sabbath to Sunday observance in the Roman Empire",
    relatedSymbols: JSON.stringify(["sabbath"]),
    sourceUrl: "https://historictruth.org/blog/sabbath-to-sunday",
  });

  await insertHistoricalEvent({
    eventId: "council-laodicea",
    name: "Council of Laodicea",
    date: "AD 364",
    description: "Church council Canon 29 stated: 'Christians must not judaize by resting on the Sabbath, but must work on that day'",
    significance: "Official church policy forbidding Sabbath observance and mandating Sunday worship",
    relatedSymbols: JSON.stringify(["sabbath"]),
    sourceUrl: "https://historictruth.org/blog/sabbath-to-sunday",
  });

  await insertHistoricalEvent({
    eventId: "protestant-reformation",
    name: "Protestant Reformation",
    date: "1517",
    description: "Martin Luther posted 95 Theses, beginning the Protestant Reformation",
    significance: "Reformers returned to Scripture and identified papal Rome as the antichrist power",
    relatedSymbols: JSON.stringify(["beast"]),
    sourceUrl: "https://historictruth.org/blog/protestant-reformation",
  });

  // ============================================
  // LANGUAGE PACKS
  // ============================================

  console.log("🌍 Seeding language packs...");

  await insertLanguagePack({
    languageCode: "en",
    languageName: "English",
    uiTranslations: JSON.stringify({
      app_title: "Immutable - Universal Bible Concordance",
      search_placeholder: "Search by word or Strong's number...",
      bible_reader: "Bible Reader",
      symbol_dictionary: "Symbol Dictionary",
      historical_timeline: "Historical Timeline",
      language_selector: "Language",
      original_language: "Original Language",
      translations: "Translations",
      strongs_definition: "Strong's Definition",
      typology: "Typology",
      biblical_usage: "Biblical Usage",
      misinterpretations: "Common Misinterpretations",
      historical_context: "Historical Context",
    }),
    isActive: 1,
  });

  await insertLanguagePack({
    languageCode: "ko",
    languageName: "한국어",
    uiTranslations: JSON.stringify({
      app_title: "불변 - 보편적 성경 콘코던스",
      search_placeholder: "단어 또는 스트롱 번호로 검색...",
      bible_reader: "성경 읽기",
      symbol_dictionary: "상징 사전",
      historical_timeline: "역사 타임라인",
      language_selector: "언어",
      original_language: "원어",
      translations: "번역",
      strongs_definition: "스트롱 정의",
      typology: "예표론",
      biblical_usage: "성경적 사용",
      misinterpretations: "일반적인 오해",
      historical_context: "역사적 맥락",
    }),
    isActive: 1,
  });

  // ============================================
  // LANGUAGE DICTIONARIES
  // ============================================

  console.log("📚 Seeding language dictionaries...");

  // Korean explanation for Sabbath
  await insertLanguageDictionary({
    strongId: "H7676",
    language: "korean",
    explanation: "안식일 (安息日) - 일곱째 날, 하나님께서 창조를 마치시고 쉬신 날. 하나님과 그의 백성 사이의 영원한 표징.",
    usage: "창조 주간에 제정되었으며 (창세기 2:2-3), 십계명의 네 번째 계명 (출애굽기 20:8-11)",
    nuanceNote: "히브리어 '샤바트'는 '쉬다', '그치다'를 의미하는 동사 샤바트(H7673)에서 유래",
  });

  // Spanish explanation for Sabbath
  await insertLanguageDictionary({
    strongId: "H7676",
    language: "spanish",
    explanation: "Sábado - El séptimo día, el día en que Dios descansó de la creación. Una señal eterna entre Dios y Su pueblo.",
    usage: "Establecido en la semana de la creación (Génesis 2:2-3), el cuarto mandamiento (Éxodo 20:8-11)",
    nuanceNote: "Del hebreo 'shabbath', derivado del verbo shabath (H7673) que significa 'descansar', 'cesar'",
  });

  console.log("✅ Sample data seeded successfully!");
  console.log("\n📊 Summary:");
  console.log("  - 5 lemmas (Hebrew, Greek, Aramaic)");
  console.log("  - 3 verses with translations");
  console.log("  - 3 symbols (Sabbath, Fire, Beast)");
  console.log("  - 3 historical events");
  console.log("  - 2 language packs (English, Korean)");
  console.log("  - 2 language dictionary entries");
}

// Run the seed script
seedSampleData()
  .then(() => {
    console.log("\n🎉 Seeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  });
