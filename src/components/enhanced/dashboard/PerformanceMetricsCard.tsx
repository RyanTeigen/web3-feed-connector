
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const PerformanceMetricsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Detailed performance analytics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">API Response Time</span>
              <span className="text-sm text-muted-foreground">1.2s avg</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Rate Limit Usage</span>
              <span className="text-sm text-muted-foreground">65% utilized</span>
            </div>
            <Progress value={65} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Success Rate</span>
              <span className="text-sm text-muted-foreground">99.9%</span>
            </div>
            <Progress value={99.9} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
