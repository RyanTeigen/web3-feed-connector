import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle";

const Stars = () => {
  useEffect(() => {
    const container = document.querySelector('.stars-container');
    if (!container) return;

    const starCount = 50;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      
      const size = Math.random() * 3 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      
      const duration = Math.random() * 60 + 30;
      star.style.animationDuration = `${duration}s, ${Math.random() * 3 + 2}s`;
      
      const delay = Math.random() * 30;
      star.style.animationDelay = `${delay}s, ${Math.random() * 2}s`;
      
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
  const { user, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const getInitials = () => {
    if (!user?.email) return "AU";
    return user.email.substring(0, 2).toUpperCase();
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
          
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/" className="px-3 py-2 text-sm font-medium hover:text-secondary transition-colors">
                  Home
                </Link>
                <Link to="/feeds" className="px-3 py-2 text-sm font-medium hover:text-secondary transition-colors">
                  Feeds
                </Link>
                <Link to="/about" className="px-3 py-2 text-sm font-medium hover:text-secondary transition-colors">
                  About
                </Link>
                <ThemeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                        <AvatarFallback className="bg-web3-vibrant-teal/20 text-web3-vibrant-teal">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer flex w-full items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer flex items-center text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/about" className="px-3 py-2 text-sm font-medium hover:text-secondary transition-colors">
                  About
                </Link>
                <ThemeToggle />
                <Button onClick={() => navigate("/auth")} className="web3-button text-web3-electric-blue">
                  Login
                </Button>
              </>
            )}
          </div>
          
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
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
            {isAuthenticated ? (
              <>
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
                <div className="flex items-center px-3 py-2">
                  <Avatar className="h-9 w-9 mr-2">
                    <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                    <AvatarFallback className="bg-web3-vibrant-teal/20 text-web3-vibrant-teal">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user?.email}</span>
                </div>
                <Button 
                  className="w-full mt-2 text-red-600 hover:text-red-700" 
                  variant="ghost"
                  onClick={() => {
                    handleSignOut();
                    toggleMobileMenu();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/about"
                  className="block px-3 py-2 text-base font-medium hover:text-secondary"
                  onClick={toggleMobileMenu}
                >
                  About
                </Link>
                <Button 
                  className="web3-button w-full mt-4 text-web3-electric-blue"
                  onClick={() => {
                    navigate("/auth");
                    toggleMobileMenu();
                  }}
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
