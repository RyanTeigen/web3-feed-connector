
import { Button } from "@/components/ui/button";
import ContentTypeSelector from "./components/ContentTypeSelector";
import PrioritySlider from "./components/PrioritySlider";
import VerifiedContentToggle from "./components/VerifiedContentToggle";
import { useFeedPreferences } from "./hooks/useFeedPreferences";

interface FeedPreferencesProps {
  onSave: () => void;
}

const FeedPreferences = ({ onSave }: FeedPreferencesProps) => {
  const {
    preferences,
    loading,
    handleContentTypeChange,
    handlePriorityChange,
    handleVerifiedChange,
    savePreferences
  } = useFeedPreferences();

  const handleSave = async () => {
    const success = await savePreferences();
    if (success) {
      onSave();
    }
  };

  return (
    <div className="space-y-6 py-4">
      <ContentTypeSelector 
        contentTypes={preferences.contentTypes} 
        onChange={handleContentTypeChange}
      />

      <PrioritySlider 
        priorities={preferences.priorities}
        onChange={handlePriorityChange}
      />

      <VerifiedContentToggle 
        checked={preferences.showVerifiedOnly}
        onChange={handleVerifiedChange}
      />

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
