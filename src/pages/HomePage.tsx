
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import SocialFeed from "@/components/SocialFeed";
import QuickLinks from "@/components/QuickLinks";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";

const HomePage = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col">
        <MobileHeader title="Autheo" />
        <div className="flex-1">
          <Hero />
          <div className="px-4 py-6 space-y-8">
            <Features />
            <QuickLinks />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <Features />
      <SocialFeed />
      <QuickLinks />
    </div>
  );
};

export default HomePage;
