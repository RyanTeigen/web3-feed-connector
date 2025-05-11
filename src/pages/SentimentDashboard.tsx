
import { useState } from 'react';
import { useSentimentAnalysis } from '@/hooks/useSentimentAnalysis';
import { PlatformType, TimeframeType, ChartViewType } from '@/types/sentiment';
import { ChartContainer } from '@/components/sentiment/ChartContainer';
import { SentimentHeader } from '@/components/sentiment/SentimentHeader';
import { SentimentFilters } from '@/components/sentiment/SentimentFilters';
import { EmotionsAnalysis } from '@/components/sentiment/EmotionsAnalysis';
import { TopicAnalysis } from '@/components/sentiment/TopicAnalysis';
import { FeatureRequestsTable } from '@/components/sentiment/FeatureRequestsTable';
import { InsightsSection } from '@/components/sentiment/InsightsSection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

const SentimentDashboard = () => {
  const [platform, setPlatform] = useState<PlatformType>('discord');
  const [timeframe, setTimeframe] = useState<TimeframeType>('24h');
  const [chartView, setChartView] = useState<ChartViewType>('sentiment');
  
  const {
    analysisRecords,
    detailsRecords,
    insightsRecords,
    featureRecords,
    isLoading,
    isAnalyzing,
    analyzeSentiment,
    error
  } = useSentimentAnalysis(platform, timeframe);

  const handleAnalyze = async (channel: string) => {
    try {
      await analyzeSentiment(channel);
    } catch (err) {
      console.error('Error in sentiment analysis:', err);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load sentiment data: {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <SentimentHeader isAnalyzing={isAnalyzing} onAnalyze={handleAnalyze} />
      
      <SentimentFilters
        platform={platform}
        timeframe={timeframe}
        onPlatformChange={setPlatform}
        onTimeframeChange={setTimeframe}
        chartView={chartView}
        onChartViewChange={setChartView}
      />

      <div className="mt-8 grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[400px] w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
          </div>
        ) : (
          <>
            <ChartContainer 
              analysisRecords={analysisRecords || []} 
              detailsRecords={detailsRecords || []} 
              chartView={chartView}
            />
            
            <div className="mt-8">
              <Tabs defaultValue="emotions" className="w-full">
                <TabsList>
                  <TabsTrigger value="emotions">Emotions Analysis</TabsTrigger>
                  <TabsTrigger value="topics">Topic Analysis</TabsTrigger>
                  <TabsTrigger value="features">Feature Requests</TabsTrigger>
                  <TabsTrigger value="insights">AI Insights</TabsTrigger>
                </TabsList>
                
                <TabsContent value="emotions" className="mt-4">
                  <EmotionsAnalysis detailsRecords={detailsRecords || []} />
                </TabsContent>
                
                <TabsContent value="topics" className="mt-4">
                  <TopicAnalysis analysisRecords={analysisRecords || []} />
                </TabsContent>
                
                <TabsContent value="features" className="mt-4">
                  <FeatureRequestsTable featureRecords={featureRecords || []} />
                </TabsContent>
                
                <TabsContent value="insights" className="mt-4">
                  <InsightsSection insightsRecords={insightsRecords || []} />
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SentimentDashboard;
