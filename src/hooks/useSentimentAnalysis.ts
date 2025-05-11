
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  SentimentAnalysisRecord, 
  SentimentDetailRecord,
  SentimentInsightRecord,
  FeatureRequestRecord,
  PlatformType,
  TimeframeType
} from '@/types/sentiment';

export const useSentimentAnalysis = (platform: PlatformType = 'discord', timeframe: TimeframeType = '24h') => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fetch sentiment analysis records
  const { 
    data: analysisRecords,
    isLoading: isLoadingAnalysis,
    error: analysisError,
    refetch: refetchAnalysis 
  } = useQuery({
    queryKey: ['sentimentAnalysis', platform, timeframe],
    queryFn: async () => {
      let query = supabase
        .from('sentiment_analysis')
        .select('*')
        .order('analyzed_at', { ascending: false });
        
      if (platform !== 'all') {
        query = query.eq('platform', platform);
      }
      
      // Add timeframe filtering logic
      const now = new Date();
      let startDate;
      
      switch(timeframe) {
        case '24h':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
      }
      
      query = query.gte('analyzed_at', startDate.toISOString());
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as SentimentAnalysisRecord[];
    },
  });

  // Fetch sentiment details
  const { 
    data: detailsRecords,
    isLoading: isLoadingDetails,
    error: detailsError,
  } = useQuery({
    queryKey: ['sentimentDetails', analysisRecords ? analysisRecords.map(r => r.id) : []],
    queryFn: async () => {
      if (!analysisRecords || analysisRecords.length === 0) return [];
      
      const { data, error } = await supabase
        .from('sentiment_details')
        .select('*')
        .in('analysis_id', analysisRecords.map(r => r.id));
        
      if (error) throw error;
      return data as SentimentDetailRecord[];
    },
    enabled: !!analysisRecords && analysisRecords.length > 0,
  });

  // Fetch insights
  const { 
    data: insightsRecords,
    isLoading: isLoadingInsights,
    error: insightsError,
  } = useQuery({
    queryKey: ['sentimentInsights', analysisRecords ? analysisRecords.map(r => r.id) : []],
    queryFn: async () => {
      if (!analysisRecords || analysisRecords.length === 0) return [];
      
      const { data, error } = await supabase
        .from('sentiment_insights')
        .select('*')
        .in('analysis_id', analysisRecords.map(r => r.id));
        
      if (error) throw error;
      return data as SentimentInsightRecord[];
    },
    enabled: !!analysisRecords && analysisRecords.length > 0,
  });

  // Fetch feature requests
  const { 
    data: featureRecords,
    isLoading: isLoadingFeatures,
    error: featuresError,
  } = useQuery({
    queryKey: ['featureRequests', analysisRecords ? analysisRecords.map(r => r.id) : []],
    queryFn: async () => {
      if (!analysisRecords || analysisRecords.length === 0) return [];
      
      const { data, error } = await supabase
        .from('feature_requests')
        .select('*')
        .in('analysis_id', analysisRecords.map(r => r.id));
        
      if (error) throw error;
      return data as FeatureRequestRecord[];
    },
    enabled: !!analysisRecords && analysisRecords.length > 0,
  });

  // Function to trigger new sentiment analysis
  const analyzeSentiment = async (channel: string) => {
    setIsAnalyzing(true);
    try {
      const response = await supabase.functions.invoke('analyze-sentiment', {
        body: { platform, channel, timeframe },
      });

      if (!response.data.success) {
        throw new Error('Failed to analyze sentiment');
      }

      // Refetch the data after analysis
      await refetchAnalysis();
      return response.data;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analysisRecords,
    detailsRecords,
    insightsRecords,
    featureRecords,
    isLoading: isLoadingAnalysis || isLoadingDetails || isLoadingInsights || isLoadingFeatures,
    isAnalyzing,
    analyzeSentiment,
    error: analysisError || detailsError || insightsError || featuresError,
  };
};
