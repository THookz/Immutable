/**
 * PWA Install Prompt Component
 * Prompts users to install BibleOS as a PWA
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay (don't be too aggressive)
      setTimeout(() => {
        const dismissed = localStorage.getItem('installPromptDismissed');
        if (!dismissed) {
          setShowPrompt(true);
        }
      }, 5000); // Show after 5 seconds
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  }

  function handleDismiss() {
    setShowPrompt(false);
    // Remember dismissal for 7 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    localStorage.setItem('installPromptDismissed', expiryDate.toISOString());
  }

  // Don't show if already installed or prompt not available
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="shadow-xl border-2 border-primary/20">
        <CardHeader className="relative pb-3">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Install BibleOS</CardTitle>
              <CardDescription className="text-xs">
                Add to your home screen
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <p className="text-sm text-muted-foreground">
            Install BibleOS for quick access and offline use. Works like a native app!
          </p>
          
          <div className="flex gap-2">
            <Button onClick={handleInstall} className="flex-1" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Install
            </Button>
            <Button onClick={handleDismiss} variant="outline" size="sm">
              Not Now
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>✓ Instant access from home screen</p>
            <p>✓ Works offline after download</p>
            <p>✓ No app store required</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
