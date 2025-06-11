
import { ScrapedContent } from "../socialMediaScraper";

interface ProcessingRule {
  type: 'filter' | 'transform' | 'enrich';
  condition: (content: ScrapedContent) => boolean;
  action: (content: ScrapedContent) => ScrapedContent;
}

class ContentProcessor {
  private processingRules: ProcessingRule[] = [
    {
      type: 'filter',
      condition: (content) => content.content.length < 10,
      action: (content) => ({ ...content, metadata: { ...content.metadata, filtered: 'too_short' } })
    },
    {
      type: 'enrich',
      condition: (content) => content.platform === 'twitter',
      action: (content) => ({
        ...content,
        metadata: {
          ...content.metadata,
          tweetType: content.content.startsWith('RT @') ? 'retweet' : 'original'
        }
      })
    },
    {
      type: 'transform',
      condition: (content) => content.content.includes('#'),
      action: (content) => ({
        ...content,
        metadata: {
          ...content.metadata,
          hashtags: this.extractHashtags(content.content)
        }
      })
    }
  ];

  async processContent(content: ScrapedContent[]): Promise<ScrapedContent[]> {
    const processed = content.map(item => {
      let processedItem = { ...item };

      for (const rule of this.processingRules) {
        if (rule.condition(processedItem)) {
          processedItem = rule.action(processedItem);
        }
      }

      return processedItem;
    });

    // Remove filtered content
    return processed.filter(item => !item.metadata?.filtered);
  }

  private extractHashtags(text: string): string[] {
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    return text.match(hashtagRegex) || [];
  }

  async detectDuplicates(content: ScrapedContent[]): Promise<ScrapedContent[]> {
    const seen = new Set<string>();
    const unique: ScrapedContent[] = [];

    for (const item of content) {
      const contentHash = this.generateContentHash(item);
      
      if (!seen.has(contentHash)) {
        seen.add(contentHash);
        unique.push(item);
      } else {
        console.log(`Duplicate content detected: ${item.id}`);
      }
    }

    return unique;
  }

  private generateContentHash(content: ScrapedContent): string {
    return btoa(content.content + content.author + content.platform);
  }

  async enrichWithSentiment(content: ScrapedContent[]): Promise<ScrapedContent[]> {
    // This would integrate with sentiment analysis service
    return content.map(item => ({
      ...item,
      metadata: {
        ...item.metadata,
        sentimentScore: Math.random() * 2 - 1, // Mock sentiment score
        sentimentLabel: Math.random() > 0.5 ? 'positive' : 'negative'
      }
    }));
  }
}

export const contentProcessor = new ContentProcessor();
