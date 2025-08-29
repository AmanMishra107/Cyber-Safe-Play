import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ScrollToTop from './components/ScrollToTop';
import { useSmoothScroll } from './hooks/useSmoothScroll';

// Original 6 games
import PhishingDetective from "./pages/games/PhishingDetective";
import PasswordFortress from "./pages/games/PasswordFortress";
import WiFiDefender from "./pages/games/WiFiDefender";
import SpotTheHacker from "./pages/games/SpotTheHacker";
import CyberEscapeRoom from "./pages/games/CyberEscapeRoom";
import CyberHygieneRunner from "./pages/games/CyberHygieneRunner";

// New 6 games
import FirewallBuilder from "./pages/games/FirewallBuilder";
import VulnerabilityHunter from "./pages/games/VulnerabilityHunter";
import PenetrationTesterPro from "./pages/games/PenetrationTesterPro";
import DigitalForensicsLab from "./pages/games/DigitalForensicsLab";
import IncidentResponseCommand from "./pages/games/IncidentResponseCommand";
import SocialEngineeringSimulator from "./pages/games/SocialEngineeringSimulator";
import About from "./pages/support/about";
import Contact from "./pages/support/contact";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Original 6 games */}
          <Route path="/games/phishing-detective" element={<PhishingDetective />} />
          <Route path="/games/password-fortress" element={<PasswordFortress />} />
          <Route path="/games/wifi-defender" element={<WiFiDefender />} />
          <Route path="/games/spot-the-hacker" element={<SpotTheHacker />} />
          <Route path="/games/cyber-escape-room" element={<CyberEscapeRoom />} />
          <Route path="/games/cyber-hygiene-runner" element={<CyberHygieneRunner />} />

          {/* New 6 games */}
          <Route path="/games/firewall-builder" element={<FirewallBuilder />} />
          <Route path="/games/vulnerability-hunter" element={<VulnerabilityHunter />} />
          <Route path="/games/penetration-tester-pro" element={<PenetrationTesterPro />} />
          <Route path="/games/digital-forensics-lab" element={<DigitalForensicsLab />} />
          <Route path="/games/incident-response-command" element={<IncidentResponseCommand />} />
          <Route path="/games/social-engineering-simulator" element={<SocialEngineeringSimulator />} />

          <Route path="/support/about" element={<About />} />
          <Route path="/support/contact" element={<Contact />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>

);

export default App;
