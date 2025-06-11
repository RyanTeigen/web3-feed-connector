
import { TrendingUp, Zap, Database, Activity } from 'lucide-react';
import { SystemMetricsCard } from './SystemMetricsCard';

interface SystemMetrics {
  uptime: string;
  avgResponseTime: string;
  dailyRequests: number;
  errorRate: string;
}

interface SystemMetricsGridProps {
  metrics: SystemMetrics;
}

export const SystemMetricsGrid = ({ metrics }: SystemMetricsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <SystemMetricsCard
        title="System Uptime"
        value={metrics.uptime}
        description="Last 30 days"
        icon={TrendingUp}
        valueClassName="text-green-600"
      />
      
      <SystemMetricsCard
        title="Avg Response Time"
        value={metrics.avgResponseTime}
        description="Across all platforms"
        icon={Zap}
      />
      
      <SystemMetricsCard
        title="Daily Requests"
        value={metrics.dailyRequests.toLocaleString()}
        description="+12% from yesterday"
        icon={Database}
      />
      
      <SystemMetricsCard
        title="Error Rate"
        value={metrics.errorRate}
        description="Within SLA limits"
        icon={Activity}
        valueClassName="text-green-600"
      />
    </div>
  );
};
