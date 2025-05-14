
import { Button } from "@/components/ui/button";
import MutedKeywordSection from "./components/MutedKeywordSection";
import HighlightKeywordSection from "./components/HighlightKeywordSection";
import { useKeywordFilters } from "./hooks/useKeywordFilters";

interface KeywordFiltersProps {
  onSave: () => void;
}

const KeywordFilters = ({ onSave }: KeywordFiltersProps) => {
  const {
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
  } = useKeywordFilters();

  const handleSave = async () => {
    const success = await saveKeywordFilters();
    if (success) {
      onSave();
    }
  };

  return (
    <div className="space-y-6 py-4">
      <MutedKeywordSection
        mutedKeywords={filters.mutedKeywords}
        newKeyword={newMutedKeyword}
        onNewKeywordChange={setNewMutedKeyword}
        onAddKeyword={addMutedKeyword}
        onRemoveKeyword={removeMutedKeyword}
      />

      <HighlightKeywordSection
        highlightKeywords={filters.highlightKeywords}
        newKeyword={newHighlightKeyword}
        onNewKeywordChange={setNewHighlightKeyword}
        onAddKeyword={addHighlightKeyword}
        onRemoveKeyword={removeHighlightKeyword}
      />

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
