
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SOCIAL_FEEDS } from "./config";

interface BlogFeedProps {
  blogUrl: string;
}

export const BlogFeed = ({ blogUrl }: BlogFeedProps) => {
  return (
    <div className="space-y-6">
      {SOCIAL_FEEDS.blog.map((post) => (
        <Card key={post.id} className="web3-card">
          <div className="space-y-3">
            <h3 className="font-semibold text-xl">{post.title}</h3>
            <p className="text-muted-foreground">{post.excerpt}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{post.readTime}</span>
              <span className="text-muted-foreground">{post.date}</span>
            </div>
            <Button variant="outline" className="border-web3-vibrant-teal/40 hover:bg-web3-vibrant-teal/10 text-web3-vibrant-teal">
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
