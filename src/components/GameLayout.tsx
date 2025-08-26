import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GameLayoutProps {
  title: string;
  score: number;
  children: React.ReactNode;
  onRestart?: () => void;
  showRestart?: boolean;
}

const GameLayout = ({ title, score, children, onRestart, showRestart = true }: GameLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Game Header */}
      <header className="glass-card border-0 border-b border-primary/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
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

          <h1 className="text-2xl font-cyber font-bold neon-text">
            {title}
          </h1>

          <div className="flex items-center space-x-4">
            <div className="glass-card px-4 py-2">
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
      </header>

      {/* Game Content */}
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default GameLayout;