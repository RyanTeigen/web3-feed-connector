
import { NavLink } from "react-router-dom";
import { Home, MessageSquare, BarChart, Settings, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const MobileBottomNav = () => {
  const { user } = useAuth();

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/feeds", icon: MessageSquare, label: "Feeds" },
    { to: "/sentiment", icon: BarChart, label: "Analytics" },
    { to: "/feed-customization", icon: Settings, label: "Settings" },
    { to: user ? "/dashboard" : "/auth", icon: User, label: user ? "Dashboard" : "Login" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 flex-1 ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium truncate">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
