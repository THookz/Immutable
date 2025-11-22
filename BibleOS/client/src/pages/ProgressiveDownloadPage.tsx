import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE } from "@/const";
import { ArrowLeft, Languages } from "lucide-react";
import { Link } from "wouter";
import { ProgressiveDownload } from "@/components/ProgressiveDownload";

export default function ProgressiveDownloadPage() {
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
                <p className="text-sm text-slate-600">Progressive Download</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Languages className="h-4 w-4 mr-2" />
                English
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Download Bible Books</h2>
            <p className="text-slate-600">
              Choose which books to download for offline access. Download only what you need to save storage space.
            </p>
          </div>

          <ProgressiveDownload />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8 mt-12">
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
