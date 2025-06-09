
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ScrapedContent {
  id: string;
  platform: string;
  author: string;
  content: string;
  date: string;
  engagement?: {
    likes?: number;
    shares?: number;
    comments?: number;
    views?: number;
  };
  metadata?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, userId, keywords = [], maxResults = 10, timeRange = '24h' } = await req.json();
    
    console.log(`Scraping ${platform} for user ${userId}`);
    console.log(`Keywords: ${keywords.join(', ')}`);
    console.log(`Max results: ${maxResults}, Time range: ${timeRange}`);

    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // For now, generate mock data that resembles real scraped content
    // In a real implementation, this would use actual scraping APIs
    const mockContent = await generateMockContent(platform, keywords, maxResults);

    // Store the analytics for this scraping session
    await logScrapingAnalytics(supabase, userId, platform, mockContent.length);

    return new Response(JSON.stringify({ 
      success: true,
      content: mockContent,
      platform,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Scraping error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

async function generateMockContent(platform: string, keywords: string[], maxResults: number): Promise<ScrapedContent[]> {
  const platformConfigs = {
    twitter: {
      authors: ['@AutheoProject', '@Web3Community', '@BlockchainNews', '@CryptoUpdates'],
      contentTemplates: [
        'Excited to announce our latest partnership with {keyword} technology!',
        'New developments in {keyword} are reshaping the industry',
        'Community update: {keyword} integration is now live!',
        'Just published our latest blog post about {keyword} innovations'
      ]
    },
    linkedin: {
      authors: ['Autheo Team', 'Blockchain Innovations', 'Web3 Professionals', 'Tech Leaders'],
      contentTemplates: [
        'We are thrilled to share our progress in {keyword} development',
        'Join our upcoming webinar on {keyword} best practices',
        'Our team has been working on revolutionary {keyword} solutions',
        'Industry insights: How {keyword} is transforming business'
      ]
    },
    discord: {
      authors: ['Autheo Admin', 'Community Manager', 'Dev Team', 'Moderator'],
      contentTemplates: [
        '🚀 New {keyword} features are now available in the latest update!',
        'Community discussion: What are your thoughts on {keyword}?',
        'Tech update: {keyword} implementation is progressing well',
        'Join our {keyword} workshop this Friday!'
      ]
    },
    telegram: {
      authors: ['Autheo Official', 'News Bot', 'Community Admin', 'Development Team'],
      contentTemplates: [
        '📢 Breaking: {keyword} milestone achieved!',
        '🔥 Hot topic: {keyword} trends in the crypto space',
        '💡 Pro tip: Best practices for {keyword} implementation',
        '🎯 Goal update: {keyword} roadmap progress'
      ]
    },
    youtube: {
      authors: ['Autheo Channel', 'Tech Tutorials', 'Crypto Insights', 'Web3 Academy'],
      contentTemplates: [
        '{keyword} Explained: Complete Guide for Beginners',
        'Advanced {keyword} Strategies That Actually Work',
        'Live Discussion: The Future of {keyword}',
        'Tutorial: How to Get Started with {keyword}'
      ]
    },
    blog: {
      authors: ['Autheo Editorial', 'Guest Writer', 'Technical Team', 'Research Division'],
      contentTemplates: [
        'Deep Dive: Understanding {keyword} Architecture',
        'Case Study: Successful {keyword} Implementation',
        'Opinion: Why {keyword} Matters for the Future',
        'Guide: {keyword} Best Practices and Common Pitfalls'
      ]
    }
  };

  const config = platformConfigs[platform as keyof typeof platformConfigs];
  if (!config) {
    return [];
  }

  const content: ScrapedContent[] = [];
  const targetKeyword = keywords.length > 0 ? keywords[0] : 'Web3';

  for (let i = 0; i < maxResults; i++) {
    const author = config.authors[Math.floor(Math.random() * config.authors.length)];
    const template = config.contentTemplates[Math.floor(Math.random() * config.contentTemplates.length)];
    const contentText = template.replace('{keyword}', targetKeyword);
    
    // Generate realistic timestamps within the last 24 hours
    const now = new Date();
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);

    content.push({
      id: `${platform}_${Date.now()}_${i}`,
      platform,
      author,
      content: contentText,
      date: formatTimeAgo(timestamp),
      engagement: generateEngagementMetrics(platform),
      metadata: {
        scraped_at: new Date().toISOString(),
        source: 'automated_scraper',
        keywords: keywords
      }
    });
  }

  return content;
}

function generateEngagementMetrics(platform: string) {
  const baseMetrics = {
    likes: Math.floor(Math.random() * 500) + 10,
    shares: Math.floor(Math.random() * 100) + 1,
    comments: Math.floor(Math.random() * 50) + 1
  };

  switch (platform) {
    case 'twitter':
      return {
        likes: baseMetrics.likes,
        retweets: baseMetrics.shares,
        replies: baseMetrics.comments
      };
    case 'youtube':
      return {
        likes: baseMetrics.likes,
        views: Math.floor(Math.random() * 10000) + 100,
        comments: baseMetrics.comments
      };
    case 'telegram':
      return {
        views: Math.floor(Math.random() * 5000) + 50
      };
    default:
      return baseMetrics;
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours === 1) {
    return '1 hour ago';
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    const days = Math.floor(diffInHours / 24);
    return days === 1 ? '1 day ago' : `${days} days ago`;
  }
}

async function logScrapingAnalytics(supabase: any, userId: string, platform: string, contentCount: number) {
  try {
    await supabase
      .from('user_interactions')
      .insert({
        user_id: userId,
        interaction_type: 'scrape',
        content_type: 'social_media',
        platform: platform,
        content_id: `scrape_${platform}_${Date.now()}`,
        metadata: {
          content_count: contentCount,
          timestamp: new Date().toISOString()
        }
      });
  } catch (error) {
    console.error('Error logging analytics:', error);
  }
}
