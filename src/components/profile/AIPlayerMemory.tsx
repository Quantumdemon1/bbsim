
import React from 'react';
import { Database, MessageSquare, Star, Users, Shield, Activity, Heart, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIMemoryEntry } from '@/hooks/ai/types';

interface AIPlayerMemoryProps {
  playerMemory: AIMemoryEntry[];
  playerId: string;
}

const AIPlayerMemory: React.FC<AIPlayerMemoryProps> = ({ playerMemory }) => {
  // Helper to get icon based on memory type
  const getMemoryIcon = (type: string) => {
    switch (type) {
      case 'hoh':
        return <Star className="h-3 w-3 text-yellow-500" />;
      case 'alliance':
        return <Users className="h-3 w-3 text-blue-500" />;
      case 'betrayal':
        return <Shield className="h-3 w-3 text-red-500" />;
      case 'competition_win':
        return <Activity className="h-3 w-3 text-green-500" />;
      default:
        return <MessageSquare className="h-3 w-3 text-gray-500" />;
    }
  };
  
  // Calculate memory freshness as percentage (100% = completely fresh, 0% = fully decayed)
  const getMemoryFreshness = (memory: AIMemoryEntry): number => {
    const timestamp = typeof memory.timestamp === 'string'
      ? new Date(memory.timestamp).getTime()
      : memory.timestamp;
    
    const now = Date.now();
    const ageInDays = (now - Number(timestamp)) / (1000 * 60 * 60 * 24);
    
    // Fresher memories and more important ones stay "fresh" longer
    const decayFactor = memory.decayFactor || 0.5;
    const freshness = Math.max(0, 100 - (ageInDays * 10) + (memory.importance * 5)) * decayFactor;
    
    return Math.min(100, Math.max(0, freshness));
  };
  
  // Get emotional state display
  const getEmotionDisplay = (emotion: string) => {
    switch (emotion) {
      case 'happy':
        return { color: 'text-green-500', label: 'Happy' };
      case 'angry':
        return { color: 'text-red-500', label: 'Angry' };
      case 'sad':
        return { color: 'text-blue-500', label: 'Sad' };
      case 'excited':
        return { color: 'text-yellow-500', label: 'Excited' };
      case 'nervous':
        return { color: 'text-purple-500', label: 'Nervous' };
      case 'strategic':
        return { color: 'text-indigo-500', label: 'Strategic' };
      case 'upset':
        return { color: 'text-orange-500', label: 'Upset' };
      default:
        return { color: 'text-gray-500', label: 'Neutral' };
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <Database className="h-4 w-4" />
          Memory
        </CardTitle>
        <CardDescription>
          Recent game events remembered
        </CardDescription>
      </CardHeader>
      <CardContent>
        {playerMemory.length > 0 ? (
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {playerMemory.map((entry, index) => {
                const memoryFreshness = getMemoryFreshness(entry);
                const emotionDisplay = getEmotionDisplay(entry.emotion || 'neutral');
                const isImportant = entry.importance > 3;

                return (
                  <div 
                    key={index} 
                    className={`text-sm border-l-2 pl-2 py-1 ${
                      memoryFreshness < 30 ? 'opacity-50' : ''
                    } ${isImportant ? 'border-yellow-400' : 'border-gray-300 dark:border-gray-700'}`}
                  >
                    <div className="flex items-center gap-1 justify-between">
                      <div className="flex items-center gap-1">
                        <span className={`text-xs font-semibold ${
                          entry.impact === 'positive' ? 'text-green-500' : 
                          entry.impact === 'negative' ? 'text-red-500' : 'text-gray-500'
                        }`}>
                          Week {entry.week}
                        </span>
                        <div className="flex items-center gap-1">
                          {getMemoryIcon(entry.type)}
                          <span className="text-xs text-gray-500 capitalize">
                            {entry.type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {/* Memory importance indicator */}
                        {entry.importance > 3 && (
                          <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-500">
                            Important
                          </Badge>
                        )}
                        
                        {/* Memory freshness indicator */}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <div className="h-1 w-10 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                memoryFreshness > 70 ? 'bg-green-500' : 
                                memoryFreshness > 40 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${memoryFreshness}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p>{entry.description}</p>
                    
                    {/* Emotional response to the memory */}
                    {entry.emotion && (
                      <div className="flex items-center mt-1 gap-1">
                        <Heart className={`h-3 w-3 ${emotionDisplay.color}`} />
                        <span className={`text-xs ${emotionDisplay.color}`}>
                          {emotionDisplay.label}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            <MessageSquare className="h-10 w-10 mb-2 opacity-20" />
            <p className="text-sm">No memories yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIPlayerMemory;
