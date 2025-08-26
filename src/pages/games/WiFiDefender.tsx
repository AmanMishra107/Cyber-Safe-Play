import { useState, useEffect, useCallback } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, Shield, Zap, AlertTriangle, Target } from "lucide-react";
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
  firewall: { damage: 20, range: 80, cost: 100, cooldown: 1000, color: 'text-primary', icon: Shield },
  antivirus: { damage: 35, range: 60, cost: 150, cooldown: 800, color: 'text-secondary', icon: Zap },
  encryption: { damage: 50, range: 100, cost: 200, cooldown: 1200, color: 'text-accent', icon: Target }
};

const enemyTypes = {
  malware: { health: 50, speed: 2, reward: 20, color: 'bg-red-500' },
  virus: { health: 80, speed: 1.5, reward: 30, color: 'bg-orange-500' },
  trojan: { health: 120, speed: 1, reward: 50, color: 'bg-purple-500' },
  ransomware: { health: 200, speed: 0.8, reward: 100, color: 'bg-red-800' }
};

// Simple path for enemies to follow
const path: Position[] = [
  { x: 0, y: 200 },
  { x: 150, y: 200 },
  { x: 150, y: 100 },
  { x: 300, y: 100 },
  { x: 300, y: 300 },
  { x: 450, y: 300 },
  { x: 450, y: 150 },
  { x: 600, y: 150 }
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
  const [gameOver, setGameOver] = useState(false);
  const [enemySpawnTimer, setEnemySpawnTimer] = useState(0);
  const [towerId, setTowerId] = useState(1);
  const [enemyId, setEnemyId] = useState(1);

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
    const towerType = towerTypes[selectedTowerType];
    
    if (money < towerType.cost) {
      toast.error("Not enough money!");
      return;
    }

    // Check if position is too close to path or other towers
    const tooCloseToPath = path.some(pathPoint => 
      Math.hypot(x - pathPoint.x, y - pathPoint.y) < 40
    );
    
    const tooCloseToTower = towers.some(tower =>
      Math.hypot(x - tower.x, y - tower.y) < 50
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
    if (!gameRunning || gameOver) return;

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
  }, [gameRunning, gameOver, towers, enemies, wave, enemySpawnTimer, spawnEnemy]);

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
    toast.success("Defend your network!");
  };

  const restartGame = () => {
    setScore(0);
    setMoney(500);
    setHealth(100);
    setWave(1);
    setTowers([]);
    setEnemies([]);
    setGameRunning(false);
    setGameOver(false);
    setEnemySpawnTimer(0);
    setTowerId(1);
    setEnemyId(1);
  };

  return (
    <GameLayout title="Wi-Fi Defender" score={score} onRestart={restartGame}>
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card p-4 text-center">
            <div className="text-lg font-cyber font-bold text-primary">${money}</div>
            <div className="text-xs text-muted-foreground">Money</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <div className="text-lg font-cyber font-bold text-secondary">{health}/100</div>
            <div className="text-xs text-muted-foreground">Network Health</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <div className="text-lg font-cyber font-bold text-accent">{wave}</div>
            <div className="text-xs text-muted-foreground">Wave</div>
          </Card>
          <Card className="glass-card p-4 text-center">
            <div className="text-lg font-cyber font-bold text-primary">{enemies.length}</div>
            <div className="text-xs text-muted-foreground">Threats</div>
          </Card>
        </div>

        {/* Tower Selection */}
        <Card className="glass-card p-4">
          <h3 className="font-cyber font-bold mb-3">Select Defense System</h3>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(towerTypes).map(([type, config]) => (
              <Button
                key={type}
                variant={selectedTowerType === type ? "default" : "outline"}
                onClick={() => setSelectedTowerType(type as keyof typeof towerTypes)}
                className={selectedTowerType === type ? "cyber-button" : "border-primary/50"}
                disabled={money < config.cost}
              >
                <config.icon className="mr-1 h-4 w-4" />
                {type} (${config.cost})
              </Button>
            ))}
          </div>
        </Card>

        {/* Game Board */}
        <Card className="glass-card p-4">
          <div className="relative bg-card/30 rounded-lg overflow-hidden" style={{ height: '400px', width: '100%' }}>
            {/* Path */}
            <svg className="absolute inset-0 w-full h-full">
              <polyline
                points={path.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeOpacity="0.3"
              />
            </svg>

            {/* Towers */}
            {towers.map(tower => {
              const TowerIcon = towerTypes[tower.type].icon;
              return (
                <div
                  key={tower.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: tower.x, top: tower.y }}
                >
                  <div className={`w-8 h-8 rounded-full glass-card flex items-center justify-center ${towerTypes[tower.type].color}`}>
                    <TowerIcon className="h-4 w-4" />
                  </div>
                  {/* Range indicator when selected */}
                  <div 
                    className="absolute border border-primary/20 rounded-full pointer-events-none"
                    style={{
                      width: tower.range * 2,
                      height: tower.range * 2,
                      left: -tower.range,
                      top: -tower.range
                    }}
                  />
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
                <div className={`w-6 h-6 rounded-full ${enemyTypes[enemy.type].color} border border-white`}>
                  <div 
                    className="h-1 bg-red-500 mt-6"
                    style={{ width: `${(enemy.health / enemy.maxHealth) * 24}px` }}
                  />
                </div>
              </div>
            ))}

            {/* Click handler for placing towers */}
            <div
              className="absolute inset-0 cursor-crosshair"
              onClick={(e) => {
                if (!gameRunning) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                placeTower(x, y);
              }}
            />
          </div>
        </Card>

        {/* Game Controls */}
        <div className="flex justify-center">
          {!gameRunning && !gameOver ? (
            <Button onClick={startGame} className="cyber-button">
              <Wifi className="mr-2 h-5 w-5" />
              Start Defense
            </Button>
          ) : gameOver ? (
            <div className="text-center">
              <p className="text-destructive mb-4">Network Compromised!</p>
              <Button onClick={restartGame} className="cyber-button">
                Rebuild Network
              </Button>
            </div>
          ) : (
            <Badge variant="outline" className="border-secondary/50 text-secondary px-4 py-2">
              Defending Network...
            </Badge>
          )}
        </div>
      </div>
    </GameLayout>
  );
};

export default WiFiDefender;