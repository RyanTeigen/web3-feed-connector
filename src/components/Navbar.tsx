
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Stars component for the animated background
const Stars = () => {
  useEffect(() => {
    const container = document.querySelector('.stars-container');
    if (!container) return;

    // Create stars
    const starCount = 50;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      
      // Random size
      const size = Math.random() * 3 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random position
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      
      // Random animation duration
      const duration = Math.random() * 60 + 30;
      star.style.animationDuration = `${duration}s, ${Math.random() * 3 + 2}s`;
      
      // Random delay
      star.style.animationDelay = `${Math.random() * 30}s, ${Math.random() * 2}s`;
      
      container.appendChild(star);
    }

    return () => {
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
    };
  }, []);

  return <div className="stars-container" />;
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg border-b border-border/40 bg-background/80">
      <Stars />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/b6c63bd0-85fc-4221-b7f4-f2a40f8901d5.png" 
                alt="Autheo Logo" 
                className="h-10 w-auto"
              />
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link to="/" className="px-3 py-2 text-sm font-medium hover:text-secondary transition-colors">
                Home
              </Link>
              <Link to="/feeds" className="px-3 py-2 text-sm font-medium hover:text-secondary transition-colors">
                Feeds
              </Link>
              <Link to="/about" className="px-3 py-2 text-sm font-medium hover:text-secondary transition-colors">
                About
              </Link>
              <Button className="web3-button">Connect Wallet</Button>
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-muted hover:text-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium hover:text-secondary"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/feeds"
              className="block px-3 py-2 text-base font-medium hover:text-secondary"
              onClick={toggleMobileMenu}
            >
              Feeds
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-base font-medium hover:text-secondary"
              onClick={toggleMobileMenu}
            >
              About
            </Link>
            <Button className="web3-button w-full mt-4">Connect Wallet</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
