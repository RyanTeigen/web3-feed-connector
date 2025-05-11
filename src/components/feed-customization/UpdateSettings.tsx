import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

interface UpdateSettingsProps {
  onSave: () => void;
}

// Define type for update settings
interface UpdateSettings {
  updateFrequency: "realtime" | "hourly" | "daily" | "manual";
  autoRefresh: boolean;
  notifications: {
    browser: boolean;
    email: boolean;
  };
}

// Default update settings
const DEFAULT_SETTINGS: UpdateSettings = {
  updateFrequency: "realtime",
  autoRefresh: true,
  notifications: {
    browser: false,
    email: false,
  },
};

const UpdateSettings = ({ onSave }: UpdateSettingsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UpdateSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);

  // Fetch user update settings from database if logged in
  useEffect(() => {
    if (user) {
      const fetchSettings = async () => {
        try {
          const { data, error } = await supabase
            .from('user_preferences')
            .select('feed_preferences')
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          
          // If we have update settings data, set it
          if (data?.feed_preferences?.update_settings) {
            setSettings(data.feed_preferences.update_settings);
          }
        } catch (error) {
          console.error("Error fetching update settings:", error);
        }
      };

      fetchSettings();
    }
  }, [user]);

  const handleFrequencyChange = (value: "realtime" | "hourly" | "daily" | "manual") => {
    setSettings((prev) => ({
      ...prev,
      updateFrequency: value,
    }));
  };

  const handleAutoRefreshChange = (checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      autoRefresh: checked,
    }));
  };

  const handleNotificationChange = (type: "browser" | "email", checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: checked,
      },
    }));
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your update settings.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Fetch current preferences first to update them
      const { data: currentPreferences } = await supabase
        .from('user_preferences')
        .select('feed_preferences')
        .eq('user_id', user.id)
        .single();
        
      // Prepare the updated feed preferences
      const updatedFeedPreferences = {
        ...currentPreferences?.feed_preferences,
        update_settings: settings
      };
      
      // Update the user preferences
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          feed_preferences: updatedFeedPreferences,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      // Call the onSave callback to notify parent component
      onSave();
      
      toast({
        title: "Settings saved",
        description: "Your update frequency settings have been updated.",
      });
    } catch (error) {
      console.error("Error saving update settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was an error saving your update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Update Frequency</h3>
        <p className="text-sm text-muted-foreground">
          Control how often your feed refreshes with new content.
        </p>
        
        <RadioGroup 
          value={settings.updateFrequency} 
          onValueChange={(value) => handleFrequencyChange(value as any)}
          className="space-y-3"
        >
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="realtime" id="realtime" />
            <div className="grid gap-1.5">
              <Label htmlFor="realtime">Real-time updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates as they happen (uses more battery and data)
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="hourly" id="hourly" />
            <div className="grid gap-1.5">
              <Label htmlFor="hourly">Hourly</Label>
              <p className="text-sm text-muted-foreground">
                Check for new content once per hour
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="daily" id="daily" />
            <div className="grid gap-1.5">
              <Label htmlFor="daily">Daily digest</Label>
              <p className="text-sm text-muted-foreground">
                Receive a summary of new content once per day
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="manual" id="manual" />
            <div className="grid gap-1.5">
              <Label htmlFor="manual">Manual updates only</Label>
              <p className="text-sm text-muted-foreground">
                Only check for new content when you refresh the feed manually
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>

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
            checked={settings.autoRefresh}
            onCheckedChange={handleAutoRefreshChange}
            disabled={settings.updateFrequency === "manual"}
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
            checked={settings.notifications.browser}
            onCheckedChange={(checked) => handleNotificationChange("browser", checked)}
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
            checked={settings.notifications.email}
            onCheckedChange={(checked) => handleNotificationChange("email", checked)}
          />
        </div>
      </div>

      <Button 
        className="w-full mt-6" 
        onClick={handleSave} 
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Update Settings"}
      </Button>
    </div>
  );
};

export default UpdateSettings;
