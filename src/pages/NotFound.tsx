import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Zap,
  Terminal,
  Shield,
  Eye,
  Wifi,
  Lock,
  Home,
  RefreshCw,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const [glitchText, setGlitchText] = useState("404");
  const [isScanning, setIsScanning] = useState(true);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  const glitchChars = ["4", "0", "4", "╔", "╗", "║", "╚", "╝", "█", "▓", "▒", "░"];
  const scanningTexts = [
    "SCANNING NEURAL NETWORKS...",
    "ACCESSING MAINFRAME...",
    "BREACH DETECTED...",
    "FIREWALL COMPROMISED...",
    "SYSTEM INTRUSION DETECTED...",
    "ROUTE NOT FOUND IN MATRIX...",
    "CONNECTION TERMINATED..."
  ];

  useEffect(() => {
    console.error(
      "🚨 CYBER BREACH DETECTED: Unauthorized access attempt to restricted zone:",
      location.pathname
    );

    // Glitch effect for 404 text
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        const randomChars = Array.from({ length: 3 }, () =>
          glitchChars[Math.floor(Math.random() * glitchChars.length)]
        ).join("");
        setGlitchText(randomChars);
        setTimeout(() => setGlitchText("404"), 100);
      }
    }, 200);

    // Terminal scanning effect
    const terminalInterval = setInterval(() => {
      if (terminalLines.length < scanningTexts.length) {
        setTerminalLines(prev => [
          ...prev,
          scanningTexts[prev.length]
        ]);
      } else {
        setIsScanning(false);
      }
    }, 800);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(terminalInterval);
    };
  }, [location.pathname, terminalLines.length]);

  const retryAccess = () => {
    setIsScanning(true);
    setTerminalLines([]);
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-background overflow-hidden relative">
      {/* Animated Background Matrix */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        {/* Floating Binary Code */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute text-primary/30 font-mono text-xs animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </div>
        ))}

        {/* Scanning Lines */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
          <div className="absolute w-0.5 h-full bg-gradient-to-b from-transparent via-secondary to-transparent animate-scan-vertical" />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl w-full text-center space-y-12">

          {/* Warning Header */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <AlertTriangle className="h-8 w-8 text-destructive animate-pulse" />
            <div className="text-destructive font-mono text-sm tracking-wider">
              [ UNAUTHORIZED ACCESS DETECTED ]
            </div>
            <AlertTriangle className="h-8 w-8 text-destructive animate-pulse" />
          </div>

          {/* Glitch 404 */}
          <div className="space-y-6">
            <div className="relative">
              <h1 className="text-9xl md:text-[12rem] font-cyber font-black neon-text animate-neon-flicker select-none">
                {glitchText}
              </h1>

              {/* Glitch overlay effects */}
              <div className="absolute inset-0 text-9xl md:text-[12rem] font-cyber font-black text-destructive/30 animate-glitch-1">
                404
              </div>
              <div className="absolute inset-0 text-9xl md:text-[12rem] font-cyber font-black text-secondary/30 animate-glitch-2">
                404
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl md:text-4xl font-cyber font-bold text-secondary animate-pulse">
                NEURAL PATHWAY NOT FOUND
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                The digital pathway you're seeking has been
                <span className="text-destructive font-bold"> corrupted</span> or
                <span className="text-destructive font-bold"> deleted</span> from the mainframe.
              </p>
            </div>
          </div>

          {/* Terminal Interface */}
          <div className="glass-card p-6 max-w-2xl mx-auto">
            <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-primary/20">
              <Terminal className="h-5 w-5 text-primary" />
              <span className="font-mono text-sm text-primary">CYBER_TERMINAL v3.14.1</span>
              <div className="flex space-x-1 ml-auto">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
              </div>
            </div>

            <div className="font-mono text-sm text-left space-y-2 min-h-[200px]">
              <div className="text-primary">
                {'>'} EXECUTING PATHWAY_SCAN.exe
              </div>
              <div className="text-muted-foreground">
                Target Route: <span className="text-destructive">{location.pathname}</span>
              </div>
              <div className="text-muted-foreground mb-4">
                Timestamp: {new Date().toISOString()}
              </div>

              {terminalLines.map((line, index) => (
                <div
                  key={index}
                  className="text-secondary flex items-center space-x-2 animate-fade-in"
                  style={{ animationDelay: `${index * 0.8}s` }}
                >
                  <ChevronRight className="h-3 w-3" />
                  <span>{line}</span>
                  {index === terminalLines.length - 1 && isScanning && (
                    <div className="w-2 h-4 bg-primary animate-pulse ml-1"></div>
                  )}
                </div>
              ))}

              {!isScanning && (
                <div className="mt-6 space-y-2">
                  <div className="text-destructive flex items-center space-x-2 animate-fade-in">
                    <Zap className="h-4 w-4" />
                    <span>ERROR 404: NEURAL PATHWAY CORRUPTED</span>
                  </div>
                  <div className="text-yellow-500 flex items-center space-x-2 animate-fade-in">
                    <Shield className="h-4 w-4" />
                    <span>RECOMMENDATION: RETURN TO SECURE ZONE</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {!isScanning && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in">
              <Button
                onClick={retryAccess}
                className="cyber-button text-lg py-6 px-8 group"
              >
                <Home className="mr-3 h-6 w-6 group-hover:animate-spin" />
                RETURN TO MAINFRAME

              </Button>

              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="text-lg py-6 px-8 border-2 border-secondary/50 text-secondary hover:bg-secondary/10 hover:border-secondary transition-all duration-300 group"
              >
                <RefreshCw className="mr-3 h-6 w-6 group-hover:animate-spin" />
                RETRY ACCESS
              </Button>
            </div>
          )}

          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="glass-card p-4 text-center">
              <Eye className="h-8 w-8 text-primary mx-auto mb-2 animate-pulse" />
              <div className="text-sm font-mono text-primary">SURVEILLANCE</div>
              <div className="text-xs text-muted-foreground">ACTIVE</div>
            </div>
            <div className="glass-card p-4 text-center">
              <Wifi className="h-8 w-8 text-secondary mx-auto mb-2 animate-pulse" />
              <div className="text-sm font-mono text-secondary">NEURAL LINK</div>
              <div className="text-xs text-muted-foreground">CONNECTED</div>
            </div>
            <div className="glass-card p-4 text-center">
              <Lock className="h-8 w-8 text-destructive mx-auto mb-2 animate-pulse" />
              <div className="text-sm font-mono text-destructive">FIREWALL</div>
              <div className="text-xs text-muted-foreground">COMPROMISED</div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center text-sm text-muted-foreground font-mono max-w-2xl mx-auto border-t border-primary/20 pt-6">
            <p className="mb-2">
              If you believe this is an error, contact the
              <span className="text-primary font-bold"> System Administrator</span> immediately.
            </p>
            <p className="text-xs opacity-70">
              Unauthorized access attempts are being logged and monitored by Cyber Defense Systems.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default NotFound;
