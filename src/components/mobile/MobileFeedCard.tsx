
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useSwipeGesture } from "@/hooks/use-gestures";

interface MobileFeedCardProps {
  author: string;
  content: string;
  date: string;
  platform: string;
  avatar?: string;
  url?: string;
  platformIcon?: React.ComponentType<{ className?: string }>;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export const MobileFeedCard = ({ 
  author, 
  content, 
  date, 
  platform, 
  avatar, 
  url,
  platformIcon: PlatformIcon,
  onSwipeLeft,
  onSwipeRight
}: MobileFeedCardProps) => {
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft,
    onSwipeRight,
  });

  const handleShare = async () => {
    if (navigator.share && url) {
      try {
        await navigator.share({
          title: `Post by ${author}`,
          text: content,
          url: url,
        });
        setShared(true);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    // Add haptic feedback on mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <Card 
      className="p-4 mb-4 bg-card border-border/40 active:scale-[0.98] transition-transform duration-150"
      {...swipeHandlers}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {avatar ? (
            <img 
              src={avatar} 
              alt={author} 
              className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
              loading="lazy"
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
          
          <p className="text-sm text-foreground leading-relaxed mb-3 select-text">
            {content}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 active:scale-95 transition-transform"
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="sr-only">Like</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 px-3 active:scale-95 transition-transform"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="sr-only">Comment</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 px-3 active:scale-95 transition-transform"
                onClick={handleShare}
              >
                <Share className={`h-4 w-4 ${shared ? 'text-green-500' : ''}`} />
                <span className="sr-only">Share</span>
              </Button>
            </div>
            
            {url && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 px-3 active:scale-95 transition-transform" 
                asChild
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Open link</span>
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
