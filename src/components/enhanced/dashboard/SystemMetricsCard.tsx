
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface SystemMetricsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  valueClassName?: string;
}

export const SystemMetricsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  valueClassName = "" 
}: SystemMetricsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueClassName}`}>{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};
