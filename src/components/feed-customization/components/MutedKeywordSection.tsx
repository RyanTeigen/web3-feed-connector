
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { KeywordFilters } from "../types/keyword-filters";

interface MutedKeywordSectionProps {
  mutedKeywords: string[];
  newKeyword: string;
  onNewKeywordChange: (value: string) => void;
  onAddKeyword: () => void;
  onRemoveKeyword: (keyword: string) => void;
}

const MutedKeywordSection = ({
  mutedKeywords,
  newKeyword,
  onNewKeywordChange,
  onAddKeyword,
  onRemoveKeyword
}: MutedKeywordSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Muted Keywords</h3>
      <p className="text-sm text-muted-foreground">
        Content containing these keywords will be hidden from your feed.
      </p>
      
      <div className="flex">
        <Input
          value={newKeyword}
          onChange={(e) => onNewKeywordChange(e.target.value)}
          placeholder="Enter keyword to mute"
          className="mr-2"
          onKeyDown={(e) => e.key === 'Enter' && onAddKeyword()}
        />
        <Button type="button" size="icon" onClick={onAddKeyword}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {mutedKeywords.map((keyword) => (
          <Badge key={keyword} variant="secondary" className="pr-1.5">
            {keyword}
            <button 
              type="button" 
              className="ml-1 hover:bg-secondary-foreground/10 rounded-full"
              onClick={() => onRemoveKeyword(keyword)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {mutedKeywords.length === 0 && (
          <p className="text-sm text-muted-foreground italic">No muted keywords added yet.</p>
        )}
      </div>
    </div>
  );
};

export default MutedKeywordSection;
