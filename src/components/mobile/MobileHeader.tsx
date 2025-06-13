
import { Button } from "@/components/ui/button";
import { Menu, Settings, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { ProfileOnboarding } from "@/components/web3/ProfileOnboarding";

interface MobileHeaderProps {
  title: string;
  showSettings?: boolean;
  onMenuClick?: () => void;
}

export const MobileHeader = ({ title, showSettings = false, onMenuClick }: MobileHeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <Button variant="ghost" size="sm" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {user && (
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
          )}
          {showSettings && user && <ProfileOnboarding />}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
