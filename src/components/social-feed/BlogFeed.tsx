
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SOCIAL_FEEDS } from "./config";
import { useTheme } from "@/context/ThemeContext";

interface BlogFeedProps {
  blogUrl: string;
  feedData?: any[];
}

export const BlogFeed = ({ blogUrl, feedData }: BlogFeedProps) => {
  const { theme } = useTheme();
  
  // If we have feed data from the API, use it. Otherwise, fall back to mock data
  const posts = feedData?.length ? feedData.map(item => item.content) : SOCIAL_FEEDS.blog;
  
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card 
          key={post.id} 
          className={`web3-card ${
            theme === "light" 
              ? "bg-white border-gray-200 text-gray-800" 
              : "bg-card border-border/40 text-foreground"
          }`}
        >
          <div className="space-y-3">
            <h3 className={`font-semibold text-xl ${theme === "light" ? "text-gray-800" : ""}`}>{post.title}</h3>
            <p className={`${theme === "light" ? "text-gray-600" : "text-muted-foreground"}`}>{post.excerpt}</p>
            <div className="flex items-center justify-between text-sm">
              <span className={`${theme === "light" ? "text-gray-500" : "text-muted-foreground"}`}>{post.readTime}</span>
              <span className={`${theme === "light" ? "text-gray-500" : "text-muted-foreground"}`}>{post.date}</span>
            </div>
            <Button variant="outline" className={
              theme === "light"
                ? "border-web3-vibrant-teal/40 hover:bg-web3-vibrant-teal/10 text-web3-vibrant-teal"
                : "border-web3-vibrant-teal/40 hover:bg-web3-vibrant-teal/10 text-web3-vibrant-teal"
            }>
              Read More
            </Button>
          </div>
        </Card>
      ))}
      <div className="flex justify-center mt-8">
        <Button asChild className="web3-button">
          <a href={blogUrl || "https://blog.autheo.com"} target="_blank" rel="noopener noreferrer">
            Visit Our Blog
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};
