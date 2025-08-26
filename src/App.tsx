import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PhishingDetective from "./pages/games/PhishingDetective";
import PasswordFortress from "./pages/games/PasswordFortress";
import WiFiDefender from "./pages/games/WiFiDefender";
import SpotTheHacker from "./pages/games/SpotTheHacker";
import CyberEscapeRoom from "./pages/games/CyberEscapeRoom";
import CyberHygieneRunner from "./pages/games/CyberHygieneRunner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/games/phishing-detective" element={<PhishingDetective />} />
          <Route path="/games/password-fortress" element={<PasswordFortress />} />
          <Route path="/games/wifi-defender" element={<WiFiDefender />} />
          <Route path="/games/spot-the-hacker" element={<SpotTheHacker />} />
          <Route path="/games/cyber-escape-room" element={<CyberEscapeRoom />} />
          <Route path="/games/cyber-hygiene-runner" element={<CyberHygieneRunner />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
