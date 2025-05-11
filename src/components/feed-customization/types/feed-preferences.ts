
import { Json } from "@/integrations/supabase/types";

// Define the type for our content preferences
export interface ContentPreferences {
  contentTypes: {
    news: boolean;
    announcements: boolean;
    discussions: boolean;
    tutorials: boolean;
    market_updates: boolean;
    governance: boolean;
  };
  priorities: {
    recency: number;
    relevance: number;
  };
  showVerifiedOnly: boolean;
}

// Type for feed preferences from the database
export interface FeedPreferencesData {
  content_preferences?: ContentPreferences;
  [key: string]: any;
}

// Default feed preferences
export const DEFAULT_PREFERENCES: ContentPreferences = {
  contentTypes: {
    news: true,
    announcements: true,
    discussions: true,
    tutorials: false,
    market_updates: false,
    governance: false,
  },
  priorities: {
    recency: 70,
    relevance: 30,
  },
  showVerifiedOnly: false,
};
