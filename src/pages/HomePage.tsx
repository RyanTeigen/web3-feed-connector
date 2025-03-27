
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import SocialFeed from "@/components/SocialFeed";
import QuickLinks from "@/components/QuickLinks";

const HomePage = () => {
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
