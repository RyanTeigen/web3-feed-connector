
import { Card } from "@/components/ui/card";
import { MessageSquare, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SOCIAL_FEEDS } from "./config";

interface DiscordFeedProps {
  discordUrl: string;
  feedData?: any[];
}

export const DiscordFeed = ({ discordUrl, feedData }: DiscordFeedProps) => {
  // If we have feed data from the API, use it. Otherwise, fall back to mock data
  const messages = feedData?.length ? feedData.map(item => item.content) : SOCIAL_FEEDS.discord;
  
  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <Card key={message.id} className="web3-card">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-web3-electric-blue/20 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-web3-electric-blue" />
                </div>
                <div>
                  <div className="font-semibold">{message.author}</div>
                  <div className="text-sm text-muted-foreground">{message.channel}</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">{message.date}</div>
            </div>
            <p className="text-foreground">{message.content}</p>
          </div>
        </Card>
      ))}
      <div className="flex justify-center mt-8">
        <Button asChild className="web3-button">
          <a href={discordUrl} target="_blank" rel="noopener noreferrer">
            Join Our Discord
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};
