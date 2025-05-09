
import { UserPreferences } from "@/types/profile";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PreferencesTabProps {
  preferences: UserPreferences;
  handlePreferenceToggle: (key: string) => void;
}

export const PreferencesTab = ({ preferences, handlePreferenceToggle }: PreferencesTabProps) => {
  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="notifications">Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive notifications about activity
          </p>
        </div>
        <Switch
          id="notifications"
          checked={preferences.notification_enabled}
          onCheckedChange={() => handlePreferenceToggle("notification_enabled")}
        />
      </div>
      
      <div className="pt-4 border-t border-border">
        <h3 className="text-sm font-medium mb-3">Feed Preferences</h3>
        <div className="space-y-3">
          {Object.entries(preferences.feed_preferences).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={`feed-${key}`} className="capitalize">
                {key}
              </Label>
              <Switch
                id={`feed-${key}`}
                checked={value}
                onCheckedChange={() => handlePreferenceToggle(key)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
