
import { Card } from "@/components/ui/card";
import { Send, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SOCIAL_FEEDS } from "./config";

interface TelegramFeedProps {
  telegramUrl: string;
}

export const TelegramFeed = ({ telegramUrl }: TelegramFeedProps) => {
  return (
    <div className="space-y-6">
      {SOCIAL_FEEDS.telegram.map((message) => (
        <Card key={message.id} className="web3-card">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-web3-vibrant-teal/20 flex items-center justify-center">
                  <Send className="h-5 w-5 text-web3-vibrant-teal" />
                </div>
                <div>
                  <div className="font-semibold">{message.author}</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">{message.date}</div>
            </div>
            <p className="text-foreground">{message.content}</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>{message.views} views</span>
            </div>
          </div>
        </Card>
      ))}
      <div className="flex justify-center mt-8">
        <Button asChild className="web3-button">
          <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
            Join Our Telegram
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};
