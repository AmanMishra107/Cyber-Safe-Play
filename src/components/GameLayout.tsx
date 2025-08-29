import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, RotateCcw, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface GameLayoutProps {
  title: string;
  score: number;
  children: React.ReactNode;
  onRestart?: () => void;
  showRestart?: boolean;
}

const GameLayout = ({ title, score, children, onRestart, showRestart = true }: GameLayoutProps) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Game Header */}
      <header className="glass-card border-0 border-b border-primary/20 p-2 sm:p-4">
        <div className="container mx-auto">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="border-primary/50 text-primary hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="border-secondary/50 text-secondary hover:bg-secondary/10"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </div>

            <h1 className="text-xl lg:text-2xl font-cyber font-bold neon-text text-center">
              {title}
            </h1>

            <div className="flex items-center space-x-4">
              <div className="glass-card px-3 py-2 lg:px-4">
                <span className="text-sm text-muted-foreground">Score: </span>
                <span className="text-lg font-cyber font-bold text-primary">{score}</span>
              </div>
              {showRestart && onRestart && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRestart}
                  className="border-accent/50 text-accent hover:bg-accent/10"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restart
                </Button>
              )}
            </div>
          </div>

          {/* Mobile/Tablet Header */}
          <div className="md:hidden">
            {/* Top Row - Menu Button, Title, Score */}
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMobileMenu}
                className="border-primary/50 text-primary hover:bg-primary/10 p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>

              <h1 className="text-lg sm:text-xl font-cyber font-bold neon-text text-center flex-1 mx-4">
                {title}
              </h1>

              <div className="glass-card px-2 py-1 sm:px-3 sm:py-2">
                <span className="text-xs sm:text-sm text-muted-foreground">Score: </span>
                <span className="text-sm sm:text-lg font-cyber font-bold text-primary">{score}</span>
              </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
              <div className="glass-card p-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigate(-1);
                      setIsMobileMenuOpen(false);
                    }}
                    className="border-primary/50 text-primary hover:bg-primary/10 w-full justify-start"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigate("/");
                      setIsMobileMenuOpen(false);
                    }}
                    className="border-secondary/50 text-secondary hover:bg-secondary/10 w-full justify-start"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                  {showRestart && onRestart && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onRestart();
                        setIsMobileMenuOpen(false);
                      }}
                      className="border-accent/50 text-accent hover:bg-accent/10 w-full justify-start"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restart
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Game Content */}
      <main className="container mx-auto p-2 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default GameLayout;
