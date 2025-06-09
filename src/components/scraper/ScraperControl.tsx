
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSocialMediaScraper } from '@/hooks/useSocialMediaScraper';
import { Loader2, RefreshCw, Search, TrendingUp } from 'lucide-react';

const AVAILABLE_PLATFORMS = [
  { id: 'twitter', name: 'Twitter', icon: '🐦' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'discord', name: 'Discord', icon: '💬' },
  { id: 'telegram', name: 'Telegram', icon: '📱' },
  { id: 'youtube', name: 'YouTube', icon: '📺' },
  { id: 'blog', name: 'Blogs', icon: '📝' }
];

export const ScraperControl = () => {
  const {
    isScrapingActive,
    scrapeContent,
    refreshContent,
    totalContentCount,
    platformCounts
  } = useSocialMediaScraper();

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter', 'discord']);
  const [keywords, setKeywords] = useState<string[]>(['web3', 'autheo']);
  const [newKeyword, setNewKeyword] = useState('');
  const [maxResults, setMaxResults] = useState('10');
  const [timeRange, setTimeRange] = useState('24h');

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords(prev => [...prev, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(prev => prev.filter(k => k !== keyword));
  };

  const handleScrape = () => {
    scrapeContent({
      platforms: selectedPlatforms,
      keywords,
      maxResults: parseInt(maxResults),
      timeRange
    });
  };

  const handleRefresh = () => {
    refreshContent(selectedPlatforms);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Social Media Scraper Control
        </CardTitle>
        <CardDescription>
          Configure and run social media content scraping across multiple platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Platform Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Select Platforms</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {AVAILABLE_PLATFORMS.map(platform => (
              <div key={platform.id} className="flex items-center space-x-2">
                <Checkbox
                  id={platform.id}
                  checked={selectedPlatforms.includes(platform.id)}
                  onCheckedChange={() => handlePlatformToggle(platform.id)}
                />
                <Label htmlFor={platform.id} className="text-sm cursor-pointer">
                  {platform.icon} {platform.name}
                  {platformCounts[platform.id] && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {platformCounts[platform.id]}
                    </Badge>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Keywords</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add keyword..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            />
            <Button onClick={addKeyword} variant="outline" size="sm">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map(keyword => (
              <Badge key={keyword} variant="outline" className="cursor-pointer">
                {keyword}
                <button
                  onClick={() => removeKeyword(keyword)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Configuration */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Max Results</Label>
            <Select value={maxResults} onValueChange={setMaxResults}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 items</SelectItem>
                <SelectItem value="10">10 items</SelectItem>
                <SelectItem value="20">20 items</SelectItem>
                <SelectItem value="50">50 items</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Time Range</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button 
            onClick={handleScrape}
            disabled={isScrapingActive || selectedPlatforms.length === 0}
            className="flex items-center gap-2"
          >
            {isScrapingActive ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {isScrapingActive ? 'Scraping...' : 'Start Scraping'}
          </Button>
          
          <Button 
            onClick={handleRefresh}
            disabled={isScrapingActive}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Content
          </Button>
        </div>

        {/* Stats */}
        {totalContentCount > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Total scraped content: {totalContentCount} items</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
