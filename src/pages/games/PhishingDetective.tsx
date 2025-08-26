import { useState, useEffect } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Email {
  id: number;
  subject: string;
  sender: string;
  content: string;
  isPhishing: boolean;
  indicators: string[];
}

const emails: Email[] = [
  {
    id: 1,
    subject: "Urgent: Verify Your Account Now!",
    sender: "security@paypaI.com",
    content: "Your account has been compromised. Click here immediately to verify your identity and secure your funds.",
    isPhishing: true,
    indicators: ["Misspelled domain (paypaI vs paypal)", "Urgent language", "Generic greeting"]
  },
  {
    id: 2,
    subject: "Weekly Team Meeting - Tomorrow 2PM",
    sender: "sarah.johnson@company.com",
    content: "Hi team, just a reminder about our weekly sync tomorrow at 2PM in conference room B. Please bring your project updates.",
    isPhishing: false,
    indicators: ["Known sender", "Specific details", "Professional tone"]
  },
  {
    id: 3,
    subject: "You've Won $1,000,000!!!",
    sender: "winner@lottery-international.biz",
    content: "Congratulations! You've been selected as our grand prize winner. Send us your bank details to claim your prize!",
    isPhishing: true,
    indicators: ["Too good to be true", "Asking for bank details", "Suspicious domain"]
  },
  {
    id: 4,
    subject: "System Maintenance Scheduled",
    sender: "it-support@company.com", 
    content: "Scheduled system maintenance will occur this Sunday from 2-4 AM. Some services may be temporarily unavailable.",
    isPhishing: false,
    indicators: ["IT department sender", "Scheduled notification", "Reasonable timing"]
  },
  {
    id: 5,
    subject: "FINAL NOTICE: Account Suspension",
    sender: "no-reply@bank-security.net",
    content: "Your account will be suspended in 24 hours unless you verify your credentials. Click the link below NOW!",
    isPhishing: true,
    indicators: ["Threatening language", "Generic sender", "Creates urgency"]
  }
];

const PhishingDetective = () => {
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);

  const currentEmail = emails[currentEmailIndex];

  const handleAnswer = (isPhishing: boolean) => {
    const correct = isPhishing === currentEmail.isPhishing;
    setLastAnswer(correct);
    setShowResult(true);

    if (correct) {
      const points = 100 + (streak * 10);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      toast.success(`Correct! +${points} points`);
    } else {
      setStreak(0);
      toast.error("Incorrect! Streak reset.");
    }

    setTimeout(() => {
      setShowResult(false);
      setLastAnswer(null);
      
      if (currentEmailIndex < emails.length - 1) {
        setCurrentEmailIndex(prev => prev + 1);
      } else {
        setGameOver(true);
        toast.success(`Game Complete! Final Score: ${score}`);
      }
    }, 3000);
  };

  const restartGame = () => {
    setCurrentEmailIndex(0);
    setScore(0);
    setGameOver(false);
    setShowResult(false);
    setLastAnswer(null);
    setStreak(0);
  };

  if (gameOver) {
    return (
      <GameLayout title="Phishing Detective" score={score} onRestart={restartGame}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="glass-card p-8 text-center max-w-md">
            <CheckCircle className="h-16 w-16 text-secondary mx-auto mb-4" />
            <h2 className="text-2xl font-cyber font-bold text-primary mb-4">
              Mission Complete!
            </h2>
            <p className="text-muted-foreground mb-6">
              You've analyzed all emails and earned <span className="text-primary font-bold">{score}</span> points!
            </p>
            <div className="space-y-2">
              <Button onClick={restartGame} className="cyber-button w-full">
                Play Again
              </Button>
            </div>
          </Card>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Phishing Detective" score={score} onRestart={restartGame}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Email {currentEmailIndex + 1} of {emails.length}
            </span>
            <Badge variant="outline" className="border-secondary/50 text-secondary">
              Streak: {streak}
            </Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
              style={{ width: `${((currentEmailIndex + 1) / emails.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Email Display */}
        <Card className="glass-card p-6">
          <div className="flex items-center mb-4">
            <Mail className="h-6 w-6 text-primary mr-3" />
            <h3 className="text-lg font-cyber font-bold">Analyze This Email</h3>
          </div>
          
          <div className="space-y-4">
            <div className="border border-muted rounded-lg p-4 bg-card/50">
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="font-semibold text-muted-foreground w-16">From:</span>
                  <span className="text-foreground">{currentEmail.sender}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-muted-foreground w-16">Subject:</span>
                  <span className="text-foreground">{currentEmail.subject}</span>
                </div>
              </div>
              <hr className="my-3 border-muted" />
              <p className="text-foreground leading-relaxed">
                {currentEmail.content}
              </p>
            </div>

            {!showResult ? (
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={() => handleAnswer(false)}
                  className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Legitimate Email
                </Button>
                <Button
                  onClick={() => handleAnswer(true)}
                  className="flex-1 bg-destructive hover:bg-destructive/80 text-destructive-foreground"
                >
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Phishing Attempt
                </Button>
              </div>
            ) : (
              <div className="pt-4">
                <Card className={`p-4 border-2 ${lastAnswer ? 'border-secondary' : 'border-destructive'}`}>
                  <div className="flex items-start space-x-3">
                    {lastAnswer ? (
                      <CheckCircle className="h-6 w-6 text-secondary mt-1" />
                    ) : (
                      <XCircle className="h-6 w-6 text-destructive mt-1" />
                    )}
                    <div>
                      <h4 className={`font-bold ${lastAnswer ? 'text-secondary' : 'text-destructive'}`}>
                        {lastAnswer ? 'Correct!' : 'Incorrect!'}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        This email is {currentEmail.isPhishing ? 'a phishing attempt' : 'legitimate'}.
                      </p>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">Key indicators:</p>
                        {currentEmail.indicators.map((indicator, index) => (
                          <p key={index} className="text-xs text-muted-foreground">• {indicator}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </Card>
      </div>
    </GameLayout>
  );
};

export default PhishingDetective;