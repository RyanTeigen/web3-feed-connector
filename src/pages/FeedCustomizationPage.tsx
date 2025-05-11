
import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeedPreferences from "@/components/feed-customization/FeedPreferences";
import KeywordFilters from "@/components/feed-customization/KeywordFilters";
import UpdateSettings from "@/components/feed-customization/UpdateSettings";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const FeedCustomizationPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("preferences");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Reset saved status when tab changes
    setIsSaved(false);
  }, [activeTab]);

  // Show success message when settings are saved
  useEffect(() => {
    if (isSaved) {
      const timer = setTimeout(() => {
        setIsSaved(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSaved]);

  // Notify parent components when settings are saved
  const handleSaveSettings = () => {
    setIsSaved(true);
  };

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Feed Customization</span>
          </h1>
          <p className="text-muted-foreground">
            Personalize your Autheo feed experience to see the content that matters most to you.
          </p>
        </div>
        <div className="p-2 bg-secondary/20 rounded-full">
          <Shield className="h-8 w-8 text-secondary-foreground" />
        </div>
      </div>

      {!user && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to be logged in to save your feed preferences.
          </AlertDescription>
        </Alert>
      )}

      {isSaved && (
        <Alert className="mb-6 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
          <AlertDescription>Your feed preferences have been saved successfully!</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Feed Settings</CardTitle>
          <CardDescription>
            Customize how content appears in your feed, filter out unwanted topics, and set your update preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preferences" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preferences">Content Preferences</TabsTrigger>
              <TabsTrigger value="keywords">Keyword Filters</TabsTrigger>
              <TabsTrigger value="updates">Update Frequency</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preferences">
              <FeedPreferences onSave={handleSaveSettings} />
            </TabsContent>
            
            <TabsContent value="keywords">
              <KeywordFilters onSave={handleSaveSettings} />
            </TabsContent>
            
            <TabsContent value="updates">
              <UpdateSettings onSave={handleSaveSettings} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedCustomizationPage;
