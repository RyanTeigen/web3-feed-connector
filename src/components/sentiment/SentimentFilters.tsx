
import { PlatformType, TimeframeType, ChartViewType } from '@/types/sentiment';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  ToggleGroup,
  ToggleGroupItem
} from '@/components/ui/toggle-group';
import { MessageSquare, Globe, BarChart3, PieChart, LineChart, ListFilter } from 'lucide-react';

interface SentimentFiltersProps {
  platform: PlatformType;
  timeframe: TimeframeType;
  chartView: ChartViewType;
  onPlatformChange: (platform: PlatformType) => void;
  onTimeframeChange: (timeframe: TimeframeType) => void;
  onChartViewChange: (view: ChartViewType) => void;
}

export const SentimentFilters = ({
  platform,
  timeframe,
  chartView,
  onPlatformChange,
  onTimeframeChange,
  onChartViewChange
}: SentimentFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between bg-muted/40 p-4 rounded-lg">
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Platform:</span>
          <ToggleGroup type="single" value={platform} onValueChange={(value) => value && onPlatformChange(value as PlatformType)}>
            <ToggleGroupItem value="discord" aria-label="Discord">
              <MessageSquare className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="twitter" aria-label="Twitter">
              <MessageSquare className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="linkedin" aria-label="LinkedIn">
              <MessageSquare className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="all" aria-label="All platforms">
              <Globe className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Time:</span>
          <Select value={timeframe} onValueChange={(value) => onTimeframeChange(value as TimeframeType)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">View:</span>
        <ToggleGroup type="single" value={chartView} onValueChange={(value) => value && onChartViewChange(value as ChartViewType)}>
          <ToggleGroupItem value="sentiment" aria-label="Sentiment">
            <PieChart className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="emotions" aria-label="Emotions">
            <BarChart3 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="topics" aria-label="Topics">
            <ListFilter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="features" aria-label="Features">
            <LineChart className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};
