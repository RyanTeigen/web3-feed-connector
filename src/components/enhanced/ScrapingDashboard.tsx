
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Database, 
  Settings, 
  TrendingUp,
  Zap
} from 'lucide-react';
import { useSocialMediaScraper } from '@/hooks/useSocialMediaScraper';
import { scrapingEngine } from '@/services/enhanced/ScrapingEngine';

export const ScrapingDashboard = () => {
  const { isScrapingActive, totalContentCount, platformCounts } = useSocialMediaScraper();
  const [healthStatus, setHealthStatus] = useState<any[]>([]);
  const [systemMetrics, setSystemMetrics] = useState({
    uptime: '99.9%',
    avgResponseTime: '1.2s',
    dailyRequests: 1247,
    errorRate: '0.1%'
  });

  useEffect(() => {
    const fetchHealthStatus = async () => {
      try {
        const health = await scrapingEngine.getScrapingHealth();
        setHealthStatus(health);
      } catch (error) {
        console.error('Failed to fetch health status:', error);
      }
    };

    fetchHealthStatus();
    const interval = setInterval(fetchHealthStatus, 30000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Scraping Dashboard</h2>
          <p className="text-muted-foreground">Monitor and manage social media content scraping</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Configure
        </Button>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemMetrics.uptime}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">Across all platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Requests</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.dailyRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemMetrics.errorRate}</div>
            <p className="text-xs text-muted-foreground">Within SLA limits</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="platforms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="platforms">Platform Status</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="content">Content Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-4">
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
                          {platformCounts[platform.platform] || 0} items scraped
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
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Statistics</CardTitle>
              <CardDescription>Overview of scraped content across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">{totalContentCount}</div>
                  <p className="text-sm text-muted-foreground">Total Content Items</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {Object.keys(platformCounts).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Active Platforms</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Platform Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(platformCounts).map(([platform, count]) => (
                    <div key={platform} className="flex justify-between items-center">
                      <span className="capitalize">{platform}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isScrapingActive && (
        <Alert>
          <Activity className="h-4 w-4" />
          <AlertDescription>
            Scraping operations are currently in progress. New content will appear automatically.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
