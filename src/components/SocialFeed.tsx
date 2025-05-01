
import { useState } from "react";
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

const SocialFeed = () => {
  const [activeTab, setActiveTab] = useState("twitter");
  // In a real application, this would come from user settings or API
  const [config, setConfig] = useState(DEFAULT_CONFIG);

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
          
          <TabsContent value="twitter">
            <TwitterFeed twitterUrl={config.social_accounts.twitter} />
          </TabsContent>
          
          <TabsContent value="linkedin">
            <LinkedInFeed linkedinUrl={config.social_accounts.linkedin} />
          </TabsContent>
          
          <TabsContent value="discord">
            <DiscordFeed discordUrl={config.social_accounts.discord} />
          </TabsContent>
          
          <TabsContent value="telegram">
            <TelegramFeed telegramUrl={config.social_accounts.telegram} />
          </TabsContent>
          
          <TabsContent value="youtube">
            <YoutubeFeed youtubeUrl="https://youtube.com/autheo" />
          </TabsContent>
          
          <TabsContent value="blog">
            <BlogFeed blogUrl="https://blog.autheo.com" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SocialFeed;
