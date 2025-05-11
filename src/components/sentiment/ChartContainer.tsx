
import { SentimentAnalysisRecord, SentimentDetailRecord, ChartViewType } from '@/types/sentiment';
import { SentimentChart } from './SentimentChart';
import { EmotionsChart } from './EmotionsChart';
import { TopicsChart } from './TopicsChart';
import { FeaturesChart } from './FeaturesChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface ChartContainerProps {
  analysisRecords: SentimentAnalysisRecord[];
  detailsRecords: SentimentDetailRecord[];
  chartView: ChartViewType;
}

export const ChartContainer = ({ 
  analysisRecords, 
  detailsRecords,
  chartView 
}: ChartContainerProps) => {
  // Check if we have data to display
  if (analysisRecords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            No Data Available
          </CardTitle>
          <CardDescription>
            Run a sentiment analysis to see results here.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Get the most recent record for summary metrics
  const latestRecord = analysisRecords[0];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {chartView === 'sentiment' && 'Sentiment Analysis'}
          {chartView === 'emotions' && 'Emotions Analysis'}
          {chartView === 'topics' && 'Topic Analysis'}
          {chartView === 'features' && 'Feature Requests Trends'}
        </CardTitle>
        <CardDescription>
          Based on {latestRecord.message_count.toLocaleString()} messages from {latestRecord.platform} - {latestRecord.channel_name}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[400px] w-full">
          {chartView === 'sentiment' && <SentimentChart analysisRecords={analysisRecords} />}
          {chartView === 'emotions' && <EmotionsChart detailsRecords={detailsRecords} />}
          {chartView === 'topics' && <TopicsChart analysisRecords={analysisRecords} />}
          {chartView === 'features' && <FeaturesChart analysisRecords={analysisRecords} />}
        </div>
      </CardContent>
    </Card>
  );
};
