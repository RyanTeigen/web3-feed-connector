
import { Json } from "@/integrations/supabase/types";

// Define type for update settings
export interface UpdateSettings {
  updateFrequency: "realtime" | "hourly" | "daily" | "manual";
  autoRefresh: boolean;
  notifications: {
    browser: boolean;
    email: boolean;
  };
}

// Type for feed preferences from the database
export interface UpdateSettingsData {
  update_settings?: UpdateSettings;
  [key: string]: any;
}

// Default update settings
export const DEFAULT_SETTINGS: UpdateSettings = {
  updateFrequency: "realtime",
  autoRefresh: true,
  notifications: {
    browser: false,
    email: false,
  },
};
