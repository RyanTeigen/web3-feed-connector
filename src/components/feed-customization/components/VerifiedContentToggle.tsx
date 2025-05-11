
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface VerifiedContentToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const VerifiedContentToggle = ({ checked, onChange }: VerifiedContentToggleProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor="verified-only">Verified Content Only</Label>
        <p className="text-sm text-muted-foreground">
          Only show content from verified sources
        </p>
      </div>
      <Switch
        id="verified-only"
        checked={checked}
        onCheckedChange={onChange}
      />
    </div>
  );
};

export default VerifiedContentToggle;
