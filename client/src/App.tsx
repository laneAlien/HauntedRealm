import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Collection from "@/pages/collection";
import DeckBuilder from "@/pages/deck-builder";
import Wallet from "@/pages/wallet";
import Events from "@/pages/events";
import Leaderboard from "@/pages/leaderboard";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import FloatingParticles from "@/components/effects/floating-particles";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/collection" component={Collection} />
      <Route path="/deck-builder" component={DeckBuilder} />
      <Route path="/wallet" component={Wallet} />
      <Route path="/events" component={Events} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-twilight-900 text-moonlight-100 relative">
          <FloatingParticles />
          <Navigation />
          <main>
            <Router />
          </main>
          <Footer />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
