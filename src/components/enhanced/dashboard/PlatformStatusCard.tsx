
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Activity } from 'lucide-react';

interface PlatformHealth {
  platform: string;
  status: string;
}

interface PlatformStatusCardProps {
  healthStatus: PlatformHealth[];
  platformCounts: Record<string, number>;
}

export const PlatformStatusCard = ({ healthStatus, platformCounts }: PlatformStatusCardProps) => {
  const getStatusColor = (status: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case 'healthy': return 'default';
      case 'rate_limited': return 'secondary';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'rate_limited': return <Clock className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Health Status</CardTitle>
        <CardDescription>Real-time status of all connected platforms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthStatus.map(platform => (
            <div key={platform.platform} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(platform.status)}
                <div>
                  <div className="font-medium capitalize">{platform.platform}</div>
                  <div className="text-sm text-muted-foreground">
                    {(platformCounts[platform.platform] || 0)} items scraped
                  </div>
                </div>
              </div>
              <Badge variant={getStatusColor(platform.status)}>
                {platform.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
