import { Github, Twitter, Globe, MessageSquare, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border/40 bg-card/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-web3-deep-purple to-web3-vibrant-teal"></div>
              <span className="text-xl font-bold gradient-text">Autheo Connect</span>
            </Link>
            <p className="text-sm font-semibold text-web3-electric-blue">
              Build. Connect. Own.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-web3-electric-blue transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/feeds" className="text-muted-foreground hover:text-web3-electric-blue transition-colors">Feeds</Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-web3-electric-blue transition-colors">About Autheo</Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-web3-electric-blue transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-web3-electric-blue transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-web3-electric-blue transition-colors">
                <MessageSquare className="h-5 w-5" />
                <span className="sr-only">Discord</span>
              </a>
              <a href="https://autheo.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-web3-electric-blue transition-colors">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Website</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Autheo Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
