import React, { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  Shield,
  Award,
  Globe,
  AlertTriangle,
  Eye,
  Brain,
  Lock,
  DollarSign,
  Clock,
  Target,
  Zap,
  Users,
  Database,
  Server,
  Wifi,
  Bug,
  Activity,
  BarChart3,
  TrendingDown,
  AlertCircle
} from "lucide-react";

const primaryStats = [
  {
    icon: DollarSign,
    value: "$10.5T",
    label: "Global cybercrime damages by 2025",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    detail: "Growing 10% year-over-year",
    source: "CompTIA 2025",
    trend: "+15%"
  },
  {
    icon: Shield,
    value: "131",
    label: "new vulnerabilities discovered daily",
    color: "text-primary",
    bgColor: "bg-primary/10",
    detail: "Up from 113 in 2024",
    source: "CVE Database 2025",
    trend: "+16%"
  },
  {
    icon: AlertTriangle,
    value: "83%",
    label: "of data breaches are external attacks",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    detail: "Verizon DBIR 2024",
    source: "Industry Report",
    trend: "+7%"
  },
  {
    icon: Clock,
    value: "39s",
    label: "frequency of cyber attacks",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    detail: "2,244 attacks daily",
    source: "Clark School Study",
    trend: "-2s"
  },
  {
    icon: Users,
    value: "3.5B",
    label: "people affected by data breaches in 2024",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    detail: "50% increase from 2023",
    source: "Risk Based Security",
    trend: "+50%"
  },
  {
    icon: Database,
    value: "22B",
    label: "records exposed in data breaches",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    detail: "Average 25,000 per breach",
    source: "IBM Security Report",
    trend: "+23%"
  },
  {
    icon: Server,
    value: "200",
    label: "days average to identify a breach",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    detail: "70 days to contain",
    source: "IBM Cost of Data Breach",
    trend: "-12 days"
  },
  {
    icon: Bug,
    value: "4.88M",
    label: "average cost per data breach (USD)",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    detail: "Highest in 17 years",
    source: "IBM Security 2024",
    trend: "+10%"
  }
];

const industryBreakdown = [
  { sector: "Healthcare", percentage: 89, attacks: 1426, color: "bg-red-500" },
  { sector: "Financial Services", percentage: 74, attacks: 1274, color: "bg-orange-500" },
  { sector: "Government", percentage: 68, attacks: 1083, color: "bg-yellow-500" },
  { sector: "Education", percentage: 56, attacks: 892, color: "bg-blue-500" },
  { sector: "Retail", percentage: 47, attacks: 756, color: "bg-green-500" },
  { sector: "Manufacturing", percentage: 35, attacks: 542, color: "bg-purple-500" }
];

const threatEvolution = [
  {
    year: "2021",
    ransomware: 65,
    phishing: 58,
    malware: 42,
    cost: "6.0T"
  },
  {
    year: "2022",
    ransomware: 71,
    phishing: 62,
    malware: 44,
    cost: "8.0T"
  },
  {
    year: "2023",
    ransomware: 73,
    phishing: 68,
    malware: 45,
    cost: "8.5T"
  },
  {
    year: "2024",
    ransomware: 76,
    phishing: 71,
    malware: 47,
    cost: "9.5T"
  },
  {
    year: "2025",
    ransomware: 79,
    phishing: 75,
    malware: 50,
    cost: "10.5T"
  }
];

const gamificationStats = [
  {
    icon: Brain,
    value: "90%",
    label: "Better retention with interactive learning",
    color: "text-emerald-500",
    detail: "Compared to traditional methods"
  },
  {
    icon: Zap,
    value: "75%",
    label: "Higher engagement vs traditional methods",
    color: "text-blue-500",
    detail: "Active participation rate"
  },
  {
    icon: Target,
    value: "5x",
    label: "Faster skill acquisition",
    color: "text-purple-500",
    detail: "Time to proficiency"
  },
  {
    icon: Award,
    value: "87%",
    label: "Game completion rate",
    color: "text-red-500",
    detail: "Industry leading"
  }
];

const realTimeMetrics = [
  {
    label: "Active Threats Detected",
    value: "14,237",
    change: "+5.2%",
    trend: "up",
    color: "text-red-500"
  },
  {
    label: "Systems Protected",
    value: "2.3M",
    change: "+12.8%",
    trend: "up",
    color: "text-green-500"
  },
  {
    label: "Incidents Resolved",
    value: "8,934",
    change: "+18.5%",
    trend: "up",
    color: "text-blue-500"
  },
  {
    label: "Response Time (Avg)",
    value: "4.2min",
    change: "-23%",
    trend: "down",
    color: "text-purple-500"
  }
];

// Custom hook for intersection observer
const useInView = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
};

// Counter animation hook
const useCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, hasStarted]);

  return { count, start: () => setHasStarted(true) };
};

const AnimatedCounter = ({ value, inView, className }) => {
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const { count, start } = useCounter(numericValue);

  useEffect(() => {
    if (inView) start();
  }, [inView, start]);

  const formattedValue = value.replace(/\d+/, count.toString());

  return <span className={className}>{formattedValue}</span>;
};

const StatsSection = () => {
  const { ref: mainRef, isInView: mainInView } = useInView(0.1);
  const { ref: statsRef, isInView: statsInView } = useInView(0.1);
  const { ref: threatRef, isInView: threatInView } = useInView(0.1);
  const { ref: industryRef, isInView: industryInView } = useInView(0.1);
  const { ref: gamingRef, isInView: gamingInView } = useInView(0.1);
  const { ref: realtimeRef, isInView: realtimeInView } = useInView(0.1);

  return (
    <section className="relative py-16 sm:py-24 px-4 overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card/30 to-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />

        {/* 3D Floating particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 12}s`
              }}
            >
              <div className={`w-2 h-2 rounded-full ${i % 4 === 0 ? 'bg-primary/40' :
                i % 4 === 1 ? 'bg-secondary/40' :
                  i % 4 === 2 ? 'bg-accent/40' :
                    'bg-purple-500/40'
                }`} />
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        {/* Enhanced Header Section */}
        <div
          ref={mainRef}
          className={`text-center mb-16 sm:mb-20 transition-all duration-1000 ${mainInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-cyber font-black mb-6 sm:mb-8">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              The Cyber
            </span>
            <br />
            <span className="neon-text animate-pulse">Threat Reality</span>
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4">
            In a world where <span className="text-destructive font-semibold">cyber attacks happen every 39 seconds</span>,
            knowledge isn't just power—it's survival. Real-time intelligence drives strategic defense.
          </p>

          <div className="w-32 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-8 rounded-full" />
        </div>

        {/* Real-time Metrics Dashboard */}
        <div
          ref={realtimeRef}
          className={`mb-16 sm:mb-20 transition-all duration-1000 ${realtimeInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <h3 className="text-2xl sm:text-3xl font-cyber font-bold text-center mb-8 sm:mb-12">
            <Activity className="inline-block w-6 h-6 sm:w-8 sm:h-8 mr-3 text-primary animate-pulse" />
            <span className="neon-text">Live Threat Intelligence</span>
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {realTimeMetrics.map((metric, index) => (
              <div
                key={metric.label}
                className={`glass-card p-4 sm:p-6 text-center border-2 border-transparent hover:border-current transition-all duration-500 transform ${realtimeInView
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-10 scale-95'
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`text-2xl sm:text-3xl font-cyber font-black ${metric.color} mb-2`}>

                </div>
                <p className="text-xs sm:text-sm font-medium text-foreground mb-2">{metric.label}</p>
                <div className="flex items-center justify-center space-x-1">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-green-500" />
                  )}
                  <span className="text-xs text-green-500 font-medium">{metric.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Primary Stats Grid - Mobile Responsive */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16 sm:mb-20"
        >
          {primaryStats.map((stat, index) => (
            <div
              key={stat.label}
              className={`group cursor-pointer transition-all duration-500 transform ${statsInView
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-10 scale-95'
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div
                className={`glass-card p-6 sm:p-8 text-center h-full relative overflow-hidden ${stat.bgColor} border-2 border-transparent hover:border-current transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
              >
                {/* 3D Background glow effect */}
                <div className={`absolute inset-0 ${stat.color.replace('text-', 'bg-')}/5 blur-xl group-hover:blur-2xl transition-all duration-500 transform group-hover:scale-110`} />

                {/* Icon section with 3D effect */}
                <div className="flex items-center justify-center mb-4 sm:mb-6 relative z-10">
                  <div className="relative transform group-hover:rotate-12 transition-transform duration-500">
                    <stat.icon className={`h-12 w-12 sm:h-16 sm:w-16 ${stat.color} drop-shadow-lg`} />
                    <div className={`absolute -inset-4 ${stat.color.replace('text-', 'bg-')}/20 rounded-full blur-lg animate-pulse`} />
                  </div>
                </div>

                {/* Enhanced Value display */}
                <div className="relative z-10">
                  <div className={`text-3xl sm:text-4xl lg:text-5xl font-cyber font-black ${stat.color} mb-2 sm:mb-3`}>

                  </div>

                  <p className="text-foreground font-semibold mb-2 sm:mb-3 text-sm sm:text-base leading-relaxed px-2">
                    {stat.label}
                  </p>

                  {/* Trend indicator */}
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500 font-medium">{stat.trend}</span>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className={`${stat.color} font-medium`}>{stat.detail}</p>
                    <p className="opacity-70">{stat.source}</p>
                  </div>
                </div>

                {/* 3D Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-current/5 to-current/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Industry Breakdown Visualization */}
        <div
          ref={industryRef}
          className={`mb-16 sm:mb-20 transition-all duration-1000 hidden sm:block ${industryInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <h3 className="text-2xl sm:text-3xl font-cyber font-bold text-center mb-8 sm:mb-12">
            <BarChart3 className="inline-block w-6 h-6 sm:w-8 sm:h-8 mr-3 text-secondary" />
            <span className="neon-text">Industry Attack Distribution</span>
          </h3>

          <div className="glass-card p-6 sm:p-8 max-w-5xl mx-auto">
            <div className="space-y-4 sm:space-y-6">
              {industryBreakdown.map((industry, index) => (
                <div
                  key={industry.sector}
                  className={`transition-all duration-500 ${industryInView
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10"
                    }`}
                  style={{ transitionDelay: `${index * 100 + 200}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-2">
                    <div className="w-full sm:w-32 text-sm font-medium">
                      {industry.sector}
                    </div>
                    <div className="flex-1 bg-muted/30 rounded-full h-6 sm:h-4 overflow-hidden">
                      <div
                        className={`h-full ${industry.color} rounded-full relative transition-all duration-1000 ease-out`}
                        style={{
                          width: industryInView ? `${industry.percentage}%` : "0%",
                          transitionDelay: `${index * 100 + 400}ms`,
                        }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="w-12 font-bold">
                        {industry.percentage}%
                      </span>
                      <span className="text-muted-foreground">
                        {industry.attacks} attacks
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Threat Evolution Timeline */}
        <div
          ref={threatRef}
          className={`mb-16 sm:mb-20 transition-all duration-1000 hidden sm:block ${threatInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <h3 className="text-2xl sm:text-3xl font-cyber font-bold text-center mb-8 sm:mb-12">
            <TrendingUp className="inline-block w-6 h-6 sm:w-8 sm:h-8 mr-3 text-accent" />
            <span className="neon-text">5-Year Threat Evolution</span>
          </h3>

          <div className="glass-card p-6 sm:p-8 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              {threatEvolution.map((year, index) => (
                <div
                  key={year.year}
                  className={`text-center p-4 sm:p-6 rounded-lg bg-muted/20 transition-all duration-500 hover:scale-105 ${threatInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                    }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <h4 className="text-lg sm:text-xl font-cyber font-bold text-primary mb-4">
                    {year.year}
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Ransomware
                      </div>
                      <div className="text-sm sm:text-base font-semibold text-red-400">
                        {year.ransomware}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Phishing
                      </div>
                      <div className="text-sm sm:text-base font-semibold text-orange-400">
                        {year.phishing}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Malware
                      </div>
                      <div className="text-sm sm:text-base font-semibold text-yellow-400">
                        {year.malware}%
                      </div>
                    </div>
                    <div className="border-t border-muted/30 pt-2">
                      <div className="text-xs text-muted-foreground mb-1">
                        Total Cost
                      </div>
                      <div className="text-sm sm:text-base font-cyber font-bold text-destructive">
                        ${year.cost}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Enhanced Gamification Benefits */}
        <div
          ref={gamingRef}
          className={`text-center transition-all duration-1000 ${gamingInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <h3 className="text-3xl sm:text-4xl font-cyber font-bold mb-6 sm:mb-8">
            <span className="neon-text animate-pulse">Why Interactive Learning Works</span>
          </h3>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
            Scientific research proves that gamification transforms cybersecurity education, making complex concepts
            <span className="text-secondary font-semibold"> engaging, memorable, and effective</span>.
          </p>

          <div className="glass-card p-6 sm:p-10 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {gamificationStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`text-center group cursor-pointer transition-all duration-500 hover:scale-110 ${gamingInView
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                    }`}
                  style={{ transitionDelay: `${index * 200 + 500}ms` }}
                >
                  <div className="relative mb-6">
                    <stat.icon className={`h-10 w-10 sm:h-12 sm:w-12 mx-auto ${stat.color} drop-shadow-lg transform group-hover:rotate-12 transition-transform duration-300`} />
                    <div className={`absolute -inset-3 ${stat.color.replace('text-', 'bg-')}/20 rounded-full blur-lg animate-pulse`} />
                  </div>

                  <div className={`text-3xl sm:text-4xl font-cyber font-black ${stat.color} mb-3`}>

                  </div>

                  <p className="text-muted-foreground font-medium text-sm leading-relaxed mb-2 px-2">
                    {stat.label}
                  </p>
                  <p className="text-xs text-muted-foreground opacity-70">
                    {stat.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Enhanced Call to action */}
            <div className="mt-12 pt-8 border-t border-muted/30">
              <p className="text-base sm:text-lg text-muted-foreground mb-6">
                Join the revolution in cybersecurity education with evidence-based learning
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                {['Interactive', 'Engaging', 'Effective', 'Fun', 'Scientific', 'Proven'].map((word, index) => (
                  <span
                    key={word}
                    className={`px-3 sm:px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full text-xs sm:text-sm font-medium border border-primary/30 transition-all duration-500 hover:scale-110 ${gamingInView ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                      }`}
                    style={{ transitionDelay: `${index * 100 + 1000}ms` }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-float { animation: float 12s ease-in-out infinite; }
        .animate-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 2s infinite;
        }
        
        .neon-text {
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.5),
                       0 0 20px rgba(59, 130, 246, 0.3),
                       0 0 40px rgba(59, 130, 246, 0.1);
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        @media (max-width: 640px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default StatsSection;
