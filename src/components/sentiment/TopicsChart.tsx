
import { useState } from 'react';
import { SentimentAnalysisRecord } from '@/types/sentiment';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface TopicsChartProps {
  analysisRecords: SentimentAnalysisRecord[];
}

export const TopicsChart = ({ analysisRecords }: TopicsChartProps) => {
  const [topicType, setTopicType] = useState<'main_topics' | 'trending'>('main_topics');
  
  if (analysisRecords.length === 0) {
    return <div>No data available</div>;
  }

  // Process topic data from all records
  const topicFrequency = new Map<string, number>();
  analysisRecords.forEach(record => {
    const topics = record.topics[topicType] || [];
    topics.forEach(topic => {
      topicFrequency.set(topic, (topicFrequency.get(topic) || 0) + 1);
    });
  });
  
  // Convert to array and sort by frequency
  const sortedTopics = Array.from(topicFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30); // Limit to top 30 topics

  const getBadgeSize = (frequency: number): string => {
    const maxFrequency = sortedTopics[0]?.[1] || 1;
    const ratio = frequency / maxFrequency;
    
    if (ratio > 0.8) return 'text-xl font-bold';
    if (ratio > 0.6) return 'text-lg font-semibold';
    if (ratio > 0.4) return 'text-base font-medium';
    if (ratio > 0.2) return 'text-sm';
    return 'text-xs';
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs value={topicType} onValueChange={(v) => setTopicType(v as 'main_topics' | 'trending')}>
        <TabsList className="mb-4">
          <TabsTrigger value="main_topics">Main Topics</TabsTrigger>
          <TabsTrigger value="trending">Trending Topics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="main_topics" className="flex-1 overflow-auto">
          <div className="flex flex-wrap gap-3 justify-center items-center p-4">
            {sortedTopics.map(([topic, frequency]) => (
              <Badge 
                key={topic} 
                variant="outline" 
                className={`${getBadgeSize(frequency)} px-3 py-1 cursor-default transition-all hover:bg-primary/20`}
              >
                {topic}
                <span className="ml-1 text-muted-foreground text-xs">({frequency})</span>
              </Badge>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="trending" className="flex-1 overflow-auto">
          <div className="flex flex-wrap gap-3 justify-center items-center p-4">
            {sortedTopics.map(([topic, frequency]) => (
              <Badge 
                key={topic} 
                variant="secondary" 
                className={`${getBadgeSize(frequency)} px-3 py-1 cursor-default transition-all hover:bg-secondary/20`}
              >
                {topic}
                <span className="ml-1 text-muted-foreground text-xs">({frequency})</span>
              </Badge>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
