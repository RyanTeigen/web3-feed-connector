
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { KeywordFilters, DEFAULT_FILTERS, KeywordFiltersData } from "../types/keyword-filters";
import { Json } from "@/integrations/supabase/types";

export const useKeywordFilters = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filters, setFilters] = useState<KeywordFilters>(DEFAULT_FILTERS);
  const [newMutedKeyword, setNewMutedKeyword] = useState("");
  const [newHighlightKeyword, setNewHighlightKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user keyword filters from database if logged in
  useEffect(() => {
    if (user) {
      const fetchFilters = async () => {
        try {
          const { data, error } = await supabase
            .from('user_preferences')
            .select('feed_preferences')
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          
          // If we have keyword filters data, set it
          if (data?.feed_preferences) {
            const feedPrefs = data.feed_preferences as unknown as KeywordFiltersData;
            if (feedPrefs.keyword_filters) {
              setFilters(feedPrefs.keyword_filters);
            }
          }
        } catch (error) {
          console.error("Error fetching keyword filters:", error);
        }
      };

      fetchFilters();
    }
  }, [user]);

  const addMutedKeyword = () => {
    if (!newMutedKeyword.trim()) return;
    if (filters.mutedKeywords.includes(newMutedKeyword.trim())) {
      toast({
        description: "This keyword is already in your muted list.",
      });
      return;
    }
    
    setFilters((prev) => ({
      ...prev,
      mutedKeywords: [...prev.mutedKeywords, newMutedKeyword.trim()],
    }));
    setNewMutedKeyword("");
  };

  const removeMutedKeyword = (keyword: string) => {
    setFilters((prev) => ({
      ...prev,
      mutedKeywords: prev.mutedKeywords.filter((k) => k !== keyword),
    }));
  };

  const addHighlightKeyword = () => {
    if (!newHighlightKeyword.trim()) return;
    if (filters.highlightKeywords.includes(newHighlightKeyword.trim())) {
      toast({
        description: "This keyword is already in your highlight list.",
      });
      return;
    }
    
    setFilters((prev) => ({
      ...prev,
      highlightKeywords: [...prev.highlightKeywords, newHighlightKeyword.trim()],
    }));
    setNewHighlightKeyword("");
  };

  const removeHighlightKeyword = (keyword: string) => {
    setFilters((prev) => ({
      ...prev,
      highlightKeywords: prev.highlightKeywords.filter((k) => k !== keyword),
    }));
  };

  const saveKeywordFilters = async (): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your keyword filters.",
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
      const currentFeedPrefs = (currentPreferences?.feed_preferences || {}) as unknown as KeywordFiltersData;
      
      const updatedFeedPreferences = {
        ...currentFeedPrefs,
        keyword_filters: filters
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
        title: "Filters saved",
        description: "Your keyword filters have been updated.",
      });
      
      return true;
    } catch (error) {
      console.error("Error saving keyword filters:", error);
      toast({
        title: "Error saving filters",
        description: "There was an error saving your keyword filters. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    filters,
    newMutedKeyword,
    newHighlightKeyword,
    loading,
    setNewMutedKeyword,
    setNewHighlightKeyword,
    addMutedKeyword,
    removeMutedKeyword,
    addHighlightKeyword,
    removeHighlightKeyword,
    saveKeywordFilters
  };
};
