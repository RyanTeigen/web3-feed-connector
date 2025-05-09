
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useWeb3Auth } from "@/context/Web3AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import { ProfileTab } from "./ProfileTab";
import { PreferencesTab } from "./PreferencesTab";
import { useProfileData } from "@/hooks/useProfileData";

export const ProfileOnboarding = () => {
  const { user } = useAuth();
  const { walletAddress } = useWeb3Auth();
  const [open, setOpen] = useState(false);
  
  const {
    profile,
    preferences,
    isSubmitting,
    handleProfileChange,
    handlePreferenceToggle,
    loadProfileData,
    saveProfileData
  } = useProfileData(user?.id);

  const handleSubmit = async () => {
    const success = await saveProfileData();
    if (success) {
      setOpen(false);
    }
  };

  const handleOpen = () => {
    loadProfileData();
    setOpen(true);
  };

  return (
    <>
      <Button onClick={handleOpen} variant="secondary">
        Edit Profile
      </Button>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Complete Your Profile</SheetTitle>
            <SheetDescription>
              Customize your Autheo experience by setting up your profile and preferences.
            </SheetDescription>
          </SheetHeader>
          
          <Tabs defaultValue="profile" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <ProfileTab 
                profile={profile} 
                walletAddress={walletAddress} 
                handleProfileChange={handleProfileChange} 
              />
            </TabsContent>
            
            <TabsContent value="preferences">
              <PreferencesTab 
                preferences={preferences} 
                handlePreferenceToggle={handlePreferenceToggle} 
              />
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 space-x-2 flex justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
