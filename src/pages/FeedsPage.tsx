
import SocialFeed from "@/components/SocialFeed";

const FeedsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold mb-6">
            <span className="gradient-text">Autheo Social Feeds</span>
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-12">
            Stay updated with all the latest news, announcements, and discussions from Autheo across 
            various social platforms in one centralized location.
          </p>
        </div>
      </div>
      <SocialFeed />
    </div>
  );
};

export default FeedsPage;
