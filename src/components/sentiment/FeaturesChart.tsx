
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SentimentAnalysisRecord, FeatureRequestRecord } from '@/types/sentiment';

interface FeaturesChartProps {
  analysisRecords: SentimentAnalysisRecord[];
  featureRecords?: FeatureRequestRecord[];
}

export const FeaturesChart = ({ analysisRecords, featureRecords = [] }: FeaturesChartProps) => {
  // If we don't have feature records data, show a placeholder
  if (!featureRecords || featureRecords.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">
          No feature request data available. Run an analysis to generate feature insights.
        </p>
      </div>
    );
  }

  // Group feature requests by name and count mentions
  const featureMap = new Map<string, {mentions: number, analysisIds: Set<string>}>();
  
  featureRecords.forEach(record => {
    const existing = featureMap.get(record.feature_name);
    
    if (existing) {
      existing.mentions += record.mention_count;
      existing.analysisIds.add(record.analysis_id);
    } else {
      featureMap.set(record.feature_name, {
        mentions: record.mention_count,
        analysisIds: new Set([record.analysis_id])
      });
    }
  });
  
  // Sort features by total mentions (highest first)
  const sortedFeatures = Array.from(featureMap.entries())
    .sort((a, b) => b[1].mentions - a[1].mentions)
    .slice(0, 5); // Take top 5 features
  
  // Prepare data for chart - format shows feature mentions across analysis records
  const analysisMap = new Map<string, string>();
  analysisRecords.forEach(record => {
    const date = new Date(record.analyzed_at);
    analysisMap.set(record.id, date.toLocaleDateString());
  });
  
  // Create chart data
  const chartData = Array.from(analysisMap.entries()).map(([id, date]) => {
    const dataPoint: {[key: string]: any} = { date };
    
    sortedFeatures.forEach(([featureName, featureData]) => {
      // If this analysis included this feature, add its mention count
      const relevantFeatureRecord = featureRecords.find(
        record => record.analysis_id === id && record.feature_name === featureName
      );
      
      dataPoint[featureName] = relevantFeatureRecord ? relevantFeatureRecord.mention_count : 0;
    });
    
    return dataPoint;
  });
  
  // Sort chart data by date
  chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Colors for different features
  const featureColors = [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber
    '#6366f1', // Indigo
    '#d946ef', // Fuchsia
  ];
  
  return (
    <div className="h-full">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
              label={{ value: 'Mentions', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value) => [`${value} mentions`, '']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            {sortedFeatures.map(([featureName, _], index) => (
              <Line
                key={featureName}
                type="monotone"
                dataKey={featureName}
                stroke={featureColors[index % featureColors.length]}
                activeDot={{ r: 8 }}
                name={featureName}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">
            Not enough data points to generate a feature trends chart.
          </p>
        </div>
      )}
    </div>
  );
};
