
import { Json } from "@/integrations/supabase/types";

// Define type for keyword filters
export interface KeywordFilters {
  mutedKeywords: string[];
  highlightKeywords: string[];
}

// Type for feed preferences from the database
export interface KeywordFiltersData {
  keyword_filters?: KeywordFilters;
  [key: string]: any;
}

// Default keyword filters
export const DEFAULT_FILTERS: KeywordFilters = {
  mutedKeywords: [],
  highlightKeywords: [],
};
