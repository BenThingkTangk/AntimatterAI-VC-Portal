import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DtomBrandShell } from "@nirmata/dtom-brand-system";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DtomBrandShell assetBasePath="/dtom-assets" theme="dark" brand="atom">
          <Toaster />
          <Router hook={useHashLocation}>
            <AppRouter />
          </Router>
        </DtomBrandShell>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
