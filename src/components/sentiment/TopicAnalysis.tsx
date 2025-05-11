
import { useState } from 'react';
import { SentimentAnalysisRecord } from '@/types/sentiment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ListFilter, TrendingUp } from 'lucide-react';

interface TopicAnalysisProps {
  analysisRecords: SentimentAnalysisRecord[];
}

export const TopicAnalysis = ({ analysisRecords }: TopicAnalysisProps) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  if (analysisRecords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No topic data available</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  // Process topic data from all records
  const allMainTopics = new Set<string>();
  const allTrendingTopics = new Set<string>();
  
  analysisRecords.forEach(record => {
    (record.topics.main_topics || []).forEach(topic => allMainTopics.add(topic));
    (record.topics.trending || []).forEach(topic => allTrendingTopics.add(topic));
  });

  // Find occurrences of selected topic across analysis records
  const topicOccurrences = selectedTopic ? 
    analysisRecords.filter(record => 
      record.topics.main_topics.includes(selectedTopic) || 
      record.topics.trending.includes(selectedTopic)
    ).length : 0;
  
  const topicPercentage = selectedTopic ? 
    Math.round((topicOccurrences / analysisRecords.length) * 100) : 0;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <ListFilter className="h-5 w-5" />
            Topic Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Main Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(allMainTopics).map(topic => (
                    <Badge 
                      key={topic} 
                      variant={selectedTopic === topic ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Trending Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(allTrendingTopics).map(topic => (
                    <Badge 
                      key={topic} 
                      variant={selectedTopic === topic ? "secondary" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Topic Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedTopic ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">{selectedTopic}</h3>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Frequency</span>
                  <span className="text-sm font-medium">{topicPercentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${topicPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Found in</h4>
                <p className="text-sm">{topicOccurrences} of {analysisRecords.length} analyses</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Platforms</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(
                    analysisRecords
                      .filter(record => record.topics.main_topics.includes(selectedTopic) || record.topics.trending.includes(selectedTopic))
                      .map(record => record.platform)
                  )).map(platform => (
                    <Badge key={platform} variant="outline" className="capitalize">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-center">
              <p className="text-muted-foreground">
                Select a topic to see insights
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
