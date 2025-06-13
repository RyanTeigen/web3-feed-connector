
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share, ExternalLink } from "lucide-react";
import { useState } from "react";

interface MobileFeedCardProps {
  author: string;
  content: string;
  date: string;
  platform: string;
  avatar?: string;
  url?: string;
  platformIcon?: React.ComponentType<{ className?: string }>;
}

export const MobileFeedCard = ({ 
  author, 
  content, 
  date, 
  platform, 
  avatar, 
  url,
  platformIcon: PlatformIcon 
}: MobileFeedCardProps) => {
  const [liked, setLiked] = useState(false);

  return (
    <Card className="p-4 mb-4 bg-card border-border/40">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {avatar ? (
            <img 
              src={avatar} 
              alt={author} 
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              {PlatformIcon && <PlatformIcon className="h-5 w-5 text-primary" />}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-foreground truncate">{author}</p>
              <p className="text-xs text-muted-foreground">{date}</p>
            </div>
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
              {platform}
            </span>
          </div>
          
          <p className="text-sm text-foreground leading-relaxed mb-3">
            {content}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => setLiked(!liked)}
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <MessageSquare className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Share className="h-4 w-4" />
              </Button>
            </div>
            
            {url && (
              <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
