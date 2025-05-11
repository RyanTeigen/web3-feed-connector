
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContentPreferences, DEFAULT_PREFERENCES, FeedPreferencesData } from "../types/feed-preferences";
import { Json } from "@/integrations/supabase/types";

export const useFeedPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<ContentPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(false);

  // Fetch user preferences from database if logged in
  useEffect(() => {
    if (user) {
      const fetchPreferences = async () => {
        try {
          const { data, error } = await supabase
            .from('user_preferences')
            .select('feed_preferences')
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          
          // If we have content preferences data, set it
          if (data?.feed_preferences) {
            // Cast the JSON data to our expected format
            const feedPrefs = data.feed_preferences as unknown as FeedPreferencesData;
            if (feedPrefs.content_preferences) {
              setPreferences(feedPrefs.content_preferences);
            }
          }
        } catch (error) {
          console.error("Error fetching feed preferences:", error);
        }
      };

      fetchPreferences();
    }
  }, [user]);

  const handleContentTypeChange = (type: string, checked: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      contentTypes: {
        ...prev.contentTypes,
        [type]: checked,
      },
    }));
  };

  const handlePriorityChange = (value: number[]) => {
    const recency = value[0];
    setPreferences((prev) => ({
      ...prev,
      priorities: {
        recency,
        relevance: 100 - recency,
      },
    }));
  };

  const handleVerifiedChange = (checked: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      showVerifiedOnly: checked,
    }));
  };

  const savePreferences = async (): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your preferences.",
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
      const currentFeedPrefs = (currentPreferences?.feed_preferences || {}) as unknown as FeedPreferencesData;
      
      const updatedFeedPreferences = {
        ...currentFeedPrefs,
        content_preferences: preferences
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
        title: "Preferences saved",
        description: "Your content preferences have been updated.",
      });
      
      return true;
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error saving preferences",
        description: "There was an error saving your preferences. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    preferences,
    loading,
    handleContentTypeChange,
    handlePriorityChange,
    handleVerifiedChange,
    savePreferences,
  };
};
