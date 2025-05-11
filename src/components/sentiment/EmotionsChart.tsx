
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { SentimentDetailRecord } from '@/types/sentiment';

interface EmotionsChartProps {
  detailsRecords: SentimentDetailRecord[];
}

export const EmotionsChart = ({ detailsRecords }: EmotionsChartProps) => {
  // Process data for the chart - group by emotion type and average the percentages
  const emotionsMap = new Map<string, { total: number; count: number; keywords: string[] }>();
  
  detailsRecords.forEach(record => {
    const existingEmotion = emotionsMap.get(record.emotion_type);
    
    if (existingEmotion) {
      emotionsMap.set(record.emotion_type, {
        total: existingEmotion.total + record.percentage,
        count: existingEmotion.count + 1,
        keywords: [...new Set([...existingEmotion.keywords, ...record.keywords])].slice(0, 5)
      });
    } else {
      emotionsMap.set(record.emotion_type, {
        total: record.percentage,
        count: 1,
        keywords: record.keywords.slice(0, 5)
      });
    }
  });
  
  const chartData = Array.from(emotionsMap.entries()).map(([emotion, data]) => ({
    emotion,
    percentage: data.total / data.count,
    keywords: data.keywords.join(', ')
  }));
  
  // Sort emotions by percentage (highest first)
  chartData.sort((a, b) => b.percentage - a.percentage);
  
  // Color mapping for emotions
  const emotionColors: Record<string, string> = {
    excited: '#10b981',    // Green
    satisfied: '#3b82f6',  // Blue
    curious: '#6366f1',    // Indigo
    frustrated: '#ef4444', // Red
    confused: '#f59e0b',   // Amber
    disappointed: '#d946ef', // Fuchsia
    happy: '#22c55e',      // Green
    angry: '#dc2626',      // Red
    sad: '#6b7280',        // Gray
    neutral: '#9ca3af',    // Gray
  };
  
  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 70,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="emotion" 
            angle={-45} 
            textAnchor="end"
            height={70}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            unit="%" 
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Percentage']}
            labelFormatter={(label) => `Emotion: ${label}`}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="p-3 bg-background border rounded-md shadow-md">
                    <p className="font-medium capitalize">{data.emotion}</p>
                    <p>{`${data.percentage.toFixed(1)}%`}</p>
                    <p className="text-xs mt-2">Keywords: {data.keywords}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar 
            dataKey="percentage" 
            name="Percentage" 
            radius={[4, 4, 0, 0]}
            fill="#8884d8"
            isAnimationActive={true}
            animationDuration={1000}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={emotionColors[entry.emotion] || '#8884d8'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
