import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-0 border-b border-primary/20 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary animate-glow-pulse drop-shadow-lg" />
              <div className="absolute -inset-1 bg-primary/30 rounded-full blur-xl"></div>
            </div>
            <span className="text-2xl font-cyber font-black neon-text drop-shadow-md">
              CyberSafePlay
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10 font-semibold">
            <a
              href="#games"
              className="text-foreground hover:text-primary transition-colors relative group"
            >
              Games
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary transition-all group-hover:w-full"></span>
            </a>

            <Link
              to="/support/about"
              className="text-foreground hover:text-primary transition-colors relative group"
            >
              About
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 rounded-xl glass-card border border-primary/20 shadow-lg animate-fade-in">
            <a
              href="#games"
              className="block px-4 py-3 text-foreground hover:text-primary transition-colors font-medium"
            >
              Games
            </a>

            {/* Divider Line */}
            <div className="border-t border-primary/20 mx-4 my-2"></div>

            <Link
              to="/support/about"
              className="block px-4 py-3 text-foreground hover:text-primary transition-colors font-medium"
            >
              About
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
