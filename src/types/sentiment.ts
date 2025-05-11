
export interface SentimentSummary {
  positive: number;
  neutral: number;
  negative: number;
}

export interface SentimentTopics {
  main_topics: string[];
  trending: string[];
}

export interface EmotionData {
  type: string;
  percentage: number;
  keywords: string[];
}

export interface InsightData {
  type: string;
  description: string;
  confidenceScore: number;
}

export interface FeatureRequest {
  name: string;
  description: string;
  mentions: number;
}

export interface SentimentData {
  summary: SentimentSummary;
  topics: SentimentTopics;
  emotions: EmotionData[];
  insights: InsightData[];
  featureRequests: FeatureRequest[];
  messageCount: number;
  timestamp: string;
}

export interface SentimentAnalysisRecord {
  id: string;
  platform: string;
  channel_name: string;
  analyzed_at: string;
  sentiment_summary: SentimentSummary;
  topics: SentimentTopics;
  message_count: number;
  period: string;
}

export interface SentimentDetailRecord {
  id: string;
  analysis_id: string;
  emotion_type: string;
  percentage: number;
  keywords: string[];
}

export interface SentimentInsightRecord {
  id: string;
  analysis_id: string;
  insight_type: string;
  description: string;
  confidence_score: number;
  created_at: string;
}

export interface FeatureRequestRecord {
  id: string;
  analysis_id: string;
  feature_name: string;
  description: string;
  mention_count: number;
  first_mentioned: string;
  status: string;
}

export type PlatformType = "discord" | "twitter" | "linkedin" | "all";
export type TimeframeType = "24h" | "7d" | "30d" | "90d";
export type ChartViewType = "sentiment" | "emotions" | "topics" | "features";
