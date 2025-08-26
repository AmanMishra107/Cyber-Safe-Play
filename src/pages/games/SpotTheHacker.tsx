import { useState, useEffect } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck, AlertTriangle, Clock, Eye, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Scenario {
  id: number;
  title: string;
  description: string;
  image: string;
  suspicious: boolean;
  explanation: string;
  indicators: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Office Worker at 3 AM",
    description: "Security cameras show Sarah from accounting accessing the building at 3:17 AM on Saturday. She's at her computer and appears to be copying files to a USB drive.",
    image: "🏢",
    suspicious: true,
    explanation: "Working unusual hours, especially on weekends, combined with file copying behavior is highly suspicious.",
    indicators: ["Unusual work hours", "File copying to external device", "Weekend access"],
    difficulty: 'Easy'
  },
  {
    id: 2,
    title: "IT Support Request",
    description: "Tom from IT called asking for your login credentials to 'update the system'. He mentioned urgent maintenance that needs to happen today.",
    image: "📞",
    suspicious: true,
    explanation: "Legitimate IT never asks for passwords over the phone. This is social engineering.",
    indicators: ["Asking for credentials", "Phone request", "Creates urgency"],
    difficulty: 'Easy'
  },
  {
    id: 3,
    title: "New Employee Setup",
    description: "A new hire, Jessica, is setting up her workstation. She's installing software from a company-approved list and connecting to the corporate Wi-Fi.",
    image: "👩‍💼",
    suspicious: false,
    explanation: "Normal onboarding activities. Using approved software and corporate network is standard procedure.",
    indicators: ["New employee", "Approved software", "Corporate network"],
    difficulty: 'Easy'
  },
  {
    id: 4,
    title: "Printer Issues",
    description: "Mike from finance has been having printer problems. He's trying different network printers and asking colleagues about their printer settings.",
    image: "🖨️",
    suspicious: false,
    explanation: "Common IT issue. Seeking help with printer connectivity is normal workplace behavior.",
    indicators: ["Common IT problem", "Asking for help", "Work-related task"],
    difficulty: 'Medium'
  },
  {
    id: 5,
    title: "Badge Sharing",
    description: "Lisa swiped her colleague Mark into the secure server room because 'he forgot his badge upstairs'. Mark seemed nervous and avoided eye contact with security cameras.",
    image: "🔑",
    suspicious: true,
    explanation: "Badge sharing violates security policy. Nervous behavior and camera avoidance are red flags.",
    indicators: ["Policy violation", "Nervous behavior", "Avoiding cameras"],
    difficulty: 'Medium'
  },
  {
    id: 6,
    title: "Cleaning Crew",
    description: "A new cleaning person is working after hours. They have proper uniforms, company ID, and are following their supervisor's instructions for office cleaning.",
    image: "🧹",
    suspicious: false,
    explanation: "Legitimate cleaning crew with proper identification and supervision is normal.",
    indicators: ["Proper ID", "Supervised", "Legitimate business"],
    difficulty: 'Hard'
  },
  {
    id: 7,
    title: "USB Discovery",
    description: "Alex found a USB drive in the parking lot labeled 'Executive Salaries 2024' and is about to plug it into his work computer to see if he can find the owner.",
    image: "💾",
    suspicious: true,
    explanation: "USB drops are common attack vectors. Never plug in unknown USB devices - this could be a trap.",
    indicators: ["Unknown USB device", "Found in public area", "Enticing label"],
    difficulty: 'Hard'
  },
  {
    id: 8,
    title: "Vendor Visit",
    description: "A person claiming to be from 'TechSupport Pro' arrived unannounced, saying they need to check the network infrastructure. They don't have an appointment but insist it's urgent.",
    image: "🔧",
    suspicious: true,
    explanation: "Unscheduled vendor visits are suspicious. Legitimate vendors always have appointments.",
    indicators: ["No appointment", "Unannounced visit", "Claims urgency"],
    difficulty: 'Medium'
  }
];

const SpotTheHacker = () => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [scenariosCompleted, setScenariosCompleted] = useState(0);

  const currentScenario = scenarios[currentScenarioIndex];

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
  }, [timeLeft, showResult, gameOver]);

  const handleTimeUp = () => {
    setLastAnswer(false);
    setShowResult(true);
    setStreak(0);
    toast.error("Time's up! Streak reset.");
    
    setTimeout(() => {
      nextScenario();
    }, 3000);
  };

  const handleAnswer = (suspicious: boolean) => {
    const correct = suspicious === currentScenario.suspicious;
    setLastAnswer(correct);
    setShowResult(true);

    if (correct) {
      const timeBonus = Math.floor(timeLeft * 2);
      const difficultyMultiplier = currentScenario.difficulty === 'Hard' ? 3 : currentScenario.difficulty === 'Medium' ? 2 : 1;
      const points = (100 + timeBonus + (streak * 10)) * difficultyMultiplier;
      
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      toast.success(`Correct! +${points} points`);
    } else {
      setStreak(0);
      toast.error("Incorrect! Streak reset.");
    }

    setTimeout(() => {
      nextScenario();
    }, 4000);
  };

  const nextScenario = () => {
    setShowResult(false);
    setLastAnswer(null);
    setScenariosCompleted(prev => prev + 1);
    
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      setTimeLeft(30);
    } else {
      setGameOver(true);
      toast.success(`Investigation Complete! Final Score: ${score}`);
    }
  };

  const restartGame = () => {
    setCurrentScenarioIndex(0);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setShowResult(false);
    setLastAnswer(null);
    setStreak(0);
    setScenariosCompleted(0);
  };

  if (gameOver) {
    return (
      <GameLayout title="Spot the Hacker" score={score} onRestart={restartGame}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="glass-card p-8 text-center max-w-md">
            <UserCheck className="h-16 w-16 text-secondary mx-auto mb-4" />
            <h2 className="text-2xl font-cyber font-bold text-primary mb-4">
              Investigation Complete!
            </h2>
            <div className="space-y-2 mb-6">
              <p className="text-muted-foreground">
                Final Score: <span className="text-primary font-bold">{score}</span>
              </p>
              <p className="text-muted-foreground">
                Scenarios Analyzed: <span className="text-secondary font-bold">{scenariosCompleted}</span>
              </p>
            </div>
            <Button onClick={restartGame} className="cyber-button w-full">
              New Investigation
            </Button>
          </Card>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Spot the Hacker" score={score} onRestart={restartGame}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card p-4 text-center">
            <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-xl font-cyber font-bold text-primary">{timeLeft}s</div>
            <div className="text-xs text-muted-foreground">Time Left</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <div className="text-xl font-cyber font-bold text-secondary">{streak}</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <div className="text-xl font-cyber font-bold text-accent">{currentScenarioIndex + 1}/{scenarios.length}</div>
            <div className="text-xs text-muted-foreground">Scenario</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <Badge variant="outline" className={`border-${currentScenario.difficulty === 'Hard' ? 'destructive' : currentScenario.difficulty === 'Medium' ? 'accent' : 'secondary'}/50`}>
              {currentScenario.difficulty}
            </Badge>
          </Card>
        </div>

        {/* Scenario Display */}
        <Card className="glass-card p-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{currentScenario.image}</div>
            <h2 className="text-2xl font-cyber font-bold text-primary mb-2">
              {currentScenario.title}
            </h2>
          </div>

          <div className="bg-card/50 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-3">
              <Eye className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Observation:</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {currentScenario.description}
                </p>
              </div>
            </div>
          </div>

          {!showResult ? (
            <div className="space-y-4">
              <p className="text-center text-lg font-semibold text-foreground">
                Is this behavior suspicious?
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => handleAnswer(false)}
                  className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-6"
                  disabled={showResult}
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Normal Behavior
                </Button>
                <Button
                  onClick={() => handleAnswer(true)}
                  className="flex-1 bg-destructive hover:bg-destructive/80 text-destructive-foreground py-6"
                  disabled={showResult}
                >
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Suspicious Activity
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Card className={`p-4 border-2 ${lastAnswer ? 'border-secondary' : 'border-destructive'}`}>
                <div className="flex items-start space-x-3">
                  {lastAnswer ? (
                    <CheckCircle className="h-6 w-6 text-secondary mt-1" />
                  ) : (
                    <XCircle className="h-6 w-6 text-destructive mt-1" />
                  )}
                  <div className="flex-1">
                    <h4 className={`font-bold mb-2 ${lastAnswer ? 'text-secondary' : 'text-destructive'}`}>
                      {lastAnswer ? 'Correct Analysis!' : 'Incorrect Assessment'}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {currentScenario.explanation}
                    </p>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Key Indicators:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        {currentScenario.indicators.map((indicator, index) => (
                          <p key={index} className="text-xs text-muted-foreground flex items-center">
                            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                            {indicator}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </Card>
      </div>
    </GameLayout>
  );
};

export default SpotTheHacker;