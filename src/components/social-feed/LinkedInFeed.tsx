
import { Card } from "@/components/ui/card";
import { Linkedin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SOCIAL_FEEDS } from "./config";

interface LinkedInFeedProps {
  linkedinUrl: string;
}

export const LinkedInFeed = ({ linkedinUrl }: LinkedInFeedProps) => {
  return (
    <div className="space-y-6">
      {SOCIAL_FEEDS.linkedin.map((post) => (
        <Card key={post.id} className="web3-card">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Linkedin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">{post.author}</div>
                  <div className="text-sm text-muted-foreground">{post.role}</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">{post.date}</div>
            </div>
            <p className="text-foreground">{post.content}</p>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>{post.likes} likes</span>
              <span>{post.comments} comments</span>
            </div>
          </div>
        </Card>
      ))}
      <div className="flex justify-center mt-8">
        <Button asChild className="web3-button">
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
            View LinkedIn Profile
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
};
