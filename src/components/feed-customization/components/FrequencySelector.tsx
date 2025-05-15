
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UpdateSettings } from "../types/update-settings";

interface FrequencySelectorProps {
  updateFrequency: UpdateSettings["updateFrequency"];
  onChange: (value: "realtime" | "hourly" | "daily" | "manual") => void;
}

const FrequencySelector = ({ updateFrequency, onChange }: FrequencySelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Update Frequency</h3>
      <p className="text-sm text-muted-foreground">
        Control how often your feed refreshes with new content.
      </p>
      
      <RadioGroup 
        value={updateFrequency} 
        onValueChange={(value) => onChange(value as any)}
        className="space-y-3"
      >
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="realtime" id="realtime" />
          <div className="grid gap-1.5">
            <Label htmlFor="realtime">Real-time updates</Label>
            <p className="text-sm text-muted-foreground">
              Receive updates as they happen (uses more battery and data)
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="hourly" id="hourly" />
          <div className="grid gap-1.5">
            <Label htmlFor="hourly">Hourly</Label>
            <p className="text-sm text-muted-foreground">
              Check for new content once per hour
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="daily" id="daily" />
          <div className="grid gap-1.5">
            <Label htmlFor="daily">Daily digest</Label>
            <p className="text-sm text-muted-foreground">
              Receive a summary of new content once per day
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="manual" id="manual" />
          <div className="grid gap-1.5">
            <Label htmlFor="manual">Manual updates only</Label>
            <p className="text-sm text-muted-foreground">
              Only check for new content when you refresh the feed manually
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default FrequencySelector;
