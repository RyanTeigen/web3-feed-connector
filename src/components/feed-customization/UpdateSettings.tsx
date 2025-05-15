
import { Button } from "@/components/ui/button";
import FrequencySelector from "./components/FrequencySelector";
import NotificationSettings from "./components/NotificationSettings";
import { useUpdateSettings } from "./hooks/useUpdateSettings";

interface UpdateSettingsProps {
  onSave: () => void;
}

const UpdateSettings = ({ onSave }: UpdateSettingsProps) => {
  const {
    settings,
    loading,
    handleFrequencyChange,
    handleAutoRefreshChange,
    handleNotificationChange,
    saveSettings
  } = useUpdateSettings();

  const handleSave = async () => {
    const success = await saveSettings();
    if (success) {
      onSave();
    }
  };

  return (
    <div className="space-y-6 py-4">
      <FrequencySelector 
        updateFrequency={settings.updateFrequency} 
        onChange={handleFrequencyChange}
      />

      <NotificationSettings 
        autoRefresh={settings.autoRefresh}
        notifications={settings.notifications}
        updateFrequency={settings.updateFrequency}
        onAutoRefreshChange={handleAutoRefreshChange}
        onNotificationChange={handleNotificationChange}
      />

      <Button 
        className="w-full mt-6" 
        onClick={handleSave} 
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Update Settings"}
      </Button>
    </div>
  );
};

export default UpdateSettings;
