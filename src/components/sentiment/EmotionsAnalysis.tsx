
import { SentimentDetailRecord } from '@/types/sentiment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeartPulse, AlertTriangle, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react';

interface EmotionsAnalysisProps {
  detailsRecords: SentimentDetailRecord[];
}

export const EmotionsAnalysis = ({ detailsRecords }: EmotionsAnalysisProps) => {
  if (detailsRecords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No emotions data available</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  // Group emotions by type
  const emotionsMap = new Map<string, { records: SentimentDetailRecord[], icon: React.ReactNode }>();
  
  // Define emotion groups with their icons
  const emotionGroups = {
    positive: {
      emotions: ['excited', 'satisfied', 'happy'],
      icon: <ThumbsUp className="h-5 w-5 text-emerald-500" />
    },
    negative: {
      emotions: ['frustrated', 'disappointed', 'angry', 'sad'],
      icon: <ThumbsDown className="h-5 w-5 text-red-500" />
    },
    curious: {
      emotions: ['curious'],
      icon: <HeartPulse className="h-5 w-5 text-purple-500" />
    },
    confused: {
      emotions: ['confused', 'uncertain'],
      icon: <HelpCircle className="h-5 w-5 text-amber-500" />
    },
    alert: {
      emotions: ['worried', 'concerned', 'alarmed'],
      icon: <AlertTriangle className="h-5 w-5 text-orange-500" />
    }
  };
  
  // Group the details records by emotion group
  detailsRecords.forEach(record => {
    let groupFound = false;
    
    for (const [groupName, groupData] of Object.entries(emotionGroups)) {
      if (groupData.emotions.includes(record.emotion_type)) {
        const existingGroup = emotionsMap.get(groupName);
        
        if (existingGroup) {
          existingGroup.records.push(record);
        } else {
          emotionsMap.set(groupName, { records: [record], icon: groupData.icon });
        }
        
        groupFound = true;
        break;
      }
    }
    
    // If not in any defined group, add to an "other" group
    if (!groupFound) {
      const existingGroup = emotionsMap.get('other');
      if (existingGroup) {
        existingGroup.records.push(record);
      } else {
        emotionsMap.set('other', { records: [record], icon: <HeartPulse className="h-5 w-5" /> });
      }
    }
  });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from(emotionsMap.entries()).map(([groupName, { records, icon }]) => (
        <Card key={groupName}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 capitalize">
              {icon}
              {groupName} Emotions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {records.map(record => (
                <div key={record.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium capitalize">{record.emotion_type}</h4>
                    <span className="text-sm font-medium">{record.percentage.toFixed(1)}%</span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${record.percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-1">
                    {record.keywords.map((keyword, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
