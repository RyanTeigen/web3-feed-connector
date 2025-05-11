
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useWeb3Auth } from "@/context/Web3AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useMediaQuery } from "@/hooks/use-mobile";
import { WalletConnect } from "@/components/web3/WalletConnect";
import {
  Menu,
  X,
  User,
  LogOut,
  BookOpen,
  Home,
  MessageSquare,
  BarChart
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { walletAddress } = useWeb3Auth();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <span className="text-2xl font-bold text-primary">Autheo</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
                <Link to="/feeds" className="text-muted-foreground hover:text-foreground">
                  Social Feeds
                </Link>
                <Link to="/sentiment" className="text-muted-foreground hover:text-foreground">
                  Sentiment
                </Link>
              </>
            ) : null}
            <Link to="/about" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                {!walletAddress && <WalletConnect />}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="flex items-center gap-2">
                  <User size={16} />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-md text-foreground"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="container px-4 pt-2 pb-3 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="flex items-center gap-2 text-foreground hover:text-primary py-2"
                >
                  <Home size={16} />
                  <span>Home</span>
                </Link>
                <Link
                  to="/feeds"
                  onClick={closeMenu}
                  className="flex items-center gap-2 text-foreground hover:text-primary py-2"
                >
                  <MessageSquare size={16} />
                  <span>Social Feeds</span>
                </Link>
                <Link
                  to="/sentiment"
                  onClick={closeMenu}
                  className="flex items-center gap-2 text-foreground hover:text-primary py-2"
                >
                  <BarChart size={16} />
                  <span>Sentiment</span>
                </Link>
              </>
            ) : null}
            <Link
              to="/about"
              onClick={closeMenu}
              className="flex items-center gap-2 text-foreground hover:text-primary py-2"
            >
              <BookOpen size={16} />
              <span>About</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                {!walletAddress && <WalletConnect />}
                <div className="pt-4 pb-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="flex items-center w-full gap-2 justify-start"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="pt-4 pb-3 border-t">
                <Link to="/auth" onClick={closeMenu} className="w-full block">
                  <Button size="sm" className="flex items-center w-full gap-2 justify-center">
                    <User size={16} />
                    <span>Sign In</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
