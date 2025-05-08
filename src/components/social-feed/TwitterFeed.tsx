
import { Card } from "@/components/ui/card";
import { Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { SOCIAL_FEEDS } from "./config";

interface TwitterFeedProps {
  twitterUrl: string;
  feedData?: any[];
}

export const TwitterFeed = ({ twitterUrl, feedData }: TwitterFeedProps) => {
  // If we have feed data from the API, use it. Otherwise, fall back to mock data
  const tweets = feedData?.length ? feedData.map(item => item.content) : SOCIAL_FEEDS.twitter;

  return (
    <div className="space-y-6">
      {tweets.map((tweet: any, index: number) => (
        <Card key={tweet.id || index} className="web3-card">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-web3-deep-purple/20 flex items-center justify-center">
                  <Twitter className="h-5 w-5 text-web3-deep-purple" />
                </div>
                <div>
                  <div className="font-semibold">{tweet.author}</div>
                  <div className="text-sm text-muted-foreground">{tweet.handle}</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">{tweet.date}</div>
            </div>
            <p className="text-foreground">{tweet.content}</p>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>{tweet.likes} likes</span>
              <span>{tweet.retweets} retweets</span>
            </div>
          </div>
        </Card>
      ))}
      <div className="flex justify-center mt-8">
        <Button asChild className="web3-button">
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
            View More Tweets
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};
