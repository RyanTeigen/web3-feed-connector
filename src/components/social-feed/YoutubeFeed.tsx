
import { Card } from "@/components/ui/card";
import { Youtube, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SOCIAL_FEEDS } from "./config";

interface YoutubeFeedProps {
  youtubeUrl: string;
}

export const YoutubeFeed = ({ youtubeUrl }: YoutubeFeedProps) => {
  return (
    <div className="space-y-6">
      {SOCIAL_FEEDS.youtube.map((video) => (
        <Card key={video.id} className="web3-card overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/3">
              <div className="relative h-40 sm:h-full bg-muted">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-web3-deep-purple/80 flex items-center justify-center">
                    <Youtube className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 sm:w-2/3">
              <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <span>{video.views}</span>
                <span>•</span>
                <span>{video.date}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
      <div className="flex justify-center mt-8">
        <Button asChild className="web3-button">
          <a href={youtubeUrl || "https://youtube.com/autheo"} target="_blank" rel="noopener noreferrer">
            Visit YouTube Channel
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};
