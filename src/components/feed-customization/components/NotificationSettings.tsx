
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UpdateSettings } from "../types/update-settings";

interface NotificationSettingsProps {
  autoRefresh: boolean;
  notifications: UpdateSettings["notifications"];
  updateFrequency: UpdateSettings["updateFrequency"];
  onAutoRefreshChange: (checked: boolean) => void;
  onNotificationChange: (type: "browser" | "email", checked: boolean) => void;
}

const NotificationSettings = ({ 
  autoRefresh, 
  notifications, 
  updateFrequency,
  onAutoRefreshChange, 
  onNotificationChange 
}: NotificationSettingsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="auto-refresh">Auto-refresh when tab is active</Label>
          <p className="text-sm text-muted-foreground">
            Automatically refresh your feed when you return to the tab
          </p>
        </div>
        <Switch
          id="auto-refresh"
          checked={autoRefresh}
          onCheckedChange={onAutoRefreshChange}
          disabled={updateFrequency === "manual"}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="browser-notifications">Browser notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive browser notifications about important updates
          </p>
        </div>
        <Switch
          id="browser-notifications"
          checked={notifications.browser}
          onCheckedChange={(checked) => onNotificationChange("browser", checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="email-notifications">Email notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive email notifications about important updates
          </p>
        </div>
        <Switch
          id="email-notifications"
          checked={notifications.email}
          onCheckedChange={(checked) => onNotificationChange("email", checked)}
        />
      </div>
    </div>
  );
};

export default NotificationSettings;
