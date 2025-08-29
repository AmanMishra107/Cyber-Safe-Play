import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Play,
  Users,
  Trophy,
  Shield,
  ChevronDown,
  Star,
  Gamepad2,
  Lock,
  Brain,
  Target,
  Zap,
  Clock,
  Award,
  X
} from "lucide-react";

// Custom hook for scroll animations
const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

// Counter animation hook
const useCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    const animate = (currentTime: number) => {
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

const AnimatedCounter: React.FC<{ value: number; isVisible: boolean; suffix?: string }> = ({
  value,
  isVisible,
  suffix = ""
}) => {
  const { count, start } = useCounter(value);

  useEffect(() => {
    if (isVisible) start();
  }, [isVisible, start]);

  return <span>{count}{suffix}</span>;
};

const HeroSection: React.FC = () => {
  const [showLearnMore, setShowLearnMore] = useState(false);
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.1);
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation(0.1);

  const features = [
    {
      icon: Gamepad2,
      title: "Interactive Gaming",
      description: "Learn through hands-on cybersecurity mini-games that simulate real-world scenarios"
    },
    {
      icon: Brain,
      title: "Smart Learning",
      description: "AI-powered adaptive learning that adjusts to your skill level and progress"
    },
    {
      icon: Shield,
      title: "Real Security",
      description: "Practice with actual cybersecurity tools and techniques used by professionals"
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Earn badges, certificates, and track your progress with detailed analytics"
    }
  ];

  const gameTypes = [
    { name: "Password Strength Trainer", difficulty: "Beginner", time: "5 min" },
    { name: "Phishing Email Detector", difficulty: "Intermediate", time: "10 min" },
    { name: "Network Security Simulator", difficulty: "Advanced", time: "20 min" },
    { name: "Malware Analysis Lab", difficulty: "Expert", time: "30 min" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "IT Security Manager",
      rating: 5,
      comment: "This platform transformed our team's security awareness. The games are engaging and effective."
    },
    {
      name: "Mike Chen",
      role: "Cybersecurity Student",
      rating: 5,
      comment: "Finally, learning cybersecurity is fun! The interactive approach helps me remember concepts better."
    }
  ];

  const scrollToNext = () => {
    const nextSection = document.querySelector('#next-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card/10 to-background">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />

          {/* Floating Particles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`
              }}
            >
              <div className={`w-3 h-3 rounded-full ${i % 3 === 0 ? 'bg-primary/40' : i % 3 === 1 ? 'bg-secondary/40' : 'bg-accent/40'
                } blur-sm`} />
            </div>
          ))}
        </div>

        <div className="container mx-auto text-center relative z-10">
          {/* Hero Content */}
          <div
            ref={heroRef}
            className={`max-w-6xl mx-auto space-y-12 transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
          >
            {/* Main Headline */}
            <div className="space-y-6">
              <div className="flex justify-center mb-6">
                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium">
                  🚀 New: CyberSecurity Learning Engine
                </Badge>
              </div>

              <h1 className="text-6xl md:text-8xl font-cyber font-black leading-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
                  Play. Learn.
                </span>
                <br />
                <span className="neon-text animate-pulse">Stay Secure.</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Master cybersecurity through <span className="text-primary font-semibold">interactive mini-games</span> and
                real-world simulations. Join <span className="text-secondary font-semibold">50,000+ learners</span> protecting
                the digital world.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {['Hands-on Learning', 'Real-time Feedback', 'Progress Tracking', 'Expert Certified'].map((feature, index) => (
                <div
                  key={feature}
                  className={`glass-card p-4 text-sm font-medium transition-all duration-500 hover:scale-105 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                    }`}
                  style={{ transitionDelay: `${index * 100 + 500}ms` }}
                >
                  {feature}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">


              <a href="#games">
                <Button className="cyber-button text-lg py-7 px-10 group shadow-2xl hover:shadow-primary/25 transition-all duration-300">
                  <Play className="mr-3 h-6 w-6 group-hover:animate-spin transition-transform" />
                  Start Your Game
                </Button>

              </a>


              <Button
                variant="outline"
                className="text-lg py-7 px-10 border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300 group"
                onClick={() => setShowLearnMore(true)}
              >
                <Shield className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                Learn More
                <ChevronDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
              </Button>
            </div>

            {/* Testimonial Preview */}
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
                <span className="text-sm text-muted-foreground ml-2">4.7/5 from 100+ reviews</span>
              </div>
              <p className="text-muted-foreground italic">
                "This platform completely changed how I approach cybersecurity learning. The games are addictive!"
              </p>
              <p className="text-sm font-medium mt-2">- Mayur kale, Windows server administrator</p>
            </div>
          </div>
        </div>


      </section >

      {/* Stats Section */}
      < section
        ref={statsRef}
        className="py-20 px-4 bg-gradient-to-br from-card/20 to-background"
        id="next-section"
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Users, value: 50, suffix: "K+", label: "Active Learners", color: "text-primary" },
              { icon: Trophy, value: 5, suffix: "K+", label: "Games Completed", color: "text-secondary" },
              { icon: Shield, value: 90, suffix: "%", label: "Security Improvement", color: "text-accent" },
              { icon: Award, value: 10, suffix: "+", label: "Game Programs", color: "text-emerald-500" }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`glass-card p-8 text-center group hover:scale-105 transition-all duration-500 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <stat.icon className={`h-12 w-12 ${stat.color} group-hover:animate-pulse`} />
                    <div className={`absolute -inset-2 ${stat.color.replace('text-', 'bg-')}/20 rounded-full blur-lg group-hover:blur-xl transition-all`} />
                  </div>
                </div>
                <div className={`text-4xl font-cyber font-black ${stat.color} mb-2`}>
                  <AnimatedCounter value={stat.value} isVisible={statsVisible} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Learn More Modal */}
      {
        showLearnMore && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10"
                onClick={() => setShowLearnMore(false)}
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="p-8 space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-cyber font-bold neon-text">
                    The Future of Cybersecurity Education
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Experience hands-on learning that adapts to your pace and provides real-world cybersecurity skills
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {features.map((feature, index) => (
                    <div key={feature.title} className="glass-card p-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-cyber font-bold">{feature.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>

                {/* Game Types */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-cyber font-bold text-center text-secondary">
                    🎮 Available Game Types
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gameTypes.map((game, index) => (
                      <div key={game.name} className="glass-card p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{game.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">{game.difficulty}</Badge>
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {game.time}
                            </span>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonials */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-cyber font-bold text-center text-accent">
                    💬 What Our Users Say
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map((testimonial, index) => (
                      <div key={testimonial.name} className="glass-card p-6 space-y-4">
                        <div className="flex items-center space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                        <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


              </div>
            </div>
          </div>
        )
      }


    </>
  );
};

export default HeroSection;
