import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { APP_LOGO, APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Book, Languages, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function BibleReader() {
  const [selectedVerse, setSelectedVerse] = useState<string | null>("GEN.2.2");
  const [selectedWord, setSelectedWord] = useState<{ strongId: string; word: string } | null>(null);

  // Fetch verse data
  const { data: verse } = trpc.bible.getVerse.useQuery(
    { verseId: selectedVerse || "" },
    { enabled: !!selectedVerse }
  );

  const { data: translations } = trpc.bible.getTranslations.useQuery(
    { verseId: selectedVerse || "" },
    { enabled: !!selectedVerse }
  );

  // Fetch lemma data when word is selected
  const { data: lemma } = trpc.bible.getLemma.useQuery(
    { strongId: selectedWord?.strongId || "" },
    { enabled: !!selectedWord }
  );

  const handleWordClick = (strongId: string, word: string) => {
    setSelectedWord({ strongId, word });
  };

  const renderVerseWithLinks = () => {
    if (!verse || !translations || translations.length === 0) return null;

    const kjv = translations.find((t) => t.translation === "KJV");
    if (!kjv || !kjv.wordAlignment) return <p>{kjv?.text}</p>;

    try {
      const alignment = JSON.parse(kjv.wordAlignment as string) as Array<{
        word: string;
        strongId: string;
        position: number;
      }>;

      const words = kjv.text.split(/\s+/);
      return (
        <div className="text-lg leading-relaxed">
          {words.map((word, idx) => {
            const alignedWord = alignment.find((a) => a.word.toLowerCase() === word.toLowerCase());
            if (alignedWord) {
              return (
                <button
                  key={idx}
                  onClick={() => handleWordClick(alignedWord.strongId, word)}
                  className="hover:bg-blue-100 hover:text-blue-700 rounded px-1 transition-colors cursor-pointer underline decoration-dotted"
                >
                  {word}
                </button>
              );
            }
            return <span key={idx}> {word}</span>;
          })}
        </div>
      );
    } catch (e) {
      return <p>{kjv.text}</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />
              <h1 className="text-xl font-bold text-slate-900">Bible Reader</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Languages className="h-4 w-4 mr-2" />
                English
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar - Book/Chapter Selection */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Navigation
              </CardTitle>
              <CardDescription>Select book, chapter, and verse</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Sample Verses</label>
                  <div className="space-y-2">
                    <Button
                      variant={selectedVerse === "GEN.2.2" ? "default" : "outline"}
                      className="w-full justify-start text-xs"
                      onClick={() => setSelectedVerse("GEN.2.2")}
                    >
                      Genesis 2:2 - Sabbath Creation
                    </Button>
                    <Button
                      variant={selectedVerse === "EXO.20.8" ? "default" : "outline"}
                      className="w-full justify-start text-xs"
                      onClick={() => setSelectedVerse("EXO.20.8")}
                    >
                      Exodus 20:8 - Fourth Commandment
                    </Button>
                    <Button
                      variant={selectedVerse === "EXO.31.13" ? "default" : "outline"}
                      className="w-full justify-start text-xs"
                      onClick={() => setSelectedVerse("EXO.31.13")}
                    >
                      Exodus 31:13 - Sabbath as Sign
                    </Button>
                    <Button
                      variant={selectedVerse === "DAN.7.10" ? "default" : "outline"}
                      className="w-full justify-start text-xs"
                      onClick={() => setSelectedVerse("DAN.7.10")}
                    >
                      Daniel 7:10 - Judgment (Aramaic)
                    </Button>
                    <Button
                      variant={selectedVerse === "DAN.7.25" ? "default" : "outline"}
                      className="w-full justify-start text-xs"
                      onClick={() => setSelectedVerse("DAN.7.25")}
                    >
                      Daniel 7:25 - Change Times/Laws (Aramaic)
                    </Button>
                    <Button
                      variant={selectedVerse === "REV.14.12" ? "default" : "outline"}
                      className="w-full justify-start text-xs"
                      onClick={() => setSelectedVerse("REV.14.12")}
                    >
                      Revelation 14:12 - Keep Commandments
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search by reference..." className="pl-10" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content - Verse Display */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {verse ? `${verse.book} ${verse.chapter}:${verse.verse}` : "Select a verse"}
              </CardTitle>
              <CardDescription>
                {verse?.language === "aramaic" && (
                  <span className="inline-flex items-center gap-1 text-orange-600 font-medium">
                    <span className="h-2 w-2 bg-orange-600 rounded-full"></span>
                    Aramaic Section
                  </span>
                )}
                {verse?.language === "hebrew" && "Hebrew Text"}
                {verse?.language === "greek" && "Greek Text"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Original Language */}
                {verse && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="text-sm font-medium text-slate-600 mb-2">Original Language</h3>
                    <p className="text-2xl font-serif text-slate-900 leading-relaxed" dir="rtl">
                      {verse.text}
                    </p>
                  </div>
                )}

                {/* Translation */}
                {translations && translations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-600 mb-2">
                      King James Version (KJV)
                    </h3>
                    <div className="p-4 bg-white border rounded-lg">{renderVerseWithLinks()}</div>
                    <p className="text-xs text-slate-500 mt-2">
                      💡 Click on any underlined word to see its Hebrew/Greek/Aramaic meaning
                    </p>
                  </div>
                )}

                {!verse && (
                  <div className="text-center py-12 text-slate-500">
                    <Book className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a verse from the sidebar to begin</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Word Lookup Dialog */}
      <Dialog open={!!selectedWord} onOpenChange={() => setSelectedWord(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl font-serif">{selectedWord?.word}</span>
              <span className="text-sm font-mono text-slate-500">{selectedWord?.strongId}</span>
            </DialogTitle>
            <DialogDescription>Strong's Concordance Definition</DialogDescription>
          </DialogHeader>

          {lemma && (
            <div className="space-y-4">
              {/* Original Script */}
              <div>
                <h4 className="text-sm font-medium text-slate-600 mb-1">Original Script</h4>
                <p className="text-3xl font-serif" dir={lemma.language === "greek" ? "ltr" : "rtl"}>
                  {lemma.lemma}
                </p>
              </div>

              {/* Transliteration */}
              {lemma.transliteration && (
                <div>
                  <h4 className="text-sm font-medium text-slate-600 mb-1">Transliteration</h4>
                  <p className="text-lg font-mono">{lemma.transliteration}</p>
                </div>
              )}

              {/* Pronunciation */}
              {lemma.pronunciation && (
                <div>
                  <h4 className="text-sm font-medium text-slate-600 mb-1">Pronunciation</h4>
                  <p className="text-lg">{lemma.pronunciation}</p>
                </div>
              )}

              {/* Definition */}
              <div>
                <h4 className="text-sm font-medium text-slate-600 mb-1">Definition</h4>
                <p className="text-base">{lemma.definition}</p>
              </div>

              {/* Language Badge */}
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    lemma.language === "hebrew"
                      ? "bg-blue-100 text-blue-700"
                      : lemma.language === "greek"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {lemma.language.charAt(0).toUpperCase() + lemma.language.slice(1)}
                </span>
              </div>

              {/* Aramaic Comparison */}
              {lemma.hebrewComparison && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="text-sm font-medium text-orange-900 mb-2">
                    Aramaic vs Hebrew Note
                  </h4>
                  <p className="text-sm text-orange-800">{lemma.hebrewComparison}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
