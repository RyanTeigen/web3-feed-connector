
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { SentimentAnalysisRecord } from '@/types/sentiment';
import { Card, CardContent } from '@/components/ui/card';

interface SentimentChartProps {
  analysisRecords: SentimentAnalysisRecord[];
}

export const SentimentChart = ({ analysisRecords }: SentimentChartProps) => {
  if (!analysisRecords.length) return null;

  // Get the latest analysis record
  const latestRecord = analysisRecords[0];
  const { sentiment_summary } = latestRecord;

  // Format data for the pie chart
  const data = [
    { name: 'Positive', value: sentiment_summary.positive },
    { name: 'Neutral', value: sentiment_summary.neutral },
    { name: 'Negative', value: sentiment_summary.negative }
  ];

  const COLORS = ['#10b981', '#6b7280', '#ef4444'];

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      <ResponsiveContainer width="50%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => `${value.toFixed(1)}%`} 
            labelFormatter={() => 'Sentiment'} 
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-col justify-center gap-4 w-full md:w-1/2">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <h3 className="text-2xl font-bold text-emerald-500">
                  {sentiment_summary.positive.toFixed(1)}%
                </h3>
                <p className="text-muted-foreground">Positive</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-500">
                  {sentiment_summary.neutral.toFixed(1)}%
                </h3>
                <p className="text-muted-foreground">Neutral</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-500">
                  {sentiment_summary.negative.toFixed(1)}%
                </h3>
                <p className="text-muted-foreground">Negative</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Key Topics</h3>
          <div className="flex flex-wrap gap-2">
            {latestRecord.topics.main_topics.map((topic, index) => (
              <span 
                key={index} 
                className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Trending</h3>
          <div className="flex flex-wrap gap-2">
            {latestRecord.topics.trending.map((trend, index) => (
              <span 
                key={index} 
                className="px-3 py-1 rounded-full text-xs bg-secondary/10 text-secondary"
              >
                {trend}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
