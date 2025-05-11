
import { SentimentAnalysisRecord } from '@/types/sentiment';

interface FeaturesChartProps {
  analysisRecords: SentimentAnalysisRecord[];
}

export const FeaturesChart = ({ analysisRecords }: FeaturesChartProps) => {
  return (
    <div className="h-full flex items-center justify-center">
      <p className="text-muted-foreground">
        Feature requests chart will be generated from the actual feature request data.
      </p>
    </div>
  );
};
