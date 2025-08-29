import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Key,
  Wifi,
  UserCheck,
  DoorOpen,
  Zap,
  Shield,
  Bug,
  GlobeLock,
  FileText,
  AlertCircle,
  Eye
} from "lucide-react";

const games = [
  {
    icon: Search,
    title: "Phishing Detective",
    description: "Spot fake emails and protect yourself from phishing attacks",
    difficulty: "Beginner",
    players: "2.3K",
    color: "text-primary"
  },
  {
    icon: Key,
    title: "Password Fortress",
    description: "Build unbreakable passwords and defend against hackers",
    difficulty: "Intermediate",
    players: "1.8K",
    color: "text-secondary"
  },
  {
    icon: Wifi,
    title: "Wi-Fi Defender",
    description: "Tower defense against network intrusions and malware",
    difficulty: "Advanced",
    players: "3.1K",
    color: "text-accent"
  },
  {
    icon: UserCheck,
    title: "Spot the Hacker",
    description: "Identify suspicious behavior and social engineering",
    difficulty: "Intermediate",
    players: "1.5K",
    color: "text-primary"
  },
  {
    icon: DoorOpen,
    title: "Cyber Escape Room",
    description: "Solve cybersecurity puzzles to escape digital traps",
    difficulty: "Advanced",
    players: "2.7K",
    color: "text-secondary"
  },
  {
    icon: Zap,
    title: "Cyber Hygiene Runner",
    description: "Endless runner collecting cybersecurity best practices",
    difficulty: "Beginner",
    players: "4.2K",
    color: "text-accent"
  },
  // Six new games below:
  {
    icon: Shield,
    title: "Firewall Builder",
    description: "Configure firewall rules to stop cyber threats in real time.",
    difficulty: "Intermediate",
    players: "1.1K",
    color: "text-primary"
  },
  {
    icon: Bug,
    title: "Vulnerability Hunter",
    description: "Scan systems, find bugs, and patch vulnerabilities before they're exploited.",
    difficulty: "Advanced",
    players: "900",
    color: "text-accent"
  },
  {
    icon: GlobeLock,
    title: "Penetration Tester Pro",
    description: "Simulate ethical hacking attacks and identify weak points on diverse targets.",
    difficulty: "Expert",
    players: "620",
    color: "text-secondary"
  },
  {
    icon: FileText,
    title: "CyberSecurity & Digital Forensics Lab",
    description: "Analyze files and trace digital evidence to solve cyber crimes.",
    difficulty: "Advanced",
    players: "2K",
    color: "text-accent"
  },
  {
    icon: AlertCircle,
    title: "Incident Response Command",
    description: "Respond to security breaches, contain threats, and restore systems.",
    difficulty: "Expert",
    players: "1.3K",
    color: "text-primary"
  },
  {
    icon: Eye,
    title: "Social Engineering Simulator",
    description: "Test defenses against phishing, pretexting, and impersonation attacks.",
    difficulty: "Intermediate",
    players: "730",
    color: "text-secondary"
  }
];

const gameRoutes = [
  "/games/phishing-detective",
  "/games/password-fortress",
  "/games/wifi-defender",
  "/games/spot-the-hacker",
  "/games/cyber-escape-room",
  "/games/cyber-hygiene-runner",
  "/games/firewall-builder",
  "/games/vulnerability-hunter",
  "/games/penetration-tester-pro",
  "/games/digital-forensics-lab",
  "/games/incident-response-command",
  "/games/social-engineering-simulator"
];

const GameFeatures = () => {
  const navigate = useNavigate();
  return (
    <section id="games" className="py-20 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-cyber font-bold neon-text mb-6">
            Choose Your Challenge
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Twelve immersive mini-games designed to teach cybersecurity and ethical hacking through engaging gameplay.
          </p>
        </div>
        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <div
              key={game.title}
              className="game-card group relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Game Icon */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <game.icon className={`h-12 w-12 ${game.color} group-hover:animate-glow-pulse`} />
                  <div className={`absolute -inset-2 ${game.color.replace('text-', 'bg-')}/20 rounded-full blur-lg group-hover:blur-xl transition-all`}></div>
                </div>
              </div>
              {/* Game Info */}
              <div className="space-y-4">
                <h3 className="text-2xl font-cyber font-bold text-foreground">
                  {game.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {game.description}
                </p>
                {/* Game Stats */}
                <div className="flex items-center justify-between text-sm">
                  <span className={`px-3 py-1 rounded-full border ${game.color} ${game.color.replace('text-', 'border-')}/30 ${game.color.replace('text-', 'bg-')}/10`}>
                    {game.difficulty}
                  </span>
                  <span className="text-muted-foreground">
                    {game.players} players
                  </span>
                </div>
                {/* Play Button */}
                <Button
                  className="w-full cyber-button group-hover:scale-105"
                  onClick={() => navigate(gameRoutes[index])}
                >
                  Play Now
                </Button>
              </div>
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default GameFeatures;
