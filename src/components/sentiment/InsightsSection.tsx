
import { SentimentInsightRecord } from '@/types/sentiment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Lightbulb, LineChart, AlertTriangle } from 'lucide-react';

interface InsightsSectionProps {
  insightsRecords: SentimentInsightRecord[];
}

export const InsightsSection = ({ insightsRecords }: InsightsSectionProps) => {
  if (insightsRecords.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No insights available</p>
      </div>
    );
  }
  
  // Group insights by type
  const trendInsights = insightsRecords.filter(insight => insight.insight_type === 'trend');
  const predictionInsights = insightsRecords.filter(insight => insight.insight_type === 'prediction');
  const suggestionInsights = insightsRecords.filter(insight => insight.insight_type === 'suggestion');
  
  // Get unique insights (by description) to avoid duplicates
  const uniqueInsights = (insights: SentimentInsightRecord[]): SentimentInsightRecord[] => {
    const seen = new Set<string>();
    return insights.filter(insight => {
      if (seen.has(insight.description)) {
        return false;
      }
      seen.add(insight.description);
      return true;
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <LineChart className="h-5 w-5" />
            Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uniqueInsights(trendInsights).length > 0 ? (
            <ul className="space-y-4">
              {uniqueInsights(trendInsights).slice(0, 5).map(insight => (
                <li key={insight.id} className="border-b pb-3 last:border-0">
                  <div className="flex items-start justify-between">
                    <p>{insight.description}</p>
                    <Badge variant="outline" className="ml-2 whitespace-nowrap">
                      {Math.round(insight.confidence_score)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(insight.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-4">No trends detected</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-purple-600">
            <Brain className="h-5 w-5" />
            Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uniqueInsights(predictionInsights).length > 0 ? (
            <ul className="space-y-4">
              {uniqueInsights(predictionInsights).slice(0, 5).map(insight => (
                <li key={insight.id} className="border-b pb-3 last:border-0">
                  <div className="flex items-start justify-between">
                    <p>{insight.description}</p>
                    <Badge variant="outline" className="ml-2 whitespace-nowrap">
                      {Math.round(insight.confidence_score)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(insight.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-4">No predictions available</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <Lightbulb className="h-5 w-5" />
            Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uniqueInsights(suggestionInsights).length > 0 ? (
            <ul className="space-y-4">
              {uniqueInsights(suggestionInsights).slice(0, 5).map(insight => (
                <li key={insight.id} className="border-b pb-3 last:border-0">
                  <div className="flex items-start justify-between">
                    <p>{insight.description}</p>
                    <Badge variant="outline" className="ml-2 whitespace-nowrap">
                      {Math.round(insight.confidence_score)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(insight.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-4">No suggestions available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
