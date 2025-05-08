
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Twitter, MessageSquare, Youtube, Globe, Linkedin, Send } from "lucide-react";
import { TwitterFeed } from "./social-feed/TwitterFeed";
import { LinkedInFeed } from "./social-feed/LinkedInFeed";
import { DiscordFeed } from "./social-feed/DiscordFeed";
import { TelegramFeed } from "./social-feed/TelegramFeed";
import { YoutubeFeed } from "./social-feed/YoutubeFeed";
import { BlogFeed } from "./social-feed/BlogFeed";
import { DEFAULT_CONFIG } from "./social-feed/config";
import { ThemeToggle } from "./ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const fetchSocialFeed = async (platform: string, userId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke("fetch-social-feeds", {
      body: { platform, user_id: userId },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching social feed:", error);
    throw new Error("Failed to fetch social feed data");
  }
};

const SocialFeed = () => {
  const [activeTab, setActiveTab] = useState("twitter");
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const { user } = useAuth();
  
  const userId = user?.id || "";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["socialFeed", activeTab, userId],
    queryFn: () => fetchSocialFeed(activeTab, userId),
    enabled: !!userId,
  });

  if (!userId) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need to be logged in to view social feeds.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const renderFeedContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-md p-4 bg-card">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
              <Skeleton className="h-20 w-full mt-4" />
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load content"}
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <>
        <TabsContent value="twitter">
          <TwitterFeed twitterUrl={config.social_accounts.twitter} feedData={data?.content} />
        </TabsContent>
        
        <TabsContent value="linkedin">
          <LinkedInFeed linkedinUrl={config.social_accounts.linkedin} feedData={data?.content} />
        </TabsContent>
        
        <TabsContent value="discord">
          <DiscordFeed discordUrl={config.social_accounts.discord} feedData={data?.content} />
        </TabsContent>
        
        <TabsContent value="telegram">
          <TelegramFeed telegramUrl={config.social_accounts.telegram} feedData={data?.content} />
        </TabsContent>
        
        <TabsContent value="youtube">
          <YoutubeFeed youtubeUrl="https://youtube.com/autheo" feedData={data?.content} />
        </TabsContent>
        
        <TabsContent value="blog">
          <BlogFeed blogUrl="https://blog.autheo.com" feedData={data?.content} />
        </TabsContent>
      </>
    );
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-center">
            <span className="gradient-text">Autheo Social Feeds</span>
          </h2>
          <ThemeToggle />
        </div>
        
        <Tabs defaultValue="twitter" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="twitter" className="flex items-center space-x-2">
              <Twitter className="h-4 w-4" />
              <span>Twitter</span>
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center space-x-2">
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn</span>
            </TabsTrigger>
            <TabsTrigger value="discord" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Discord</span>
            </TabsTrigger>
            <TabsTrigger value="telegram" className="flex items-center space-x-2">
              <Send className="h-4 w-4" />
              <span>Telegram</span>
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center space-x-2">
              <Youtube className="h-4 w-4" />
              <span>YouTube</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Blog</span>
            </TabsTrigger>
          </TabsList>
          
          {renderFeedContent()}
        </Tabs>
      </div>
    </div>
  );
};

export default SocialFeed;
