import { Button } from "@/components/ui/button";
import { Play, Users, Trophy, Shield } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="container mx-auto text-center">
        {/* Hero Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-cyber font-black neon-text animate-cyber-float">
              Play. Learn.
              <br />
              <span className="text-secondary animate-neon-flicker">Stay Secure.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Master cybersecurity through fun, interactive mini-games. 
              <br />
              <span className="text-primary font-semibold">Gamified learning for everyone.</span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="cyber-button text-lg py-6 px-8 group">
              <Play className="mr-2 h-5 w-5 group-hover:animate-spin" />
              Start Playing Now
            </Button>
            <Button variant="outline" className="text-lg py-6 px-8 border-primary/50 text-primary hover:bg-primary/10">
              <Shield className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12">
            <div className="glass-card p-6">
              <div className="flex items-center justify-center mb-3">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-cyber font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Active Players</div>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center justify-center mb-3">
                <Trophy className="h-8 w-8 text-secondary" />
              </div>
              <div className="text-3xl font-cyber font-bold text-secondary">50K+</div>
              <div className="text-sm text-muted-foreground">Games Played</div>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center justify-center mb-3">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-cyber font-bold text-primary">95%</div>
              <div className="text-sm text-muted-foreground">Threat Detection</div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-1/4 left-10 w-20 h-20 border border-primary/30 rounded-full animate-cyber-float opacity-30"></div>
          <div className="absolute top-1/3 right-10 w-16 h-16 border border-secondary/30 rounded-full animate-cyber-float opacity-30" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/4 w-12 h-12 border border-accent/30 rounded-full animate-cyber-float opacity-30" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;