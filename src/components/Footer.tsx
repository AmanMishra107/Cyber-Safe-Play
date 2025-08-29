import React, { useState, useEffect } from 'react';
import {
  Shield,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Heart,
  ExternalLink,
  Search,
  Lock,
  Wifi,
  Eye,
  Zap,
  Target,
  Users,
  MessageCircle,
  BookOpen,
  HelpCircle,
  FileText,
  Send
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const footerElement = document.querySelector('#premium-footer');
    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => observer.disconnect();
  }, []);

  const gameLinks = [
    { name: "Phishing Detective", path: "/games/phishing-detective", icon: Search },
    { name: "Password Fortress", path: "/games/password-fortress", icon: Lock },
    { name: "Wi-Fi Defender", path: "/games/wifi-defender", icon: Wifi },
    { name: "Spot the Hacker", path: "/games/spot-the-hacker", icon: Eye },
    { name: "Incident Response Command", path: "/games/incident-response-command", icon: Zap }
  ];

  const supportLinks = [

    { name: "About Us", path: "/support/about", icon: Users },
    { name: "Contact Us", path: "/support/contact", icon: Send }
  ];

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/AmanMishra107",
      icon: Github,
      color: "hover:text-white hover:bg-gray-800"
    },
    {
      name: "Twitter",
      href: "https://x.com/AmanMishra107",
      icon: Twitter,
      color: "hover:text-white hover:bg-blue-500"
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/amanmishra107/",
      icon: Linkedin,
      color: "hover:text-white hover:bg-blue-600"
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/aman.mishra__107/",
      icon: Instagram,
      color: "hover:text-white hover:bg-pink-500",
    },
  ];

  return (
    <footer
      id="premium-footer"
      className="relative border-t border-primary/20 py-16 px-4 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card/30 to-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />

        {/* Floating Particles */}
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
            <div className={`w-1.5 h-1.5 rounded-full ${i % 3 === 0 ? 'bg-primary/40' : i % 3 === 1 ? 'bg-secondary/40' : 'bg-accent/40'
              }`} />
          </div>
        ))}
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Section */}
          <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <Shield className="h-10 w-10 text-primary group-hover:text-secondary transition-all duration-500 animate-glow-pulse" />
                <div className="absolute -inset-2 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <span className="text-2xl font-cyber font-black neon-text">
                CyberSafePlay
              </span>
            </div>

            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Master cybersecurity through immersive, gamified learning experiences.
              <span className="text-primary font-semibold">Protecting the digital world</span>, one skilled defender at a time.
            </p>

            {/* Developer Credits */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Developed with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>by</span>
              <a
                href="mailto:amanpavanmishra10@gmail.com"
                className="text-primary font-semibold hover:text-secondary transition-colors cursor-pointer"
              >
                Aman Mishra
              </a>

            </div>
          </div>

          {/* Games Section */}
          <div className={`space-y-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
            <h3 className="text-xl font-cyber font-bold text-primary border-b border-primary/30 pb-2 flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Quick Access</span>
            </h3>

            <ul className="space-y-3">
              {gameLinks.map((game, index) => (
                <li key={game.path} className="group animate-fade-in-up" style={{ animationDelay: `${0.1 * index}s` }}>
                  <Link
                    to={game.path}
                    className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-all duration-300 p-2 hover:bg-primary/10 rounded-lg group-hover:translate-x-2"
                  >
                    <game.icon className="h-4 w-4 group-hover:animate-pulse" />
                    <span>{game.name}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div className={`space-y-6 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
            <h3 className="text-xl font-cyber font-bold text-secondary border-b border-secondary/30 pb-2 flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Support & Legal</span>
            </h3>

            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={link.path} className="group animate-fade-in-up" style={{ animationDelay: `${0.1 * index}s` }}>
                  <Link
                    to={link.path}
                    className="flex items-center space-x-3 text-muted-foreground hover:text-secondary transition-all duration-300 p-2 hover:bg-secondary/10 rounded-lg group-hover:translate-x-2"
                  >
                    <link.icon className="h-4 w-4 group-hover:animate-pulse" />
                    <span>{link.name}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Connect Section */}
          <div className={`space-y-6 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
            <h3 className="text-xl font-cyber font-bold text-accent border-b border-accent/30 pb-2 flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Connect With Us</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {socialLinks.map(({ name, href, icon: Icon, color }, index) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center space-x-2 p-3 text-muted-foreground border border-muted/20 rounded-lg transition-all duration-300 group ${color} animate-fade-in-up`}
                  style={{ animationDelay: `${0.1 * index}s` }}
                  aria-label={name}
                >
                  <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{name}</span>
                </a>
              ))}
            </div>

            {/* Newsletter Signup */}

            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold text-foreground">Stay Updated</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Get cybersecurity tips and new game updates.
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-2 py-1 bg-background/50 border border-muted/30 rounded text-xs focus:outline-none focus:border-primary transition-colors"
                />
                <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/80 transition-colors flex items-center justify-center space-x-1">
                  <Send className="h-3 w-3" />
                  <span>Subscribe</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className={`flex flex-col md:flex-row items-center justify-between pt-8 mt-12 border-t border-primary/20 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-muted-foreground text-sm font-mono">
              © 2025 CyberSafePlay. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Version 1.0.0 | Built with React & TypeScript
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Made in India</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <BookOpen className="h-3 w-3" />
              <span>Open Source</span>
            </span>
          </div>
        </div>
      </div>


    </footer>
  );
};

export default Footer;
