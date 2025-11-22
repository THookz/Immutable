import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { InstallPrompt } from "./components/InstallPrompt";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import BibleReader from "./pages/BibleReader";
import SymbolDictionary from "./pages/SymbolDictionary";
import HistoricalTimeline from "./pages/HistoricalTimeline";
import SyncStatus from "./pages/SyncStatus";
import ProgressiveDownloadPage from "./pages/ProgressiveDownloadPage";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/bible"} component={BibleReader} />
      <Route path={"/symbols"} component={SymbolDictionary} />
      <Route path={"/symbols/:symbolId"} component={SymbolDictionary} />
      <Route path={"/history"} component={HistoricalTimeline} />
      <Route path={"/sync-status"} component={SyncStatus} />
      <Route path={"/download"} component={ProgressiveDownloadPage} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          <OfflineIndicator />
          <InstallPrompt />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
