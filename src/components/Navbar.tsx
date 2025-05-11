
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./ModeToggle";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/logo.png" alt="Autheo Logo" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <span className="hidden font-bold sm:inline-block">Autheo</span>
        </Link>
        
        <div className="hidden md:flex md:gap-x-6 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-muted-foreground hover:text-foreground transition-colors ${isActive ? "text-foreground" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/feeds"
            className={({ isActive }) =>
              `text-muted-foreground hover:text-foreground transition-colors ${isActive ? "text-foreground" : ""}`
            }
          >
            Feeds
          </NavLink>
          <NavLink
            to="/feed-customization"
            className={({ isActive }) =>
              `text-muted-foreground hover:text-foreground transition-colors ${isActive ? "text-foreground" : ""}`
            }
          >
            Customize
          </NavLink>
          <NavLink
            to="/sentiment"
            className={({ isActive }) =>
              `text-muted-foreground hover:text-foreground transition-colors ${isActive ? "text-foreground" : ""}`
            }
          >
            Sentiment
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-muted-foreground hover:text-foreground transition-colors ${isActive ? "text-foreground" : ""}`
            }
          >
            About
          </NavLink>
        </div>
        
        <div className="flex items-center space-x-2">
          <ModeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name || user.email} />
                    <AvatarFallback>{user?.user_metadata?.full_name?.slice(0, 2).toUpperCase() || user.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="focus:outline-none">
                  {user ? user.email : <Skeleton />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="focus:outline-none" onClick={() => navigate("/auth/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:outline-none" onClick={() => navigate("/auth/account")}>
                  Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="focus:outline-none" onClick={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
