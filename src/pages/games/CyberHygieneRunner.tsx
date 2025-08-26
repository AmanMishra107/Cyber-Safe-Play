import { useState, useEffect, useCallback } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Zap, Heart, Shield } from "lucide-react";
import { toast } from "sonner";

interface GameObject {
  id: number;
  x: number;
  y: number;
  type: 'good' | 'bad' | 'power';
  icon: string;
  points: number;
  collected?: boolean;
}

interface PowerUp {
  type: 'shield' | 'double' | 'slow';
  duration: number;
  active: boolean;
}

const goodPractices = [
  { icon: '🔒', text: 'Strong Password', points: 10 },
  { icon: '🔄', text: 'Software Update', points: 15 },
  { icon: '🛡️', text: 'Antivirus Scan', points: 20 },
  { icon: '📧', text: 'Email Verification', points: 10 },
  { icon: '🔐', text: '2FA Token', points: 25 },
  { icon: '💾', text: 'Data Backup', points: 15 },
  { icon: '🔍', text: 'Security Audit', points: 30 },
  { icon: '📱', text: 'Secure App', points: 10 }
];

const badThreats = [
  { icon: '🦠', text: 'Malware', points: -20 },
  { icon: '📧', text: 'Phishing Email', points: -15 },
  { icon: '🔓', text: 'Weak Password', points: -10 },
  { icon: '⚠️', text: 'Security Warning', points: -25 },
  { icon: '🎯', text: 'Social Engineering', points: -30 },
  { icon: '💳', text: 'Credit Card Scam', points: -20 },
  { icon: '🕳️', text: 'Security Hole', points: -15 },
  { icon: '🎪', text: 'Fake Website', points: -10 }
];

const powerUps = [
  { icon: '🛡️', type: 'shield', points: 0 },
  { icon: '⚡', type: 'double', points: 0 },
  { icon: '🐌', type: 'slow', points: 0 }
];

const CyberHygieneRunner = () => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerY, setPlayerY] = useState(200);
  const [objects, setObjects] = useState<GameObject[]>([]);
  const [gameSpeed, setGameSpeed] = useState(2);
  const [distance, setDistance] = useState(0);
  const [powerUps, setPowerUps] = useState<PowerUp>({
    type: 'shield',
    duration: 0,
    active: false
  });
  const [keys, setKeys] = useState({ up: false, down: false });
  const [objectId, setObjectId] = useState(1);

  const GAME_HEIGHT = 400;
  const PLAYER_SIZE = 40;
  const OBJECT_SIZE = 30;

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setKeys(prev => ({ ...prev, up: true }));
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setKeys(prev => ({ ...prev, down: true }));
      }
      if (e.key === ' ') {
        e.preventDefault();
        toggleGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setKeys(prev => ({ ...prev, up: false }));
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setKeys(prev => ({ ...prev, down: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Player movement
  useEffect(() => {
    if (!gameRunning) return;

    const movePlayer = () => {
      setPlayerY(prev => {
        let newY = prev;
        if (keys.up) newY -= 4;
        if (keys.down) newY += 4;
        return Math.max(0, Math.min(GAME_HEIGHT - PLAYER_SIZE, newY));
      });
    };

    const interval = setInterval(movePlayer, 16);
    return () => clearInterval(interval);
  }, [keys, gameRunning]);

  // Spawn objects
  const spawnObject = useCallback(() => {
    const rand = Math.random();
    let type: 'good' | 'bad' | 'power';
    let item;

    if (rand < 0.1) { // 10% power-ups
      type = 'power';
      item = powerUps[Math.floor(Math.random() * powerUps.length)];
    } else if (rand < 0.65) { // 55% good practices
      type = 'good';
      item = goodPractices[Math.floor(Math.random() * goodPractices.length)];
    } else { // 35% threats
      type = 'bad';
      item = badThreats[Math.floor(Math.random() * badThreats.length)];
    }

    const newObject: GameObject = {
      id: objectId,
      x: 800,
      y: Math.random() * (GAME_HEIGHT - OBJECT_SIZE),
      type,
      icon: item.icon,
      points: item.points
    };

    setObjects(prev => [...prev, newObject]);
    setObjectId(prev => prev + 1);
  }, [objectId]);

  // Game loop
  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const gameLoop = setInterval(() => {
      // Move objects
      setObjects(prev => prev.map(obj => ({
        ...obj,
        x: obj.x - gameSpeed
      })).filter(obj => obj.x > -OBJECT_SIZE));

      // Spawn new objects
      if (Math.random() < 0.02 + (gameSpeed * 0.003)) {
        spawnObject();
      }

      // Increase game speed and distance
      setGameSpeed(prev => Math.min(8, prev + 0.001));
      setDistance(prev => prev + 1);

      // Update power-ups
      setPowerUps(prev => ({
        ...prev,
        duration: Math.max(0, prev.duration - 16),
        active: prev.duration > 0
      }));

    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameRunning, gameOver, gameSpeed, spawnObject]);

  // Collision detection
  useEffect(() => {
    if (!gameRunning) return;

    objects.forEach(obj => {
      if (obj.collected) return;

      const playerLeft = 50;
      const playerRight = playerLeft + PLAYER_SIZE;
      const playerTop = playerY;
      const playerBottom = playerTop + PLAYER_SIZE;

      const objLeft = obj.x;
      const objRight = obj.x + OBJECT_SIZE;
      const objTop = obj.y;
      const objBottom = obj.y + OBJECT_SIZE;

      // Check collision
      if (playerRight > objLeft && playerLeft < objRight && 
          playerBottom > objTop && playerTop < objBottom) {
        
        // Mark as collected
        setObjects(prev => prev.map(o => 
          o.id === obj.id ? { ...o, collected: true } : o
        ));

        if (obj.type === 'good') {
          const points = obj.points * (powerUps.active && powerUps.type === 'double' ? 2 : 1);
          setScore(prev => prev + points);
          toast.success(`+${points} Cyber Hygiene!`);
        } else if (obj.type === 'bad') {
          if (powerUps.active && powerUps.type === 'shield') {
            toast.info("Shield protected you!");
          } else {
            setScore(prev => Math.max(0, prev + obj.points));
            setLives(prev => prev - 1);
            toast.error(`${obj.points} points! Watch out!`);
          }
        } else if (obj.type === 'power') {
          const powerType = obj.icon === '🛡️' ? 'shield' : obj.icon === '⚡' ? 'double' : 'slow';
          setPowerUps({
            type: powerType,
            duration: 5000,
            active: true
          });
          toast.success(`Power-up activated: ${powerType}!`);
        }
      }
    });
  }, [objects, playerY, gameRunning, powerUps]);

  // Game over check
  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
      setGameRunning(false);
      toast.error(`Game Over! Final Score: ${score}`);
    }
  }, [lives, score]);

  const toggleGame = () => {
    if (gameOver) {
      restartGame();
    } else {
      setGameRunning(!gameRunning);
    }
  };

  const restartGame = () => {
    setScore(0);
    setLives(3);
    setGameRunning(false);
    setGameOver(false);
    setPlayerY(200);
    setObjects([]);
    setGameSpeed(2);
    setDistance(0);
    setPowerUps({ type: 'shield', duration: 0, active: false });
    setObjectId(1);
  };

  return (
    <GameLayout title="Cyber Hygiene Runner" score={score} onRestart={restartGame}>
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card p-4 text-center">
            <Heart className="h-6 w-6 text-destructive mx-auto mb-2" />
            <div className="text-xl font-cyber font-bold text-destructive">{lives}</div>
            <div className="text-xs text-muted-foreground">Lives</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <div className="text-xl font-cyber font-bold text-primary">{Math.floor(distance / 60)}m</div>
            <div className="text-xs text-muted-foreground">Distance</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <Zap className="h-6 w-6 text-accent mx-auto mb-2" />
            <div className="text-xl font-cyber font-bold text-accent">{gameSpeed.toFixed(1)}x</div>
            <div className="text-xs text-muted-foreground">Speed</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            {powerUps.active && (
              <div className="flex items-center justify-center space-x-1">
                <Shield className="h-4 w-4 text-secondary" />
                <span className="text-sm font-cyber text-secondary">
                  {Math.ceil(powerUps.duration / 1000)}s
                </span>
              </div>
            )}
            {!powerUps.active && (
              <div className="text-sm text-muted-foreground">No Power-up</div>
            )}
          </Card>
        </div>

        {/* Game Area */}
        <Card className="glass-card p-4">
          <div 
            className="relative bg-gradient-to-r from-card/30 to-card/50 rounded-lg overflow-hidden border border-primary/20"
            style={{ height: GAME_HEIGHT }}
          >
            {/* Background grid effect */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="absolute border-l border-primary/20"
                  style={{ left: `${i * 5}%`, height: '100%' }}
                />
              ))}
            </div>

            {/* Player */}
            <div
              className="absolute bg-primary/80 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-primary transition-all duration-75"
              style={{
                left: 50,
                top: playerY,
                width: PLAYER_SIZE,
                height: PLAYER_SIZE,
                boxShadow: '0 0 20px hsl(var(--primary) / 0.5)'
              }}
            >
              🏃
            </div>

            {/* Game Objects */}
            {objects.map(obj => (
              <div
                key={obj.id}
                className={`absolute rounded-lg flex items-center justify-center text-lg border-2 transition-all ${
                  obj.type === 'good' ? 'bg-secondary/80 border-secondary' :
                  obj.type === 'bad' ? 'bg-destructive/80 border-destructive' :
                  'bg-accent/80 border-accent'
                } ${obj.collected ? 'opacity-0' : 'opacity-100'}`}
                style={{
                  left: obj.x,
                  top: obj.y,
                  width: OBJECT_SIZE,
                  height: OBJECT_SIZE,
                  boxShadow: obj.type === 'good' ? '0 0 15px hsl(var(--secondary) / 0.5)' :
                           obj.type === 'bad' ? '0 0 15px hsl(var(--destructive) / 0.5)' :
                           '0 0 15px hsl(var(--accent) / 0.5)'
                }}
              >
                {obj.icon}
              </div>
            ))}

            {/* Game Over / Start Screen */}
            {(!gameRunning || gameOver) && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <div className="text-center space-y-4">
                  {gameOver ? (
                    <>
                      <h2 className="text-3xl font-cyber font-bold text-destructive">Game Over!</h2>
                      <p className="text-muted-foreground">
                        Distance: {Math.floor(distance / 60)}m | Score: {score}
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-3xl font-cyber font-bold text-primary">Cyber Hygiene Runner</h2>
                      <p className="text-muted-foreground">Collect good practices, avoid threats!</p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Use ↑/↓ or W/S to move</p>
                        <p>Spacebar to pause/resume</p>
                      </div>
                    </>
                  )}
                  <Button onClick={toggleGame} className="cyber-button">
                    {gameOver ? (
                      <><RotateCcw className="mr-2 h-5 w-5" /> Play Again</>
                    ) : (
                      <><Play className="mr-2 h-5 w-5" /> Start Game</>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Pause indicator */}
            {!gameRunning && !gameOver && distance > 0 && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                <Badge variant="outline" className="border-accent/50 text-accent">
                  <Pause className="mr-1 h-3 w-3" />
                  Paused
                </Badge>
              </div>
            )}
          </div>
        </Card>

        {/* Controls Info */}
        <Card className="glass-card p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
            <div>
              <span className="text-secondary font-semibold">Good Practices:</span>
              <p className="text-muted-foreground">Collect for points and cyber hygiene!</p>
            </div>
            <div>
              <span className="text-destructive font-semibold">Threats:</span>
              <p className="text-muted-foreground">Avoid to prevent damage and point loss!</p>
            </div>
            <div>
              <span className="text-accent font-semibold">Power-ups:</span>
              <p className="text-muted-foreground">Shield, Double Points, Slow Motion</p>
            </div>
          </div>
        </Card>
      </div>
    </GameLayout>
  );
};

export default CyberHygieneRunner;