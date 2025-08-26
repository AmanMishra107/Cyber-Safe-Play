import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-0 border-b border-primary/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary animate-glow-pulse" />
              <div className="absolute -inset-1 bg-primary/20 rounded-full blur-md"></div>
            </div>
            <span className="text-2xl font-cyber font-black neon-text">
              CyberSafePlay
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#games" className="text-foreground hover:text-primary transition-colors">
              Games
            </a>
            <a href="#leaderboard" className="text-foreground hover:text-primary transition-colors">
              Leaderboard
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              About
            </a>
            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
              Login
            </Button>
            <Button className="cyber-button">
              Start Playing
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <a href="#games" className="block text-foreground hover:text-primary transition-colors">
              Games
            </a>
            <a href="#leaderboard" className="block text-foreground hover:text-primary transition-colors">
              Leaderboard
            </a>
            <a href="#about" className="block text-foreground hover:text-primary transition-colors">
              About
            </a>
            <div className="space-y-2 pt-4">
              <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10">
                Login
              </Button>
              <Button className="w-full cyber-button">
                Start Playing
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;