
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Twitter, MessageSquare, Youtube, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for social feeds
const SOCIAL_FEEDS = {
  twitter: [
    {
      id: "t1",
      author: "Autheo",
      handle: "@AutheoProject",
      content: "Excited to announce our new partnership with a leading Web3 infrastructure provider! This collaboration will help us scale our decentralized social platform. #Web3 #Blockchain",
      date: "2 hours ago",
      likes: 145,
      retweets: 32
    },
    {
      id: "t2",
      author: "Autheo",
      handle: "@AutheoProject",
      content: "Join us for our community call tomorrow where we'll discuss the roadmap for Q3 and our plans for expanding the Autheo ecosystem. Don't miss it!",
      date: "1 day ago",
      likes: 87,
      retweets: 19
    },
    {
      id: "t3",
      author: "Autheo",
      handle: "@AutheoProject",
      content: "How decentralized social media is changing the creator economy. Read our latest blog post to learn more about earning opportunities in Web3 social platforms.",
      date: "3 days ago",
      likes: 210,
      retweets: 54
    }
  ],
  discord: [
    {
      id: "d1",
      channel: "#announcements",
      author: "Autheo Team",
      content: "We've just released v0.9.2 of our protocol. Check the changelog for details on new features and improvements!",
      date: "5 hours ago"
    },
    {
      id: "d2",
      channel: "#general",
      author: "Autheo Team",
      content: "The community incentive program is now live! Start contributing to earn Autheo tokens and NFT rewards.",
      date: "2 days ago"
    },
    {
      id: "d3",
      channel: "#dev-discussion",
      author: "Autheo Team",
      content: "Calling all developers! We're hosting a hackathon next month focused on building dApps on the Autheo protocol. Registration opens next week.",
      date: "4 days ago"
    }
  ],
  youtube: [
    {
      id: "y1",
      title: "Autheo Protocol Explained: A Deep Dive",
      thumbnail: "https://via.placeholder.com/320x180.png?text=Autheo+Protocol+Explained",
      views: "12K views",
      date: "2 weeks ago"
    },
    {
      id: "y2",
      title: "How to Build on Autheo - Developer Tutorial",
      thumbnail: "https://via.placeholder.com/320x180.png?text=Developer+Tutorial",
      views: "8.5K views",
      date: "1 month ago"
    },
    {
      id: "y3",
      title: "The Future of Social Media: Web3 Revolution",
      thumbnail: "https://via.placeholder.com/320x180.png?text=Web3+Revolution",
      views: "24K views",
      date: "2 months ago"
    }
  ],
  blog: [
    {
      id: "b1",
      title: "Decentralized Identity: The Cornerstone of Web3 Social",
      excerpt: "Explore how Autheo is revolutionizing digital identity in the social media landscape through blockchain technology.",
      readTime: "5 min read",
      date: "Last week"
    },
    {
      id: "b2",
      title: "Tokenomics Explained: How Autheo's Economic Model Works",
      excerpt: "A comprehensive breakdown of Autheo's token utility, distribution, and governance mechanisms.",
      readTime: "8 min read",
      date: "2 weeks ago"
    },
    {
      id: "b3",
      title: "From Web2 to Web3: Migrating Your Social Presence",
      excerpt: "Step-by-step guide on transitioning your online presence to decentralized platforms like Autheo.",
      readTime: "6 min read",
      date: "1 month ago"
    }
  ]
};

const SocialFeed = () => {
  const [activeTab, setActiveTab] = useState("twitter");

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold mb-10 text-center">
          <span className="gradient-text">Autheo Social Feeds</span>
        </h2>
        
        <Tabs defaultValue="twitter" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="twitter" className="flex items-center space-x-2">
              <Twitter className="h-4 w-4" />
              <span>Twitter</span>
            </TabsTrigger>
            <TabsTrigger value="discord" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Discord</span>
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center space-x-2">
              <Youtube className="h-4 w-4" />
              <span>YouTube</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Blog</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="twitter" className="space-y-6">
            {SOCIAL_FEEDS.twitter.map((tweet) => (
              <Card key={tweet.id} className="web3-card">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-web3-deep-purple/20 flex items-center justify-center">
                        <Twitter className="h-5 w-5 text-web3-deep-purple" />
                      </div>
                      <div>
                        <div className="font-semibold">{tweet.author}</div>
                        <div className="text-sm text-muted-foreground">{tweet.handle}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{tweet.date}</div>
                  </div>
                  <p className="text-foreground">{tweet.content}</p>
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <span>{tweet.likes} likes</span>
                    <span>{tweet.retweets} retweets</span>
                  </div>
                </div>
              </Card>
            ))}
            <div className="flex justify-center mt-8">
              <Button asChild className="web3-button">
                <a href="https://twitter.com/AutheoProject" target="_blank" rel="noopener noreferrer">
                  View More Tweets
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="discord" className="space-y-6">
            {SOCIAL_FEEDS.discord.map((message) => (
              <Card key={message.id} className="web3-card">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-web3-electric-blue/20 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-web3-electric-blue" />
                      </div>
                      <div>
                        <div className="font-semibold">{message.author}</div>
                        <div className="text-sm text-muted-foreground">{message.channel}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{message.date}</div>
                  </div>
                  <p className="text-foreground">{message.content}</p>
                </div>
              </Card>
            ))}
            <div className="flex justify-center mt-8">
              <Button asChild className="web3-button">
                <a href="https://discord.gg/autheo" target="_blank" rel="noopener noreferrer">
                  Join Our Discord
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="youtube" className="space-y-6">
            {SOCIAL_FEEDS.youtube.map((video) => (
              <Card key={video.id} className="web3-card overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/3">
                    <div className="relative h-40 sm:h-full bg-muted">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-web3-deep-purple/80 flex items-center justify-center">
                          <Youtube className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 sm:w-2/3">
                    <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                    <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                      <span>{video.views}</span>
                      <span>•</span>
                      <span>{video.date}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            <div className="flex justify-center mt-8">
              <Button asChild className="web3-button">
                <a href="https://youtube.com/autheo" target="_blank" rel="noopener noreferrer">
                  Visit YouTube Channel
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="blog" className="space-y-6">
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
                <a href="https://blog.autheo.com" target="_blank" rel="noopener noreferrer">
                  Visit Our Blog
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SocialFeed;
