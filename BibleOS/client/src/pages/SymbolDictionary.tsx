import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_LOGO } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Flame, BookOpen, History as HistoryIcon, AlertTriangle } from "lucide-react";
import { Link, useParams } from "wouter";

export default function SymbolDictionary() {
  const params = useParams();
  const symbolId = params.symbolId || "sabbath";

  const { data: symbols } = trpc.symbols.getAll.useQuery();
  const { data: symbol } = trpc.symbols.getById.useQuery({ symbolId });
  const { data: historicalEvents } = trpc.history.getBySymbol.useQuery({ symbolId });

  const parseJSON = (jsonString: string | null) => {
    if (!jsonString) return null;
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  };

  const originalTerms = symbol ? parseJSON(symbol.originalTerms) : null;
  const biblicalUsage = symbol ? parseJSON(symbol.biblicalUsage) : null;
  const misinterpretations = symbol ? parseJSON(symbol.misinterpretations) : null;
  const historicalContext = symbol ? parseJSON(symbol.historicalContext) : null;
  const typology = symbol ? parseJSON(symbol.typology) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold text-slate-900">Symbol Dictionary</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Symbol List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5" />
                Symbols
              </CardTitle>
              <CardDescription>Prophetic typology</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {symbols?.map((s) => (
                  <Link key={s.symbolId} href={`/symbols/${s.symbolId}`}>
                    <Button
                      variant={symbolId === s.symbolId ? "default" : "outline"}
                      className="w-full justify-start"
                    >
                      {s.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Main Content - Symbol Details */}
          <div className="lg:col-span-3 space-y-6">
            {symbol && (
              <>
                {/* Symbol Header */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-3xl">{symbol.name}</CardTitle>
                    <CardDescription className="text-base">{symbol.definition}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {originalTerms && (
                      <div className="flex gap-2 flex-wrap">
                        {originalTerms.map((term: string) => (
                          <Badge key={term} variant="secondary" className="font-mono">
                            {term}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Typology */}
                {typology && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Typology
                      </CardTitle>
                      <CardDescription>
                        How this symbol connects earthly, heavenly, and prophetic realities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {typology.earthly && (
                          <div>
                            <h4 className="font-medium text-blue-700 mb-1">Earthly / Historical</h4>
                            <p className="text-slate-700">{typology.earthly}</p>
                          </div>
                        )}
                        {typology.heavenly && (
                          <div>
                            <h4 className="font-medium text-purple-700 mb-1">Heavenly / Spiritual</h4>
                            <p className="text-slate-700">{typology.heavenly}</p>
                          </div>
                        )}
                        {typology.prophetic && (
                          <div>
                            <h4 className="font-medium text-orange-700 mb-1">Prophetic / Future</h4>
                            <p className="text-slate-700">{typology.prophetic}</p>
                          </div>
                        )}
                        {typology.pattern && (
                          <div>
                            <h4 className="font-medium text-green-700 mb-1">Pattern</h4>
                            <p className="text-slate-700">{typology.pattern}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Biblical Usage */}
                {biblicalUsage && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Biblical Usage
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {biblicalUsage.map((usage: any, idx: number) => (
                          <div key={idx} className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-medium text-slate-900 mb-1">{usage.context}</h4>
                            <p className="text-sm text-slate-600 mb-2">{usage.explanation}</p>
                            {usage.verses && (
                              <div className="flex gap-2 flex-wrap">
                                {usage.verses.map((verse: string) => (
                                  <Badge key={verse} variant="outline" className="text-xs">
                                    {verse}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Misinterpretations */}
                {misinterpretations && misinterpretations.length > 0 && (
                  <Card className="border-orange-200 bg-orange-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-900">
                        <AlertTriangle className="h-5 w-5" />
                        Common Misinterpretations
                      </CardTitle>
                      <CardDescription className="text-orange-700">
                        Errors to avoid when studying this symbol
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {misinterpretations.map((error: string, idx: number) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-orange-600 font-bold">✗</span>
                            <span className="text-orange-900">{error}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Historical Context */}
                {historicalEvents && historicalEvents.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <HistoryIcon className="h-5 w-5" />
                        Historical Context
                      </CardTitle>
                      <CardDescription>Key events related to this symbol</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {historicalEvents.map((event) => (
                          <div key={event.eventId} className="border-l-4 border-purple-500 pl-4">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-slate-900">{event.name}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {event.date}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                            <p className="text-sm text-purple-700 font-medium">
                              {event.significance}
                            </p>
                            {event.sourceUrl && (
                              <a
                                href={event.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                              >
                                Read more →
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {!symbol && (
              <Card>
                <CardContent className="py-12 text-center text-slate-500">
                  <Flame className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a symbol from the sidebar to explore its meaning</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
