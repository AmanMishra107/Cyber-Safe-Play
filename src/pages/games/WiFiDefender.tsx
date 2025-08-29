import { useState, useEffect, useCallback } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, Shield, Zap, AlertTriangle, Target, Pause, Play } from "lucide-react";
import { toast } from "sonner";

interface Position {
  x: number;
  y: number;
}

interface Tower {
  id: number;
  x: number;
  y: number;
  type: 'firewall' | 'antivirus' | 'encryption';
  damage: number;
  range: number;
  cost: number;
  cooldown: number;
  lastShot: number;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  speed: number;
  type: 'malware' | 'virus' | 'trojan' | 'ransomware';
  reward: number;
  pathIndex: number;
}

const towerTypes = {
  firewall: { damage: 20, range: 60, cost: 100, cooldown: 1000, color: 'text-primary', icon: Shield },
  antivirus: { damage: 35, range: 50, cost: 150, cooldown: 800, color: 'text-secondary', icon: Zap },
  encryption: { damage: 50, range: 80, cost: 200, cooldown: 1200, color: 'text-accent', icon: Target }
};

const enemyTypes = {
  malware: { health: 50, speed: 1.8, reward: 20, color: 'bg-red-500' },
  virus: { health: 80, speed: 1.3, reward: 30, color: 'bg-orange-500' },
  trojan: { health: 120, speed: 0.9, reward: 50, color: 'bg-purple-500' },
  ransomware: { health: 200, speed: 0.7, reward: 100, color: 'bg-red-800' }
};

// Optimized path for mobile screens
const path: Position[] = [
  { x: 20, y: 160 },
  { x: 120, y: 160 },
  { x: 120, y: 80 },
  { x: 220, y: 80 },
  { x: 220, y: 200 },
  { x: 320, y: 200 },
  { x: 320, y: 120 },
  { x: 400, y: 120 }
];

const WiFiDefender = () => {
  const [score, setScore] = useState(0);
  const [money, setMoney] = useState(500);
  const [health, setHealth] = useState(100);
  const [wave, setWave] = useState(1);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [selectedTowerType, setSelectedTowerType] = useState<keyof typeof towerTypes>('firewall');
  const [gameRunning, setGameRunning] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [enemySpawnTimer, setEnemySpawnTimer] = useState(0);
  const [towerId, setTowerId] = useState(1);
  const [enemyId, setEnemyId] = useState(1);
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);

  const spawnEnemy = useCallback(() => {
    const types = Object.keys(enemyTypes) as Array<keyof typeof enemyTypes>;
    const type = types[Math.floor(Math.random() * types.length)];
    const enemyType = enemyTypes[type];

    const newEnemy: Enemy = {
      id: enemyId,
      x: path[0].x,
      y: path[0].y,
      health: enemyType.health + (wave * 10),
      maxHealth: enemyType.health + (wave * 10),
      speed: enemyType.speed,
      type,
      reward: enemyType.reward,
      pathIndex: 0
    };

    setEnemies(prev => [...prev, newEnemy]);
    setEnemyId(prev => prev + 1);
  }, [enemyId, wave]);

  const placeTower = (x: number, y: number) => {
    if (gamePaused || !gameRunning) return;

    const towerType = towerTypes[selectedTowerType];

    if (money < towerType.cost) {
      toast.error("Not enough money!");
      return;
    }

    // Check if position is too close to path or other towers - adjusted for mobile
    const tooCloseToPath = path.some(pathPoint =>
      Math.hypot(x - pathPoint.x, y - pathPoint.y) < 35
    );

    const tooCloseToTower = towers.some(tower =>
      Math.hypot(x - tower.x, y - tower.y) < 45
    );

    if (tooCloseToPath || tooCloseToTower) {
      toast.error("Can't place tower here!");
      return;
    }

    const newTower: Tower = {
      id: towerId,
      x,
      y,
      type: selectedTowerType,
      damage: towerType.damage,
      range: towerType.range,
      cost: towerType.cost,
      cooldown: towerType.cooldown,
      lastShot: 0
    };

    setTowers(prev => [...prev, newTower]);
    setMoney(prev => prev - towerType.cost);
    setTowerId(prev => prev + 1);
    toast.success(`${selectedTowerType} placed!`);
  };

  const gameLoop = useCallback(() => {
    if (!gameRunning || gameOver || gamePaused) return;

    const now = Date.now();

    // Move enemies
    setEnemies(prev => prev.map(enemy => {
      const currentTarget = path[enemy.pathIndex + 1];
      if (!currentTarget) {
        // Enemy reached the end
        setHealth(h => Math.max(0, h - 10));
        return null;
      }

      const dx = currentTarget.x - enemy.x;
      const dy = currentTarget.y - enemy.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 5) {
        return { ...enemy, pathIndex: enemy.pathIndex + 1 };
      }

      const moveX = (dx / distance) * enemy.speed;
      const moveY = (dy / distance) * enemy.speed;

      return {
        ...enemy,
        x: enemy.x + moveX,
        y: enemy.y + moveY
      };
    }).filter(Boolean) as Enemy[]);

    // Tower shooting
    setEnemies(prevEnemies => {
      let updatedEnemies = [...prevEnemies];

      towers.forEach(tower => {
        if (now - tower.lastShot < tower.cooldown) return;

        const enemiesInRange = updatedEnemies.filter(enemy => {
          const distance = Math.hypot(enemy.x - tower.x, enemy.y - tower.y);
          return distance <= tower.range && enemy.health > 0;
        });

        if (enemiesInRange.length > 0) {
          const target = enemiesInRange[0];
          const enemyIndex = updatedEnemies.findIndex(e => e.id === target.id);

          if (enemyIndex !== -1) {
            updatedEnemies[enemyIndex] = {
              ...updatedEnemies[enemyIndex],
              health: Math.max(0, updatedEnemies[enemyIndex].health - tower.damage)
            };

            tower.lastShot = now;
          }
        }
      });

      // Remove dead enemies and award money
      const deadEnemies = updatedEnemies.filter(e => e.health <= 0);
      deadEnemies.forEach(enemy => {
        setMoney(prev => prev + enemy.reward);
        setScore(prev => prev + enemy.reward);
      });

      return updatedEnemies.filter(e => e.health > 0);
    });

    // Spawn new enemies
    if (enemySpawnTimer <= 0 && enemies.length < wave * 2) {
      spawnEnemy();
      setEnemySpawnTimer(120 - (wave * 5));
    } else {
      setEnemySpawnTimer(prev => Math.max(0, prev - 1));
    }

    // Check wave completion
    if (enemies.length === 0 && enemySpawnTimer <= 0) {
      setWave(prev => prev + 1);
      setMoney(prev => prev + 100);
      toast.success(`Wave ${wave} complete! +100 bonus`);
      setEnemySpawnTimer(180);
    }
  }, [gameRunning, gameOver, gamePaused, towers, enemies, wave, enemySpawnTimer, spawnEnemy]);

  useEffect(() => {
    if (health <= 0) {
      setGameOver(true);
      setGameRunning(false);
      toast.error("Network Compromised! Game Over");
    }
  }, [health]);

  useEffect(() => {
    const interval = setInterval(gameLoop, 16); // ~60fps
    return () => clearInterval(interval);
  }, [gameLoop]);

  const startGame = () => {
    setGameRunning(true);
    setGamePaused(false);
    toast.success("Defend your network!");
  };

  const togglePause = () => {
    setGamePaused(!gamePaused);
    toast.info(gamePaused ? "Game resumed" : "Game paused");
  };

  const restartGame = () => {
    setScore(0);
    setMoney(500);
    setHealth(100);
    setWave(1);
    setTowers([]);
    setEnemies([]);
    setGameRunning(false);
    setGamePaused(false);
    setGameOver(false);
    setEnemySpawnTimer(0);
    setTowerId(1);
    setEnemyId(1);
    setSelectedTower(null);
  };

  return (
    <GameLayout title="Wi-Fi Defender" score={score} onRestart={restartGame}>
      <div className="max-w-full mx-auto space-y-3 px-2 sm:px-4">
        {/* Game Stats - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <Card className="glass-card p-2 sm:p-4 text-center">
            <div className="text-sm sm:text-lg font-cyber font-bold text-primary">${money}</div>
            <div className="text-xs text-muted-foreground">Money</div>
          </Card>
          <Card className="glass-card p-2 sm:p-4 text-center">
            <div className="text-sm sm:text-lg font-cyber font-bold text-secondary">{health}/100</div>
            <div className="text-xs text-muted-foreground">Health</div>
          </Card>
          <Card className="glass-card p-2 sm:p-4 text-center">
            <div className="text-sm sm:text-lg font-cyber font-bold text-accent">{wave}</div>
            <div className="text-xs text-muted-foreground">Wave</div>
          </Card>
          <Card className="glass-card p-2 sm:p-4 text-center">
            <div className="text-sm sm:text-lg font-cyber font-bold text-primary">{enemies.length}</div>
            <div className="text-xs text-muted-foreground">Threats</div>
          </Card>
        </div>

        {/* Tower Selection - Mobile Optimized */}
        <Card className="glass-card p-3 sm:p-4">
          <h3 className="font-cyber font-bold mb-2 text-sm sm:text-base">Defense Systems</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {Object.entries(towerTypes).map(([type, config]) => (
              <Button
                key={type}
                variant={selectedTowerType === type ? "default" : "outline"}
                onClick={() => setSelectedTowerType(type as keyof typeof towerTypes)}
                className={`h-8 sm:h-10 text-xs sm:text-sm ${selectedTowerType === type ? "cyber-button" : "border-primary/50"}`}
                disabled={money < config.cost}
              >
                <config.icon className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                {type} (${config.cost})
              </Button>
            ))}
          </div>
        </Card>

        {/* Game Controls - Mobile First */}
        <div className="flex justify-center items-center space-x-2">
          {!gameRunning && !gameOver ? (
            <Button onClick={startGame} className="cyber-button h-10 sm:h-12">
              <Wifi className="mr-2 h-4 w-4" />
              Start Defense
            </Button>
          ) : gameOver ? (
            <div className="text-center">
              <p className="text-destructive mb-2 text-sm">Network Compromised!</p>
              <Button onClick={restartGame} className="cyber-button h-10">
                Rebuild Network
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button onClick={togglePause} variant="outline" size="sm">
                {gamePaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <Badge variant="outline" className="border-secondary/50 text-secondary px-3 py-1">
                {gamePaused ? "Paused" : "Defending..."}
              </Badge>
            </div>
          )}
        </div>

        {/* Game Board - Mobile Optimized */}
        <Card className="glass-card p-2 sm:p-4">
          <div
            className="relative bg-card/30 rounded-lg overflow-hidden mx-auto"
            style={{
              height: '280px',
              width: '100%',
              maxWidth: '420px',
              touchAction: 'manipulation'
            }}
          >
            {/* Path */}
            <svg className="absolute inset-0 w-full h-full">
              <polyline
                points={path.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeOpacity="0.4"
              />
            </svg>

            {/* Towers */}
            {towers.map(tower => {
              const TowerIcon = towerTypes[tower.type].icon;
              const isSelected = selectedTower?.id === tower.id;
              return (
                <div
                  key={tower.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ left: tower.x, top: tower.y }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTower(selectedTower?.id === tower.id ? null : tower);
                  }}
                >
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full glass-card flex items-center justify-center ${towerTypes[tower.type].color} ${isSelected ? 'ring-2 ring-primary' : ''}`}>
                    <TowerIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  {/* Range indicator when selected */}
                  {isSelected && (
                    <div
                      className="absolute border border-primary/30 rounded-full pointer-events-none animate-pulse"
                      style={{
                        width: tower.range * 2,
                        height: tower.range * 2,
                        left: -tower.range,
                        top: -tower.range
                      }}
                    />
                  )}
                </div>
              );
            })}

            {/* Enemies */}
            {enemies.map(enemy => (
              <div
                key={enemy.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: enemy.x, top: enemy.y }}
              >
                <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${enemyTypes[enemy.type].color} border border-white`}>
                  {/* Health bar */}
                  <div
                    className="h-1 bg-green-500 mt-4 sm:mt-5 rounded-full transition-all duration-200"
                    style={{
                      width: `${(enemy.health / enemy.maxHealth) * (16)}px`,
                      backgroundColor: enemy.health < enemy.maxHealth * 0.3 ? '#ef4444' :
                        enemy.health < enemy.maxHealth * 0.6 ? '#f59e0b' : '#10b981'
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Click handler for placing towers */}
            <div
              className="absolute inset-0 cursor-crosshair"
              onClick={(e) => {
                if (!gameRunning || gamePaused) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                placeTower(x, y);
              }}
            />
          </div>
        </Card>

        {/* Tower Info Panel - Shows when tower selected */}
        {selectedTower && (
          <Card className="glass-card p-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm capitalize">{selectedTower.type}</h4>
                <div className="text-xs text-muted-foreground space-x-2">
                  <span>Damage: {selectedTower.damage}</span>
                  <span>Range: {selectedTower.range}</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedTower(null)}
                className="h-8"
              >
                Close
              </Button>
            </div>
          </Card>
        )}
      </div>

      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 640px) {
          .container {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }

        /* Smooth animations for mobile */
        * {
          -webkit-tap-highlight-color: transparent;
        }

        .cyber-button {
          background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%);
          border: none;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .cyber-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(var(--primary-rgb), 0.4);
        }
      `}</style>
    </GameLayout>
  );
};

export default WiFiDefender;
