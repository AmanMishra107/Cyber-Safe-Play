import { useState, useEffect } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, EyeOff, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface PasswordStrength {
  score: number;
  feedback: string[];
  strength: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  color: string;
}

const PasswordFortress = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [score, setScore] = useState(0);
  const [totalDefense, setTotalDefense] = useState(0);
  const [level, setLevel] = useState(1);
  const [passwordsCreated, setPasswordsCreated] = useState(0);
  const [showSuggestion, setShowSuggestion] = useState(true);

  const currentRequirement = getRequirementForLevel(level);

  function getRequirementForLevel(level: number) {
    const requirements = [
      { level: 1, description: "Create a password with at least 8 characters", minScore: 30 },
      { level: 2, description: "Create a password with numbers and special characters", minScore: 50 },
      { level: 3, description: "Create a strong password with mixed case", minScore: 70 },
      { level: 4, description: "Create a very strong password", minScore: 85 },
      { level: 5, description: "Create an ultra-secure password", minScore: 95 }
    ];
    return requirements[level - 1] || requirements[4];
  }

  function analyzePassword(pwd: string): PasswordStrength {
    let score = 0;
    const feedback: string[] = [];

    // Length
    if (pwd.length >= 8) score += 20;
    else feedback.push("Use at least 8 characters");

    if (pwd.length >= 12) score += 10;
    else if (pwd.length >= 8) feedback.push("12+ characters is even better");

    // Character variety
    if (/[a-z]/.test(pwd)) score += 10;
    else feedback.push("Add lowercase letters");

    if (/[A-Z]/.test(pwd)) score += 10;
    else feedback.push("Add uppercase letters");

    if (/[0-9]/.test(pwd)) score += 10;
    else feedback.push("Add numbers");

    if (/[^a-zA-Z0-9]/.test(pwd)) score += 15;
    else feedback.push("Add special characters (!@#$%^&*)");

    // Patterns
    if (!/(.)\1{2,}/.test(pwd)) score += 10;
    else feedback.push("Avoid repeating characters");

    if (!/123|abc|qwe|password|admin/i.test(pwd)) score += 15;
    else feedback.push("Avoid common patterns");

    // Determine strength
    let strength: PasswordStrength['strength'];
    let color: string;

    if (score < 20) {
      strength = 'Very Weak';
      color = 'text-red-500';
    } else if (score < 40) {
      strength = 'Weak';
      color = 'text-orange-500';
    } else if (score < 60) {
      strength = 'Fair';
      color = 'text-yellow-500';
    } else if (score < 80) {
      strength = 'Good';
      color = 'text-blue-500';
    } else if (score < 90) {
      strength = 'Strong';
      color = 'text-secondary';
    } else {
      strength = 'Very Strong';
      color = 'text-primary';
    }

    return { score, feedback, strength, color };
  }

  const passwordAnalysis = analyzePassword(password);

  const handleSubmitPassword = () => {
    if (passwordAnalysis.score >= currentRequirement.minScore) {
      const points = passwordAnalysis.score * 10;
      setScore(prev => prev + points);
      setTotalDefense(prev => prev + passwordAnalysis.score);
      setPasswordsCreated(prev => prev + 1);
      
      toast.success(`Fortress Strengthened! +${points} points`);
      
      if (level < 5) {
        setLevel(prev => prev + 1);
        setShowSuggestion(true);
      } else {
        toast.success("🏆 Master Password Creator! Fortress Complete!");
      }
      
      setPassword("");
    } else {
      toast.error(`Password too weak! Need ${currentRequirement.minScore}+ strength`);
    }
  };

  const restartGame = () => {
    setPassword("");
    setScore(0);
    setTotalDefense(0);
    setLevel(1);
    setPasswordsCreated(0);
    setShowSuggestion(true);
  };

  const suggestions = [
    "Try combining unrelated words: 'Purple7$Mountain'",
    "Use a memorable phrase: 'I@te3Cookies4Lunch!'",
    "Mix letters with symbols: 'C@ffeineAddict2024#'",
    "Create from initials: 'MyDogIs5YearsOld!' → 'MDI5YO!'",
    "Use substitutions: 'Passw0rd!' → 'P@ssw0rd2024!'"
  ];

  return (
    <GameLayout title="Password Fortress" score={score} onRestart={restartGame}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Fortress Status */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-cyber font-bold text-primary flex items-center">
              <Shield className="mr-2 h-6 w-6" />
              Fortress Defense: {totalDefense}
            </h3>
            <Badge variant="outline" className="border-secondary/50 text-secondary">
              Level {level}/5
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-cyber font-bold text-primary">{passwordsCreated}</div>
              <div className="text-sm text-muted-foreground">Passwords Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-cyber font-bold text-secondary">{totalDefense}</div>
              <div className="text-sm text-muted-foreground">Total Defense</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-cyber font-bold text-accent">{level}</div>
              <div className="text-sm text-muted-foreground">Current Level</div>
            </div>
          </div>
        </div>

        {/* Current Challenge */}
        <Card className="glass-card p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-accent mr-3" />
            <h3 className="text-lg font-cyber font-bold">Level {level} Challenge</h3>
          </div>
          <p className="text-muted-foreground mb-2">{currentRequirement.description}</p>
          <p className="text-sm text-primary">
            Required Strength: {currentRequirement.minScore}+
          </p>
        </Card>

        {/* Password Input */}
        <Card className="glass-card p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-cyber font-bold">Create Your Password</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="border-primary/50 text-primary hover:bg-primary/10"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password..."
                className="pr-12 bg-card/50 border-primary/20"
              />
            </div>

            {password && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Strength:</span>
                  <span className={`font-bold ${passwordAnalysis.color}`}>
                    {passwordAnalysis.strength} ({passwordAnalysis.score}/100)
                  </span>
                </div>
                
                <Progress value={passwordAnalysis.score} className="h-2" />
                
                {passwordAnalysis.feedback.length > 0 && (
                  <div className="bg-card/30 rounded-lg p-3">
                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                      💡 Improve your password:
                    </p>
                    <ul className="space-y-1">
                      {passwordAnalysis.feedback.map((tip, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center">
                          <XCircle className="h-3 w-3 text-destructive mr-2" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={handleSubmitPassword}
              disabled={!password || passwordAnalysis.score < currentRequirement.minScore}
              className="w-full cyber-button"
            >
              <Shield className="mr-2 h-5 w-5" />
              Fortify Defense
            </Button>
          </div>
        </Card>

        {/* Tips & Suggestions */}
        {showSuggestion && (
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-cyber font-bold text-secondary">💡 Password Tips</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestion(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestions.slice(0, 4).map((suggestion, index) => (
                <div key={index} className="text-sm text-muted-foreground flex">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                  {suggestion}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </GameLayout>
  );
};

export default PasswordFortress;