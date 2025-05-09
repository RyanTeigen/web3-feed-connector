
import { Json } from "@/integrations/supabase/types";

// Define a type that works with both our component and Json type
export type FeedPreferences = {
  twitter: boolean;
  discord: boolean;
  telegram: boolean;
  blog: boolean;
  youtube: boolean;
  [key: string]: boolean;
};

export type UserProfile = {
  username: string;
  full_name: string;
  avatar_url: string;
};

export type UserPreferences = {
  theme: string;
  notification_enabled: boolean;
  feed_preferences: FeedPreferences;
};
