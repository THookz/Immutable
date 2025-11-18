import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_LOGO } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, History, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function HistoricalTimeline() {
  const { data: events } = trpc.history.getAll.useQuery();

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
            <h1 className="text-xl font-bold text-slate-900">Historical Timeline</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-6 w-6" />
                Prophetic History
              </CardTitle>
              <CardDescription>
                Key historical events that shaped biblical interpretation and prophetic understanding
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-orange-200"></div>

            {/* Events */}
            <div className="space-y-8">
              {events?.map((event, idx) => {
                const relatedSymbols = event.relatedSymbols
                  ? JSON.parse(event.relatedSymbols as string)
                  : [];

                return (
                  <div key={event.eventId} className="relative pl-20">
                    {/* Timeline Dot */}
                    <div className="absolute left-6 top-6 h-5 w-5 rounded-full bg-white border-4 border-blue-500 shadow-lg"></div>

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">{event.name}</CardTitle>
                            <Badge variant="secondary" className="mt-2">
                              {event.date}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-700 mb-4">{event.description}</p>
                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-4">
                          <h4 className="text-sm font-medium text-purple-900 mb-2">
                            Prophetic Significance
                          </h4>
                          <p className="text-sm text-purple-800">{event.significance}</p>
                        </div>

                        {relatedSymbols.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-slate-600 mb-2">
                              Related Symbols
                            </h4>
                            <div className="flex gap-2 flex-wrap">
                              {relatedSymbols.map((symbolId: string) => (
                                <Link key={symbolId} href={`/symbols/${symbolId}`}>
                                  <Badge
                                    variant="outline"
                                    className="cursor-pointer hover:bg-slate-100"
                                  >
                                    {symbolId}
                                  </Badge>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {event.sourceUrl && (
                          <a
                            href={event.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                          >
                            Read full article
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {!events || events.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-slate-500">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No historical events found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
