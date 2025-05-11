
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

interface FeedPreferencesProps {
  onSave: () => void;
}

// Define the type for our content preferences
interface ContentPreferences {
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

// Default feed preferences
const DEFAULT_PREFERENCES: ContentPreferences = {
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

const FeedPreferences = ({ onSave }: FeedPreferencesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<ContentPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(false);

  // Fetch user preferences from database if logged in
  useEffect(() => {
    if (user) {
      const fetchPreferences = async () => {
        try {
          // Use a type-safe approach with the Supabase client
          // We're using a type assertion here to handle the table that might not exist yet
          const { data, error } = await supabase
            .from('user_preferences')
            .select('settings')
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          
          // If we have content preferences data, set it
          if (data?.settings?.content_preferences) {
            setPreferences(data.settings.content_preferences);
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

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your preferences.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Using the existing user_preferences table
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          settings: {
            ...DEFAULT_PREFERENCES,
            content_preferences: preferences
          },
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      // Call the onSave callback to notify parent component
      onSave();
      
      toast({
        title: "Preferences saved",
        description: "Your content preferences have been updated.",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error saving preferences",
        description: "There was an error saving your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Content Types</h3>
        <p className="text-sm text-muted-foreground">
          Select the types of content you want to see in your feed.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(preferences.contentTypes).map(([type, enabled]) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox 
                id={`content-${type}`}
                checked={enabled}
                onCheckedChange={(checked) => handleContentTypeChange(type, !!checked)}
              />
              <Label htmlFor={`content-${type}`} className="capitalize">
                {type.replace('_', ' ')}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Content Priority</h3>
        <p className="text-sm text-muted-foreground">
          Adjust how content is ranked in your feed.
        </p>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span>Recency: {preferences.priorities.recency}%</span>
              <span>Relevance: {preferences.priorities.relevance}%</span>
            </div>
            <Slider
              value={[preferences.priorities.recency]}
              max={100}
              step={10}
              onValueChange={handlePriorityChange}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="verified-only">Verified Content Only</Label>
          <p className="text-sm text-muted-foreground">
            Only show content from verified sources
          </p>
        </div>
        <Switch
          id="verified-only"
          checked={preferences.showVerifiedOnly}
          onCheckedChange={handleVerifiedChange}
        />
      </div>

      <Button 
        className="w-full mt-6" 
        onClick={handleSave} 
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Preferences"}
      </Button>
    </div>
  );
};

export default FeedPreferences;
