import { Shield, Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-primary/20 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary animate-glow-pulse" />
              <span className="text-2xl font-cyber font-black neon-text">
                CyberSafePlay
              </span>
            </div>
            <p className="text-muted-foreground">
              Learn cybersecurity through fun, interactive games. 
              Protecting the digital world, one player at a time.
            </p>
          </div>

          {/* Games */}
          <div className="space-y-4">
            <h3 className="text-lg font-cyber font-bold text-primary">Games</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Phishing Detective</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Password Fortress</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Wi-Fi Defender</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Spot the Hacker</a></li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="text-lg font-cyber font-bold text-secondary">Community</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-secondary transition-colors">Leaderboard</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Achievements</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Forums</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Discord</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-cyber font-bold text-accent">Support</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 mt-8 border-t border-primary/20">
          <p className="text-muted-foreground text-sm">
            © 2024 CyberSafePlay. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;