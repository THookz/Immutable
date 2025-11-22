/**
 * Progressive Download Component
 * Allows users to download Bible books individually for better control
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, CheckCircle2, Loader2, Book } from 'lucide-react';
import { bulkPutData, getByIndex, STORES } from '@/lib/indexeddb';

interface BookDownloadStatus {
  book: string;
  downloaded: boolean;
  downloading: boolean;
  verseCount: number;
  error: string | null;
}

const OLD_TESTAMENT_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
  'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
];

const NEW_TESTAMENT_BOOKS = [
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon',
  'Hebrews', 'James', '1 Peter', '2 Peter',
  '1 John', '2 John', '3 John', 'Jude', 'Revelation',
];

export function ProgressiveDownload() {
  const [bookStatuses, setBookStatuses] = useState<Map<string, BookDownloadStatus>>(new Map());
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [downloading, setDownloading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    checkDownloadedBooks();
  }, []);

  async function checkDownloadedBooks() {
    const statuses = new Map<string, BookDownloadStatus>();
    const allBooks = [...OLD_TESTAMENT_BOOKS, ...NEW_TESTAMENT_BOOKS];

    for (const book of allBooks) {
      try {
        // Check if book exists in IndexedDB
        const firstVerse = await getByIndex(STORES.VERSES, 'book', book);
        statuses.set(book, {
          book,
          downloaded: !!firstVerse,
          downloading: false,
          verseCount: 0,
          error: null,
        });
      } catch (error) {
        statuses.set(book, {
          book,
          downloaded: false,
          downloading: false,
          verseCount: 0,
          error: null,
        });
      }
    }

    setBookStatuses(statuses);
  }

  async function downloadBook(book: string): Promise<void> {
    try {
      const response = await fetch(`/data/books/${book}.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${book}`);
      }

      const verses = await response.json();
      await bulkPutData(STORES.VERSES, verses);

      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  }

  async function handleDownloadSelected() {
    if (selectedBooks.size === 0) {
      alert('Please select at least one book to download');
      return;
    }

    setDownloading(true);
    const booksToDownload = Array.from(selectedBooks);
    let completed = 0;

    for (const book of booksToDownload) {
      // Update status to downloading
      setBookStatuses((prev) => {
        const newMap = new Map(prev);
        const status = newMap.get(book);
        if (status) {
          status.downloading = true;
          newMap.set(book, { ...status });
        }
        return newMap;
      });

      try {
        await downloadBook(book);

        // Update status to downloaded
        setBookStatuses((prev) => {
          const newMap = new Map(prev);
          const status = newMap.get(book);
          if (status) {
            status.downloaded = true;
            status.downloading = false;
            newMap.set(book, { ...status });
          }
          return newMap;
        });

        completed++;
        setOverallProgress((completed / booksToDownload.length) * 100);
      } catch (error) {
        // Update status with error
        setBookStatuses((prev) => {
          const newMap = new Map(prev);
          const status = newMap.get(book);
          if (status) {
            status.downloading = false;
            status.error = error instanceof Error ? error.message : 'Download failed';
            newMap.set(book, { ...status });
          }
          return newMap;
        });
      }
    }

    setDownloading(false);
    setSelectedBooks(new Set());
    setOverallProgress(0);
  }

  function toggleBookSelection(book: string) {
    setSelectedBooks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(book)) {
        newSet.delete(book);
      } else {
        newSet.add(book);
      }
      return newSet;
    });
  }

  function selectAllOT() {
    setSelectedBooks((prev) => {
      const newSet = new Set(prev);
      OLD_TESTAMENT_BOOKS.forEach((book) => {
        const status = bookStatuses.get(book);
        if (status && !status.downloaded) {
          newSet.add(book);
        }
      });
      return newSet;
    });
  }

  function selectAllNT() {
    setSelectedBooks((prev) => {
      const newSet = new Set(prev);
      NEW_TESTAMENT_BOOKS.forEach((book) => {
        const status = bookStatuses.get(book);
        if (status && !status.downloaded) {
          newSet.add(book);
        }
      });
      return newSet;
    });
  }

  function renderBookList(books: string[], title: string) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={title.includes('Old') ? selectAllOT : selectAllNT}
            disabled={downloading}
          >
            Select All
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {books.map((book) => {
            const status = bookStatuses.get(book);
            if (!status) return null;

            return (
              <div
                key={book}
                className="flex items-center gap-2 p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                {status.downloaded ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : status.downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500 flex-shrink-0" />
                ) : (
                  <Checkbox
                    checked={selectedBooks.has(book)}
                    onCheckedChange={() => toggleBookSelection(book)}
                    disabled={downloading}
                  />
                )}
                <span className="text-sm truncate">{book}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const downloadedCount = Array.from(bookStatuses.values()).filter((s) => s.downloaded).length;
  const totalBooks = OLD_TESTAMENT_BOOKS.length + NEW_TESTAMENT_BOOKS.length;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="h-6 w-6 text-primary" />
            <CardTitle>Progressive Download</CardTitle>
          </div>
          <Badge variant="secondary">
            {downloadedCount} / {totalBooks} books
          </Badge>
        </div>
        <CardDescription>
          Download Bible books individually or by testament for better control over storage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {downloading && (
          <div className="space-y-2">
            <Progress value={overallProgress} className="h-2" />
            <div className="text-sm text-muted-foreground text-center">
              Downloading selected books... {Math.round(overallProgress)}%
            </div>
          </div>
        )}

        {selectedBooks.size > 0 && !downloading && (
          <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
            <div className="text-sm">
              <strong>{selectedBooks.size}</strong> book{selectedBooks.size > 1 ? 's' : ''} selected
            </div>
            <Button onClick={handleDownloadSelected} size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download Selected
            </Button>
          </div>
        )}

        {renderBookList(OLD_TESTAMENT_BOOKS, 'Old Testament (39 books)')}
        {renderBookList(NEW_TESTAMENT_BOOKS, 'New Testament (27 books)')}

        <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
          <p>💡 <strong>Tip:</strong> Download books you study most frequently first.</p>
          <p>📱 <strong>Storage:</strong> Each book uses approximately 0.5-2 MB of storage.</p>
          <p>🔄 <strong>Sync:</strong> Downloaded books are stored locally and work offline.</p>
        </div>
      </CardContent>
    </Card>
  );
}
