import { useState, useEffect } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DoorOpen, Lock, Key, Lightbulb, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface Puzzle {
  id: number;
  title: string;
  description: string;
  hint: string;
  answer: string;
  difficulty: number;
  category: 'encryption' | 'password' | 'network' | 'social' | 'forensics';
  completed: boolean;
}

const puzzles: Puzzle[] = [
  {
    id: 1,
    title: "Binary Message",
    description: "The hacker left this binary code: 01001000 01000101 01001100 01010000",
    hint: "Convert binary to ASCII text",
    answer: "HELP",
    difficulty: 1,
    category: 'encryption',
    completed: false
  },
  {
    id: 2,
    title: "Caesar Cipher",
    description: "Encrypted message found: 'FDBHU FLSKHU VKLIV WKUHH'. The key is 3.",
    hint: "Shift each letter back by 3 positions in the alphabet",
    answer: "CYBER CIPHER SHIFT THREE",
    difficulty: 2,
    category: 'encryption',
    completed: false
  },
  {
    id: 3,
    title: "Network Analysis",
    description: "Which port is commonly used for HTTPS traffic?",
    hint: "It's the secure version of HTTP",
    answer: "443",
    difficulty: 1,
    category: 'network',
    completed: false
  },
  {
    id: 4,
    title: "Hash Cracking",
    description: "MD5 hash found: 5d41402abc4b2a76b9719d911017c592. What's the original word?",
    hint: "It's a simple greeting word",
    answer: "hello",
    difficulty: 3,
    category: 'forensics',
    completed: false
  },
  {
    id: 5,
    title: "Social Engineering",
    description: "What information should you NEVER share over the phone with someone claiming to be IT support?",
    hint: "This is used to access your accounts",
    answer: "password",
    difficulty: 1,
    category: 'social',
    completed: false
  },
  {
    id: 6,
    title: "Base64 Decode",
    description: "Decode this Base64 string: U0VDVVJJVFk=",
    hint: "Use Base64 decoding",
    answer: "SECURITY",
    difficulty: 2,
    category: 'encryption',
    completed: false
  },
  {
    id: 7,
    title: "IP Address Mystery",
    description: "What type of IP address is 192.168.1.1?",
    hint: "Used within local networks, not routable on internet",
    answer: "private",
    difficulty: 2,
    category: 'network',
    completed: false
  },
  {
    id: 8,
    title: "Final Cipher",
    description: "ROT13: 'LBH NER SERR!' What does this say?",
    hint: "Rotate each letter 13 positions forward",
    answer: "YOU ARE FREE",
    difficulty: 2,
    category: 'encryption',
    completed: false
  }
];

const CyberEscapeRoom = () => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [puzzleStates, setPuzzleStates] = useState(puzzles);
  const [gameOver, setGameOver] = useState(false);
  const [escaped, setEscaped] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const currentPuzzle = puzzleStates[currentPuzzleIndex];
  const completedPuzzles = puzzleStates.filter(p => p.completed).length;

  useEffect(() => {
    if (timeLeft > 0 && !gameOver && !escaped) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !escaped) {
      setGameOver(true);
      toast.error("Time's up! You're trapped in cyberspace!");
    }
  }, [timeLeft, gameOver, escaped]);

  useEffect(() => {
    if (completedPuzzles === puzzles.length) {
      setEscaped(true);
      const timeBonus = timeLeft * 10;
      const hintPenalty = hintsUsed * 50;
      const finalScore = score + timeBonus - hintPenalty;
      setScore(finalScore);
      toast.success(`🎉 Escaped! Final Score: ${finalScore}`);
    }
  }, [completedPuzzles, timeLeft, hintsUsed, score]);

  const handleSubmitAnswer = () => {
    const normalizedAnswer = userAnswer.toLowerCase().trim();
    const correctAnswer = currentPuzzle.answer.toLowerCase().trim();

    if (normalizedAnswer === correctAnswer) {
      const points = currentPuzzle.difficulty * 100 + (showHint ? 0 : 50);
      setScore(prev => prev + points);
      
      setPuzzleStates(prev => prev.map(p => 
        p.id === currentPuzzle.id ? { ...p, completed: true } : p
      ));

      toast.success(`Puzzle solved! +${points} points`);
      setUserAnswer("");
      setShowHint(false);

      // Move to next unsolved puzzle
      const nextIndex = puzzleStates.findIndex((p, idx) => 
        idx > currentPuzzleIndex && !p.completed
      );
      
      if (nextIndex !== -1) {
        setCurrentPuzzleIndex(nextIndex);
      } else {
        // Find first unsolved puzzle from beginning
        const firstUnsolved = puzzleStates.findIndex(p => !p.completed);
        if (firstUnsolved !== -1) {
          setCurrentPuzzleIndex(firstUnsolved);
        }
      }
    } else {
      toast.error("Incorrect answer. Try again!");
    }
  };

  const useHint = () => {
    if (!showHint) {
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
      toast.info("Hint revealed! (-50 points penalty)");
    }
  };

  const switchPuzzle = (index: number) => {
    if (!puzzleStates[index].completed) {
      setCurrentPuzzleIndex(index);
      setUserAnswer("");
      setShowHint(false);
    }
  };

  const restartGame = () => {
    setCurrentPuzzleIndex(0);
    setUserAnswer("");
    setScore(0);
    setTimeLeft(600);
    setPuzzleStates(puzzles.map(p => ({ ...p, completed: false })));
    setGameOver(false);
    setEscaped(false);
    setHintsUsed(0);
    setShowHint(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameOver) {
    return (
      <GameLayout title="Cyber Escape Room" score={score} onRestart={restartGame}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="glass-card p-8 text-center max-w-md">
            <Lock className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-cyber font-bold text-destructive mb-4">
              Trapped in Cyberspace!
            </h2>
            <p className="text-muted-foreground mb-6">
              Time ran out! You solved {completedPuzzles} out of {puzzles.length} puzzles.
            </p>
            <Button onClick={restartGame} className="cyber-button w-full">
              Try Again
            </Button>
          </Card>
        </div>
      </GameLayout>
    );
  }

  if (escaped) {
    return (
      <GameLayout title="Cyber Escape Room" score={score} onRestart={restartGame}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="glass-card p-8 text-center max-w-md">
            <DoorOpen className="h-16 w-16 text-secondary mx-auto mb-4" />
            <h2 className="text-2xl font-cyber font-bold text-primary mb-4">
              Freedom Achieved! 🎉
            </h2>
            <div className="space-y-2 mb-6">
              <p className="text-muted-foreground">
                Escape Time: <span className="text-primary font-bold">{formatTime(600 - timeLeft)}</span>
              </p>
              <p className="text-muted-foreground">
                Final Score: <span className="text-secondary font-bold">{score}</span>
              </p>
              <p className="text-muted-foreground">
                Hints Used: <span className="text-accent font-bold">{hintsUsed}</span>
              </p>
            </div>
            <Button onClick={restartGame} className="cyber-button w-full">
              New Escape Challenge
            </Button>
          </Card>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Cyber Escape Room" score={score} onRestart={restartGame}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Game Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card p-4 text-center">
            <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className={`text-xl font-cyber font-bold ${timeLeft < 60 ? 'text-destructive' : 'text-primary'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs text-muted-foreground">Time Left</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <div className="text-xl font-cyber font-bold text-secondary">{completedPuzzles}/{puzzles.length}</div>
            <div className="text-xs text-muted-foreground">Puzzles Solved</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <div className="text-xl font-cyber font-bold text-accent">{hintsUsed}</div>
            <div className="text-xs text-muted-foreground">Hints Used</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <div className="text-xl font-cyber font-bold text-primary">{Math.round((completedPuzzles / puzzles.length) * 100)}%</div>
            <div className="text-xs text-muted-foreground">Progress</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Puzzle List */}
          <Card className="glass-card p-4 lg:col-span-1">
            <h3 className="font-cyber font-bold text-primary mb-4 flex items-center">
              <Key className="mr-2 h-5 w-5" />
              Puzzle Vault
            </h3>
            <div className="space-y-2">
              {puzzleStates.map((puzzle, index) => (
                <div
                  key={puzzle.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    puzzle.completed 
                      ? 'bg-secondary/20 border border-secondary/50' 
                      : index === currentPuzzleIndex
                      ? 'bg-primary/20 border border-primary/50'
                      : 'bg-card/50 hover:bg-card/70 border border-muted'
                  }`}
                  onClick={() => switchPuzzle(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {puzzle.completed ? (
                        <CheckCircle className="h-4 w-4 text-secondary" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={`text-sm font-medium ${puzzle.completed ? 'text-secondary' : 'text-foreground'}`}>
                        {puzzle.title}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {Array.from({ length: puzzle.difficulty }, (_, i) => '⭐').join('')}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 capitalize">
                    {puzzle.category}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Current Puzzle */}
          <Card className="glass-card p-6 lg:col-span-2">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-cyber font-bold text-primary">
                    {currentPuzzle.title}
                  </h2>
                  <Badge variant="outline" className="capitalize">
                    {currentPuzzle.category}
                  </Badge>
                </div>
                
                <div className="bg-card/50 rounded-lg p-4 mb-4">
                  <p className="text-foreground leading-relaxed">
                    {currentPuzzle.description}
                  </p>
                </div>

                {showHint && (
                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="h-5 w-5 text-accent mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-accent">Hint:</p>
                        <p className="text-sm text-muted-foreground">{currentPuzzle.hint}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Your Answer:
                  </label>
                  <Input
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter your solution..."
                    className="bg-card/50 border-primary/20"
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!userAnswer.trim()}
                    className="cyber-button flex-1"
                  >
                    Submit Answer
                  </Button>
                  
                  <Button
                    onClick={useHint}
                    disabled={showHint}
                    variant="outline"
                    className="border-accent/50 text-accent hover:bg-accent/10"
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    {showHint ? 'Hint Used' : 'Use Hint (-50pts)'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </GameLayout>
  );
};

export default CyberEscapeRoom;