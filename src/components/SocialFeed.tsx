
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Twitter, MessageSquare, Youtube, Globe, Linkedin, Send } from "lucide-react";
import { TwitterFeed } from "./social-feed/TwitterFeed";
import { LinkedInFeed } from "./social-feed/LinkedInFeed";
import { DiscordFeed } from "./social-feed/DiscordFeed";
import { TelegramFeed } from "./social-feed/TelegramFeed";
import { YoutubeFeed } from "./social-feed/YoutubeFeed";
import { BlogFeed } from "./social-feed/BlogFeed";
import { ScraperControl } from "./scraper/ScraperControl";
import { DEFAULT_CONFIG } from "./social-feed/config";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useSocialMediaScraper } from "@/hooks/useSocialMediaScraper";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const SocialFeed = () => {
  const [activeTab, setActiveTab] = useState("twitter");
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [showScraperControl, setShowScraperControl] = useState(false);
  const { user } = useAuth();
  
  const {
    scrapedContent,
    isLoadingContent,
    contentError,
    getPlatformContent,
    isScrapingActive
  } = useSocialMediaScraper();

  if (!user) {
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
    if (isLoadingContent) {
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

    if (contentError) {
      return (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load content. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      );
    }

    // Get platform-specific content, fallback to mock data if no scraped content
    const platformContent = getPlatformContent(activeTab);
    const hasScrapedContent = platformContent.length > 0;

    return (
      <>
        {isScrapingActive && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Scraping in progress... New content will appear shortly.
            </AlertDescription>
          </Alert>
        )}

        <TabsContent value="twitter">
          <TwitterFeed 
            twitterUrl={config.social_accounts.twitter} 
            feedData={hasScrapedContent ? platformContent : undefined}
          />
        </TabsContent>
        
        <TabsContent value="linkedin">
          <LinkedInFeed 
            linkedinUrl={config.social_accounts.linkedin} 
            feedData={hasScrapedContent ? platformContent : undefined}
          />
        </TabsContent>
        
        <TabsContent value="discord">
          <DiscordFeed 
            discordUrl={config.social_accounts.discord} 
            feedData={hasScrapedContent ? platformContent : undefined}
          />
        </TabsContent>
        
        <TabsContent value="telegram">
          <TelegramFeed 
            telegramUrl={config.social_accounts.telegram} 
            feedData={hasScrapedContent ? platformContent : undefined}
          />
        </TabsContent>
        
        <TabsContent value="youtube">
          <YoutubeFeed 
            youtubeUrl="https://youtube.com/autheo" 
            feedData={hasScrapedContent ? platformContent : undefined}
          />
        </TabsContent>
        
        <TabsContent value="blog">
          <BlogFeed 
            blogUrl="https://blog.autheo.com" 
            feedData={hasScrapedContent ? platformContent : undefined}
          />
        </TabsContent>
      </>
    );
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-center">
            <span className="gradient-text">Autheo Social Feeds</span>
          </h2>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowScraperControl(!showScraperControl)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Scraper Settings
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Scraper Control Panel */}
        <Collapsible open={showScraperControl} onOpenChange={setShowScraperControl}>
          <CollapsibleContent className="mb-8">
            <ScraperControl />
          </CollapsibleContent>
        </Collapsible>
        
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
