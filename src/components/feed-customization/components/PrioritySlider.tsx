
import { Slider } from "@/components/ui/slider";
import { ContentPreferences } from "../types/feed-preferences";

interface PrioritySliderProps {
  priorities: ContentPreferences["priorities"];
  onChange: (value: number[]) => void;
}

const PrioritySlider = ({ priorities, onChange }: PrioritySliderProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Content Priority</h3>
      <p className="text-sm text-muted-foreground">
        Adjust how content is ranked in your feed.
      </p>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span>Recency: {priorities.recency}%</span>
            <span>Relevance: {priorities.relevance}%</span>
          </div>
          <Slider
            value={[priorities.recency]}
            max={100}
            step={10}
            onValueChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PrioritySlider;
