
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { socialMediaScraperService, ScrapedContent, ScraperConfig } from '@/services/socialMediaScraper';

export const useSocialMediaScraper = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isScrapingActive, setIsScrapingActive] = useState(false);

  // Fetch stored content
  const { 
    data: scrapedContent = [], 
    isLoading: isLoadingContent,
    error: contentError
  } = useQuery({
    queryKey: ['scrapedContent', user?.id],
    queryFn: () => user ? socialMediaScraperService.getStoredContent(user.id) : [],
    enabled: !!user,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Scrape new content mutation
  const scrapeContentMutation = useMutation({
    mutationFn: async (config: ScraperConfig) => {
      if (!user) throw new Error('User not authenticated');
      setIsScrapingActive(true);
      return socialMediaScraperService.scrapeContent(config, user.id);
    },
    onSuccess: (data) => {
      toast({
        title: "Scraping completed",
        description: `Successfully scraped ${data.length} items from social media platforms.`,
      });
      // Invalidate and refetch content
      queryClient.invalidateQueries({ queryKey: ['scrapedContent', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['socialFeed'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Scraping failed",
        description: error.message || "Failed to scrape social media content.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsScrapingActive(false);
    }
  });

  // Refresh content mutation
  const refreshContentMutation = useMutation({
    mutationFn: async (platforms?: string[]) => {
      if (!user) throw new Error('User not authenticated');
      setIsScrapingActive(true);
      return socialMediaScraperService.refreshContent(user.id, platforms);
    },
    onSuccess: () => {
      toast({
        title: "Content refreshed",
        description: "Social media content has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['scrapedContent', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['socialFeed'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Refresh failed",
        description: error.message || "Failed to refresh social media content.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsScrapingActive(false);
    }
  });

  // Get platform-specific content
  const getPlatformContent = (platform: string): ScrapedContent[] => {
    return scrapedContent.filter(item => item.platform === platform);
  };

  // Get content by keywords
  const getContentByKeywords = (keywords: string[]): ScrapedContent[] => {
    if (keywords.length === 0) return scrapedContent;
    
    return scrapedContent.filter(item => 
      keywords.some(keyword => 
        item.content.toLowerCase().includes(keyword.toLowerCase()) ||
        item.author.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  };

  return {
    // Data
    scrapedContent,
    isLoadingContent,
    contentError,
    
    // Status
    isScrapingActive: isScrapingActive || scrapeContentMutation.isPending || refreshContentMutation.isPending,
    
    // Actions
    scrapeContent: scrapeContentMutation.mutate,
    refreshContent: refreshContentMutation.mutate,
    
    // Helpers
    getPlatformContent,
    getContentByKeywords,
    
    // Stats
    totalContentCount: scrapedContent.length,
    platformCounts: scrapedContent.reduce((acc, item) => {
      acc[item.platform] = (acc[item.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
};
