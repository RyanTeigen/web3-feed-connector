
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import SocialFeed from "@/components/SocialFeed";
import QuickLinks from "@/components/QuickLinks";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { InstallPrompt } from "@/components/mobile/InstallPrompt";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePullToRefresh } from "@/hooks/use-gestures";
import { useToast } from "@/hooks/use-toast";

const HomePage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleRefresh = () => {
    toast({
      title: "Refreshing",
      description: "Pulling latest updates...",
    });
    // In a real app, this would trigger data refresh
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const pullToRefreshHandlers = usePullToRefresh(handleRefresh);

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col" {...pullToRefreshHandlers}>
        <MobileHeader title="Autheo" />
        <div className="flex-1">
          <Hero />
          <div className="px-4 py-6 space-y-8">
            <Features />
            <QuickLinks />
          </div>
        </div>
        <InstallPrompt />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <Features />
      <SocialFeed />
      <QuickLinks />
      <InstallPrompt />
    </div>
  );
};

export default HomePage;
