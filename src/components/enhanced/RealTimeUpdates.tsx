
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Activity, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { ScrapedContent } from '@/services/socialMediaScraper';

export const RealTimeUpdates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);
  const [liveUpdates, setLiveUpdates] = useState<ScrapedContent[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');

  useEffect(() => {
    if (!user || !realtimeEnabled) return;

    setConnectionStatus('connecting');

    const channel = supabase
      .channel('social-media-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'social_media_content',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New content received:', payload);
          
          const newContent = payload.new as any;
          const contentData = newContent.content;
          
          const scrapedContent: ScrapedContent = {
            id: newContent.platform_content_id,
            platform: newContent.platform,
            author: contentData?.author || 'Unknown',
            content: contentData?.content || '',
            date: contentData?.date || '',
            engagement: contentData?.engagement,
            metadata: contentData?.metadata
          };

          setLiveUpdates(prev => [scrapedContent, ...prev.slice(0, 9)]);
          
          toast({
            title: "New content available",
            description: `Fresh ${newContent.platform} content has been scraped`,
            duration: 3000,
          });
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 'disconnected');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, realtimeEnabled, toast]);

  const toggleRealtime = () => {
    setRealtimeEnabled(!realtimeEnabled);
    if (!realtimeEnabled) {
      toast({
        title: "Real-time updates enabled",
        description: "You'll now receive live content updates",
      });
    } else {
      toast({
        title: "Real-time updates disabled",
        description: "You'll no longer receive live notifications",
      });
    }
  };

  const getConnectionBadge = () => {
    const variants = {
      connected: { variant: 'success' as const, text: 'Connected' },
      disconnected: { variant: 'destructive' as const, text: 'Disconnected' },
      connecting: { variant: 'secondary' as const, text: 'Connecting...' }
    };
    
    const config = variants[connectionStatus];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Updates
          </CardTitle>
          <div className="flex items-center gap-2">
            {getConnectionBadge()}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleRealtime}
              className="flex items-center gap-2"
            >
              {realtimeEnabled ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
              {realtimeEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {!realtimeEnabled ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Real-time updates are disabled</p>
            <p className="text-sm">Enable to receive live content notifications</p>
          </div>
        ) : liveUpdates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Waiting for new content...</p>
            <p className="text-sm">New scraped content will appear here automatically</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="font-medium">Recent Updates ({liveUpdates.length})</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {liveUpdates.map((item, index) => (
                <div key={`${item.id}-${index}`} className="p-3 border rounded-lg bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{item.platform}</Badge>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <div className="text-sm font-medium">{item.author}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
