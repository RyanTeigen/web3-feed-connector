import { supabase } from "@/integrations/supabase/client";
import { scrapingEngine } from "./enhanced/ScrapingEngine";
import { contentProcessor } from "./enhanced/ContentProcessor";

export interface ScrapedContent {
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

export interface ScraperConfig {
  platforms: string[];
  keywords?: string[];
  maxResults?: number;
  timeRange?: string;
}

// Define the structure of content stored in the database
interface StoredContentData {
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

class SocialMediaScraperService {
  private readonly supportedPlatforms = ['twitter', 'linkedin', 'discord', 'telegram', 'youtube', 'blog'];

  async scrapeContent(config: ScraperConfig, userId: string): Promise<ScrapedContent[]> {
    try {
      console.log('Starting enhanced social media scraping with config:', config);
      
      const results: ScrapedContent[] = [];
      
      for (const platform of config.platforms) {
        if (!this.supportedPlatforms.includes(platform)) {
          console.warn(`Platform ${platform} not supported`);
          continue;
        }

        // Use enhanced scraping engine with retry and rate limiting
        const platformResults = await scrapingEngine.scrapeWithRetry(platform, config, userId);
        results.push(...platformResults);
      }

      // Process content with enhanced pipeline
      let processedContent = await contentProcessor.processContent(results);
      processedContent = await contentProcessor.detectDuplicates(processedContent);
      processedContent = await contentProcessor.enrichWithSentiment(processedContent);

      // Store processed content in database
      await this.storeScrapedContent(processedContent, userId);
      
      return processedContent;
    } catch (error) {
      console.error('Error in enhanced social media scraping:', error);
      throw error;
    }
  }

  private async storeScrapedContent(content: ScrapedContent[], userId: string): Promise<void> {
    if (content.length === 0) return;

    try {
      const contentToStore = content.map(item => ({
        user_id: userId,
        platform: item.platform,
        platform_content_id: item.id,
        content: {
          author: item.author,
          content: item.content,
          date: item.date,
          engagement: item.engagement,
          metadata: item.metadata
        } as any, // Cast to any to satisfy Json type requirement
        fetched_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('social_media_content')
        .upsert(contentToStore, { 
          onConflict: 'user_id,platform,platform_content_id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Error storing scraped content:', error);
        throw error;
      }

      console.log(`Stored ${content.length} items in database`);
    } catch (error) {
      console.error('Failed to store scraped content:', error);
      throw error;
    }
  }

  async getStoredContent(userId: string, platform?: string): Promise<ScrapedContent[]> {
    try {
      let query = supabase
        .from('social_media_content')
        .select('*')
        .eq('user_id', userId)
        .order('fetched_at', { ascending: false })
        .limit(50);

      if (platform) {
        query = query.eq('platform', platform);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(item => {
        // Type cast the content JSON to our expected structure
        const contentData = item.content as unknown as StoredContentData;
        
        return {
          id: item.platform_content_id,
          platform: item.platform,
          author: contentData?.author || 'Unknown',
          content: contentData?.content || '',
          date: contentData?.date || '',
          engagement: contentData?.engagement,
          metadata: contentData?.metadata
        };
      });
    } catch (error) {
      console.error('Error fetching stored content:', error);
      return [];
    }
  }

  async refreshContent(userId: string, platforms: string[] = this.supportedPlatforms): Promise<void> {
    console.log('Refreshing content for platforms:', platforms);
    
    try {
      await this.scrapeContent({
        platforms,
        maxResults: 20,
        timeRange: '24h'
      }, userId);
    } catch (error) {
      console.error('Error refreshing content:', error);
      throw error;
    }
  }
}

export const socialMediaScraperService = new SocialMediaScraperService();
