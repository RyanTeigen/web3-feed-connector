
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserPreferences, FeedPreferences } from "@/types/profile";
import { Json } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";

export const useProfileData = (userId: string | undefined) => {
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    full_name: "",
    avatar_url: "",
  });
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: "dark",
    notification_enabled: true,
    feed_preferences: {
      twitter: true,
      discord: true,
      telegram: true,
      blog: true,
      youtube: true,
    },
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePreferenceToggle = (key: string) => {
    if (key === "notification_enabled") {
      setPreferences({
        ...preferences,
        notification_enabled: !preferences.notification_enabled,
      });
    } else {
      setPreferences({
        ...preferences,
        feed_preferences: {
          ...preferences.feed_preferences,
          [key]: !preferences.feed_preferences[key],
        },
      });
    }
  };

  const loadProfileData = async () => {
    if (!userId) return;
    
    try {
      // Get profile data
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
        
      if (profileData) {
        setProfile({
          username: profileData.username || "",
          full_name: profileData.full_name || "",
          avatar_url: profileData.avatar_url || "",
        });
      }
      
      // Get preferences
      const { data: prefsData } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();
        
      if (prefsData) {
        const defaultFeedPrefs: FeedPreferences = {
          twitter: true,
          discord: true,
          telegram: true,
          blog: true,
          youtube: true,
        };
        
        // Ensure we have a properly structured feed_preferences object
        let feedPreferences: FeedPreferences;
        
        if (prefsData.feed_preferences && typeof prefsData.feed_preferences === 'object') {
          // Cast the data from the database to our FeedPreferences type
          feedPreferences = {
            ...defaultFeedPrefs,
            ...(prefsData.feed_preferences as unknown as FeedPreferences)
          };
        } else {
          feedPreferences = defaultFeedPrefs;
        }
        
        setPreferences({
          theme: prefsData.theme || "dark",
          notification_enabled: prefsData.notification_enabled,
          feed_preferences: feedPreferences,
        });
      }
      
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  };

  const saveProfileData = async () => {
    if (!userId) return;
    
    setIsSubmitting(true);
    
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          username: profile.username || userId,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
        })
        .eq("id", userId);
        
      if (profileError) throw profileError;
      
      // Update preferences - explicitly cast feed_preferences to Json
      const { error: prefsError } = await supabase
        .from("user_preferences")
        .update({
          theme: preferences.theme,
          notification_enabled: preferences.notification_enabled,
          feed_preferences: preferences.feed_preferences as unknown as Json,
        })
        .eq("user_id", userId);
        
      if (prefsError) throw prefsError;
      
      toast({
        title: "Profile Updated",
        description: "Your profile and preferences have been saved.",
      });
      
      return true;
      
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    profile,
    preferences,
    isSubmitting,
    handleProfileChange,
    handlePreferenceToggle,
    loadProfileData,
    saveProfileData
  };
};
