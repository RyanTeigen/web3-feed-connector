
import { supabase } from "@/integrations/supabase/client";
import { ScrapedContent, ScraperConfig } from "../socialMediaScraper";

interface RateLimitConfig {
  requestsPerMinute: number;
  burstLimit: number;
}

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

class ScrapingEngine {
  private rateLimits: Map<string, RateLimitConfig> = new Map([
    ['twitter', { requestsPerMinute: 300, burstLimit: 15 }],
    ['linkedin', { requestsPerMinute: 100, burstLimit: 10 }],
    ['discord', { requestsPerMinute: 50, burstLimit: 5 }],
    ['telegram', { requestsPerMinute: 30, burstLimit: 3 }],
    ['youtube', { requestsPerMinute: 100, burstLimit: 10 }],
    ['blog', { requestsPerMinute: 60, burstLimit: 6 }]
  ]);

  private retryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000
  };

  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();

  async scrapeWithRetry(platform: string, config: ScraperConfig, userId: string): Promise<ScrapedContent[]> {
    for (let attempt = 0; attempt < this.retryConfig.maxRetries; attempt++) {
      try {
        // Check rate limits
        if (!this.checkRateLimit(platform)) {
          const waitTime = this.getWaitTime(platform);
          console.log(`Rate limit exceeded for ${platform}. Waiting ${waitTime}ms`);
          await this.delay(waitTime);
        }

        const results = await this.performScraping(platform, config, userId);
        
        // Update rate limit counters
        this.updateRateLimit(platform);
        
        return results;
      } catch (error) {
        console.error(`Scraping attempt ${attempt + 1} failed for ${platform}:`, error);
        
        if (attempt === this.retryConfig.maxRetries - 1) {
          throw error;
        }

        const delay = Math.min(
          this.retryConfig.baseDelay * Math.pow(2, attempt),
          this.retryConfig.maxDelay
        );
        
        await this.delay(delay);
      }
    }

    return [];
  }

  private async performScraping(platform: string, config: ScraperConfig, userId: string): Promise<ScrapedContent[]> {
    const { data, error } = await supabase.functions.invoke('scrape-social-media', {
      body: {
        platform,
        userId,
        keywords: config.keywords || [],
        maxResults: config.maxResults || 10,
        timeRange: config.timeRange || '24h',
        useAdvancedFiltering: true,
        enableRealTimeMode: false
      }
    });

    if (error) {
      throw new Error(`Scraping failed for ${platform}: ${error.message}`);
    }

    return data.content || [];
  }

  private checkRateLimit(platform: string): boolean {
    const limit = this.rateLimits.get(platform);
    if (!limit) return true;

    const now = Date.now();
    const requestData = this.requestCounts.get(platform);

    if (!requestData || now > requestData.resetTime) {
      this.requestCounts.set(platform, { count: 0, resetTime: now + 60000 });
      return true;
    }

    return requestData.count < limit.requestsPerMinute;
  }

  private updateRateLimit(platform: string): void {
    const requestData = this.requestCounts.get(platform);
    if (requestData) {
      requestData.count++;
    }
  }

  private getWaitTime(platform: string): number {
    const requestData = this.requestCounts.get(platform);
    if (!requestData) return 0;
    
    return Math.max(0, requestData.resetTime - Date.now());
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getScrapingHealth(): Promise<{ platform: string; status: 'healthy' | 'rate_limited' | 'error'; lastScrape?: string }[]> {
    return Array.from(this.rateLimits.keys()).map(platform => ({
      platform,
      status: this.checkRateLimit(platform) ? 'healthy' : 'rate_limited',
      lastScrape: new Date().toISOString()
    }));
  }
}

export const scrapingEngine = new ScrapingEngine();
