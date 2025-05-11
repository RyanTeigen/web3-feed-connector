
import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface KeywordFiltersProps {
  onSave: () => void;
}

// Default keyword filters
const DEFAULT_FILTERS = {
  mutedKeywords: [],
  highlightKeywords: [],
};

const KeywordFilters = ({ onSave }: KeywordFiltersProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [newMutedKeyword, setNewMutedKeyword] = useState("");
  const [newHighlightKeyword, setNewHighlightKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user keyword filters from database if logged in
  useEffect(() => {
    if (user) {
      const fetchFilters = async () => {
        try {
          const { data, error } = await supabase
            .from("user_feed_preferences")
            .select("keyword_filters")
            .eq("user_id", user.id)
            .single();

          if (error) throw error;
          if (data?.keyword_filters) {
            setFilters(data.keyword_filters);
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

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your keyword filters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("user_feed_preferences")
        .upsert({
          user_id: user.id,
          keyword_filters: filters,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      // Call the onSave callback to notify parent component
      onSave();
      
      toast({
        title: "Filters saved",
        description: "Your keyword filters have been updated.",
      });
    } catch (error) {
      console.error("Error saving keyword filters:", error);
      toast({
        title: "Error saving filters",
        description: "There was an error saving your keyword filters. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Muted Keywords</h3>
        <p className="text-sm text-muted-foreground">
          Content containing these keywords will be hidden from your feed.
        </p>
        
        <div className="flex">
          <Input
            value={newMutedKeyword}
            onChange={(e) => setNewMutedKeyword(e.target.value)}
            placeholder="Enter keyword to mute"
            className="mr-2"
            onKeyDown={(e) => e.key === 'Enter' && addMutedKeyword()}
          />
          <Button type="button" size="icon" onClick={addMutedKeyword}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.mutedKeywords.map((keyword) => (
            <Badge key={keyword} variant="secondary" className="pr-1.5">
              {keyword}
              <button 
                type="button" 
                className="ml-1 hover:bg-secondary-foreground/10 rounded-full"
                onClick={() => removeMutedKeyword(keyword)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.mutedKeywords.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No muted keywords added yet.</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Highlight Keywords</h3>
        <p className="text-sm text-muted-foreground">
          Content containing these keywords will be prioritized in your feed.
        </p>
        
        <div className="flex">
          <Input
            value={newHighlightKeyword}
            onChange={(e) => setNewHighlightKeyword(e.target.value)}
            placeholder="Enter keyword to highlight"
            className="mr-2"
            onKeyDown={(e) => e.key === 'Enter' && addHighlightKeyword()}
          />
          <Button type="button" size="icon" onClick={addHighlightKeyword}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.highlightKeywords.map((keyword) => (
            <Badge key={keyword} className="pr-1.5">
              {keyword}
              <button 
                type="button" 
                className="ml-1 hover:bg-primary-foreground/10 rounded-full"
                onClick={() => removeHighlightKeyword(keyword)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.highlightKeywords.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No highlight keywords added yet.</p>
          )}
        </div>
      </div>

      <Button 
        className="w-full mt-6" 
        onClick={handleSave} 
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Keyword Filters"}
      </Button>
    </div>
  );
};

export default KeywordFilters;
