import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import BibleReader from "./pages/BibleReader";
import SymbolDictionary from "./pages/SymbolDictionary";
import HistoricalTimeline from "./pages/HistoricalTimeline";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/bible"} component={BibleReader} />
      <Route path={"/symbols"} component={SymbolDictionary} />
      <Route path={"/symbols/:symbolId"} component={SymbolDictionary} />
      <Route path={"/history"} component={HistoricalTimeline} />
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
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
