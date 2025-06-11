
import { ScrapingDashboard } from "@/components/enhanced/ScrapingDashboard";
import { RealTimeUpdates } from "@/components/enhanced/RealTimeUpdates";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ProductionDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to be logged in to access the production dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ScrapingDashboard />
          </div>
          <div>
            <RealTimeUpdates />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionDashboard;
