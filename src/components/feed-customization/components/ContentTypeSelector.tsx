
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentPreferences } from "../types/feed-preferences";

interface ContentTypeSelectorProps {
  contentTypes: ContentPreferences["contentTypes"];
  onChange: (type: string, checked: boolean) => void;
}

const ContentTypeSelector = ({ contentTypes, onChange }: ContentTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Content Types</h3>
      <p className="text-sm text-muted-foreground">
        Select the types of content you want to see in your feed.
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(contentTypes).map(([type, enabled]) => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox 
              id={`content-${type}`}
              checked={enabled}
              onCheckedChange={(checked) => onChange(type, !!checked)}
            />
            <Label htmlFor={`content-${type}`} className="capitalize">
              {type.replace('_', ' ')}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentTypeSelector;
