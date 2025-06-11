
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, Settings } from 'lucide-react';
import { useSocialMediaScraper } from '@/hooks/useSocialMediaScraper';
import { scrapingEngine } from '@/services/enhanced/ScrapingEngine';
import { SystemMetricsGrid } from './dashboard/SystemMetricsGrid';
import { PlatformStatusCard } from './dashboard/PlatformStatusCard';
import { PerformanceMetricsCard } from './dashboard/PerformanceMetricsCard';
import { ContentStatsCard } from './dashboard/ContentStatsCard';

export const ScrapingDashboard = () => {
  const { isScrapingActive, totalContentCount, platformCounts } = useSocialMediaScraper();
  const [healthStatus, setHealthStatus] = useState<any[]>([]);
  const [systemMetrics] = useState({
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

      <SystemMetricsGrid metrics={systemMetrics} />

      <Tabs defaultValue="platforms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="platforms">Platform Status</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="content">Content Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-4">
          <PlatformStatusCard 
            healthStatus={healthStatus} 
            platformCounts={platformCounts} 
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceMetricsCard />
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <ContentStatsCard 
            totalContentCount={totalContentCount}
            platformCounts={platformCounts}
          />
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
