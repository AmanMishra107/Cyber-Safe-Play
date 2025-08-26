import { TrendingUp, Shield, Award, Globe } from "lucide-react";

const stats = [
  {
    icon: Shield,
    value: "95%",
    label: "of cyber breaches start with phishing",
    color: "text-primary"
  },
  {
    icon: TrendingUp,
    value: "4B+",
    label: "malicious emails sent daily",
    color: "text-secondary"
  },
  {
    icon: Award,
    value: "68%",
    label: "of users reuse passwords",
    color: "text-accent"
  },
  {
    icon: Globe,
    value: "$6T",
    label: "global cybercrime damages by 2025",
    color: "text-primary"
  }
];

const StatsSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-background to-card/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-cyber font-bold neon-text mb-6">
            Why Cybersecurity Matters
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The digital world is under constant threat. Knowledge is your best defense.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="glass-card p-8 text-center group hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <stat.icon className={`h-12 w-12 ${stat.color} group-hover:animate-glow-pulse`} />
                  <div className={`absolute -inset-3 ${stat.color.replace('text-', 'bg-')}/20 rounded-full blur-lg group-hover:blur-xl transition-all`}></div>
                </div>
              </div>
              
              <div className={`text-4xl font-cyber font-black ${stat.color} mb-2 group-hover:animate-neon-flicker`}>
                {stat.value}
              </div>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="glass-card p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-cyber font-bold text-secondary mb-4">
              🎮 Learning Through Gaming Works
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              Studies show that interactive learning increases retention by <span className="text-primary font-bold">75%</span> compared to traditional methods.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-cyber font-bold text-primary">90%</div>
                <div className="text-sm text-muted-foreground">Better retention</div>
              </div>
              <div>
                <div className="text-3xl font-cyber font-bold text-secondary">5x</div>
                <div className="text-sm text-muted-foreground">Faster learning</div>
              </div>
              <div>
                <div className="text-3xl font-cyber font-bold text-accent">100%</div>
                <div className="text-sm text-muted-foreground">More engaging</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;