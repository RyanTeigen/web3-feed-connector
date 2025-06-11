
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ContentStatsCardProps {
  totalContentCount: number;
  platformCounts: Record<string, number>;
}

export const ContentStatsCard = ({ totalContentCount, platformCounts }: ContentStatsCardProps) => {
  return (
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
                <Badge variant="secondary">{count as number}</Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
