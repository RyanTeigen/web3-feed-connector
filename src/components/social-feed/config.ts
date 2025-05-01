
// Default configuration for the feed aggregator
export const DEFAULT_CONFIG = {
  display_name: "Autheo User",
  social_accounts: {
    twitter: "https://x.com/Autheo_Network",
    linkedin: "https://www.linkedin.com/company/autheo/",
    discord: "https://discord.gg/a9WQrEzD",
    telegram: "https://t.me/autheo"
  },
  update_frequency: 30, // in minutes
  content_filters: ["web3", "blockchain", "social"],
  display_preferences: {
    sort_by: "newest",
    media_display: "expanded",
    notification_level: "mentions"
  },
  auth_method: "wallet_signature",
  custom_theme: "default",
  language_preference: "en"
};

// Mock data for social feeds
export const SOCIAL_FEEDS = {
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
  ],
  linkedin: [
    {
      id: "l1",
      author: "Autheo",
      role: "Web3 Platform",
      content: "We're excited to announce our latest partnership with major blockchain infrastructure providers to enhance our decentralized social platform.",
      date: "1 week ago",
      likes: 87,
      comments: 12
    },
    {
      id: "l2",
      author: "Autheo",
      role: "Web3 Platform",
      content: "Join our upcoming webinar on how Web3 is transforming content creation and monetization for creators across the digital ecosystem.",
      date: "2 weeks ago",
      likes: 54,
      comments: 8
    },
    {
      id: "l3",
      author: "Autheo",
      role: "Web3 Platform",
      content: "Looking for talented developers passionate about Web3 technologies! Check out our careers page for exciting opportunities to join our growing team.",
      date: "3 weeks ago",
      likes: 132,
      comments: 23
    }
  ],
  telegram: [
    {
      id: "tg1",
      author: "Autheo Admin",
      content: "🚀 New protocol update v0.9.3 is now available! Check our GitHub for the details.",
      date: "1 day ago",
      views: 2456
    },
    {
      id: "tg2",
      author: "Autheo Admin",
      content: "Join our AMA session this Thursday at 3PM UTC with our lead developers to discuss upcoming features!",
      date: "3 days ago", 
      views: 1872
    },
    {
      id: "tg3",
      author: "Autheo Admin",
      content: "Community poll: What features would you like to see prioritized in our Q3 roadmap? Vote now!",
      date: "1 week ago",
      views: 3218
    }
  ]
};
