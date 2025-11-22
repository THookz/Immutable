import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Book, Flame, History, Languages, Search, Download, RefreshCw, CloudDownload } from "lucide-react";
import { Link } from "wouter";
import { OfflineDownload } from "@/components/OfflineDownload";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={APP_LOGO} alt="Logo" className="h-10 w-10" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{APP_TITLE}</h1>
                <p className="text-sm text-slate-600">Bridging Original Languages to Modern Translations</p>
              </div>
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Universal Bible Concordance
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            A free, offline-capable concordance bridging Hebrew, Greek, and Aramaic to modern translations.
            Explore typology, prophetic symbols, and historical context with Strong's numbers and multilingual support.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/bible">
              <Button size="lg" className="gap-2">
                <Book className="h-5 w-5" />
                Start Reading
              </Button>
            </Link>
            <Link href="/symbols">
              <Button size="lg" variant="outline" className="gap-2">
                <Flame className="h-5 w-5" />
                Symbol Dictionary
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Four-Layer Concordance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Original text indexing (Hebrew/Greek/Aramaic) → Translation alignment → Language-specific dictionaries → Typology layer
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-green-600" />
                Word-Level Lookup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Tap any word to see the Hebrew/Greek/Aramaic behind it, Strong's definitions, and explanations in your language
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-600" />
                Typology & Symbols
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Understand prophetic symbols: Sabbath, Fire, Beast, Babylon, Sanctuary. Historical events → Spiritual realities
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-purple-600" />
                Historical Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Timeline of key events: Constantine AD 321, Council of Laodicea, Protestant Reformation, and their prophetic significance
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-indigo-600" />
                Multilingual Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Plain-language Strong's explanations in Korean, Spanish, French, and more. UI translations for global access
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-teal-600" />
                Aramaic in Daniel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Proper handling of Aramaic sections (Daniel 2:4-7:28) with distinct lemmas and Hebrew comparisons
              </CardDescription>
            </CardContent>
          </Card>

          <Link href="/download">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudDownload className="h-5 w-5 text-blue-600" />
                  Progressive Download
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Download individual Bible books for offline access. Choose only what you need to save storage space.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/sync-status">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-green-600" />
                  Sync Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Monitor offline data synchronization and manage background sync settings for seamless updates.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Offline Download Section */}
      <section className="container mx-auto px-4 py-12 mb-12">
        <OfflineDownload />
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-12 mb-12">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Freely Given, Freely Shared</CardTitle>
            <CardDescription className="text-blue-100">
              This app is completely free and works offline. Download, share, and use it to study God's Word deeply.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Link href="/bible">
                <Button size="lg" variant="secondary">
                  <Book className="h-5 w-5 mr-2" />
                  Explore the Bible
                </Button>
              </Link>
              <Link href="/symbols">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                  <Flame className="h-5 w-5 mr-2" />
                  Learn Typology
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p className="mb-2">
            Linked from{" "}
            <a
              href="https://historictruth.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              HistoricTruth.org
            </a>
          </p>
          <p className="text-sm">
            Open source Bible data from OpenScriptures, MorphGNT, and Strong's Concordance
          </p>
        </div>
      </footer>
    </div>
  );
}
