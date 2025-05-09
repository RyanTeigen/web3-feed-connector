
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useWeb3Auth } from "@/context/Web3AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export const ProfileOnboarding = () => {
  const { user } = useAuth();
  const { walletAddress } = useWeb3Auth();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    full_name: "",
    avatar_url: "",
  });
  const [preferences, setPreferences] = useState({
    theme: "dark",
    notification_enabled: true,
    feed_preferences: {
      twitter: true,
      discord: true,
      telegram: true,
      blog: true,
      youtube: true,
    },
  });
  const { toast } = useToast();

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePreferenceToggle = (key: string) => {
    if (key === "notification_enabled") {
      setPreferences({
        ...preferences,
        notification_enabled: !preferences.notification_enabled,
      });
    } else {
      setPreferences({
        ...preferences,
        feed_preferences: {
          ...preferences.feed_preferences,
          [key]: !preferences.feed_preferences[key as keyof typeof preferences.feed_preferences],
        },
      });
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          username: profile.username || user.email?.split("@")[0],
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
        })
        .eq("id", user.id);
        
      if (profileError) throw profileError;
      
      // Update preferences
      const { error: prefsError } = await supabase
        .from("user_preferences")
        .update({
          theme: preferences.theme,
          notification_enabled: preferences.notification_enabled,
          feed_preferences: preferences.feed_preferences,
        })
        .eq("user_id", user.id);
        
      if (prefsError) throw prefsError;
      
      toast({
        title: "Profile Updated",
        description: "Your profile and preferences have been saved.",
      });
      
      setOpen(false);
      
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load profile data
  const loadProfileData = async () => {
    if (!user) return;
    
    try {
      // Get profile data
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
      if (profileData) {
        setProfile({
          username: profileData.username || "",
          full_name: profileData.full_name || "",
          avatar_url: profileData.avatar_url || "",
        });
      }
      
      // Get preferences
      const { data: prefsData } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();
        
      if (prefsData) {
        setPreferences({
          theme: prefsData.theme || "dark",
          notification_enabled: prefsData.notification_enabled,
          feed_preferences: prefsData.feed_preferences || {
            twitter: true,
            discord: true,
            telegram: true,
            blog: true,
            youtube: true,
          },
        });
      }
      
    } catch (error) {
      console.error("Error loading profile data:", error);
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
            
            <TabsContent value="profile" className="space-y-4 py-4">
              {walletAddress && (
                <div className="p-3 bg-muted rounded-md">
                  <Label className="text-xs text-muted-foreground">Connected Wallet</Label>
                  <p className="font-mono text-sm mt-1">
                    {walletAddress}
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={profile.username}
                  onChange={handleProfileChange}
                  placeholder="Enter a username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={profile.full_name}
                  onChange={handleProfileChange}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  name="avatar_url"
                  value={profile.avatar_url}
                  onChange={handleProfileChange}
                  placeholder="Enter avatar URL"
                />
                {profile.avatar_url && (
                  <div className="mt-2 flex justify-center">
                    <img
                      src={profile.avatar_url}
                      alt="Avatar preview"
                      className="h-16 w-16 rounded-full object-cover border border-border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + (profile.username || 'User');
                      }}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about activity
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={preferences.notification_enabled}
                  onCheckedChange={() => handlePreferenceToggle("notification_enabled")}
                />
              </div>
              
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-medium mb-3">Feed Preferences</h3>
                <div className="space-y-3">
                  {Object.entries(preferences.feed_preferences).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={`feed-${key}`} className="capitalize">
                        {key}
                      </Label>
                      <Switch
                        id={`feed-${key}`}
                        checked={value}
                        onCheckedChange={() => handlePreferenceToggle(key)}
                      />
                    </div>
                  ))}
                </div>
              </div>
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
