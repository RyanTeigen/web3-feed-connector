
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UpdateSettings, DEFAULT_SETTINGS, UpdateSettingsData } from "../types/update-settings";
import { Json } from "@/integrations/supabase/types";

export const useUpdateSettings = () => {
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
          if (data?.feed_preferences) {
            const feedPrefs = data.feed_preferences as unknown as UpdateSettingsData;
            if (feedPrefs.update_settings) {
              setSettings(feedPrefs.update_settings);
            }
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

  const saveSettings = async (): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your update settings.",
        variant: "destructive",
      });
      return false;
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
      const currentFeedPrefs = (currentPreferences?.feed_preferences || {}) as unknown as UpdateSettingsData;
      
      const updatedFeedPreferences = {
        ...currentFeedPrefs,
        update_settings: settings
      };
      
      // Update the user preferences
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          feed_preferences: updatedFeedPreferences as unknown as Json,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      toast({
        title: "Settings saved",
        description: "Your update frequency settings have been updated.",
      });
      
      return true;
    } catch (error) {
      console.error("Error saving update settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was an error saving your update settings. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    handleFrequencyChange,
    handleAutoRefreshChange,
    handleNotificationChange,
    saveSettings
  };
};
