
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart, Activity, RefreshCcw } from 'lucide-react';

interface SentimentHeaderProps {
  isAnalyzing: boolean;
  onAnalyze: (channel: string) => Promise<void>;
}

export const SentimentHeader = ({ isAnalyzing, onAnalyze }: SentimentHeaderProps) => {
  const [channel, setChannel] = useState('general');
  
  const handleAnalyze = () => {
    if (channel.trim()) {
      onAnalyze(channel);
    }
  };
  
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Sentiment Analysis Dashboard</h1>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Monitor and analyze social media sentiment for Autheo's community platforms.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <div className="flex-1">
          <Input
            placeholder="Enter channel name (e.g. general)"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          />
        </div>
        <Button onClick={handleAnalyze} disabled={isAnalyzing} className="gap-2">
          {isAnalyzing ? (
            <>
              <RefreshCcw className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <BarChart className="h-4 w-4" />
              Analyze Sentiment
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
