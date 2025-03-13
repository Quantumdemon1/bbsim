
import React from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useGameContext } from '@/contexts/GameContext';
import { Bot, Brain, Database, MessageSquare, Star, Users, Shield, Activity, Heart, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIMemoryEntry } from '@/hooks/ai/types';

interface AIPlayerProfileProps {
  player: PlayerData;
}

const AIPlayerProfile: React.FC<AIPlayerProfileProps> = ({ player }) => {
  const { getPlayerMemory, botEmotions } = useGameContext();
  
  const playerMemory = getPlayerMemory(player.id);
  const personality = player.personality || {
    archetype: 'floater',
    traits: ['adaptable', 'quiet', 'observant'],
    background: 'No detailed background provided.'
  };
  
  const currentEmotion = botEmotions[player.id] || 'neutral';
  
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
  
  const emotionDisplay = getEmotionDisplay(currentEmotion);
  
  // Get memory emotion display
  const getMemoryEmotionDisplay = (memory: AIMemoryEntry) => {
    return getEmotionDisplay(memory.emotion || 'neutral');
  };
  
  // Get archetype description
  const getArchetypeDescription = (archetype: string) => {
    switch (archetype) {
      case 'mastermind':
        return "Strategic player who plans several moves ahead and manipulates situations to their advantage.";
      case 'social-butterfly':
        return "Excels at forming connections and maintaining relationships with other houseguests.";
      case 'comp-beast':
        return "Focuses on winning competitions as their primary strategy for advancing in the game.";
      case 'floater':
        return "Adaptable player who shifts alliances as needed and avoids being seen as a threat.";
      case 'villain':
        return "Embraces conflict and isn't afraid to make controversial moves that upset others.";
      case 'underdog':
        return "Often in a disadvantaged position but fights against the odds to stay in the game.";
      default:
        return "Balanced player with no strongly defined gameplay style.";
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold">AI Personality Profile</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Personality
            </CardTitle>
            <CardDescription>
              {player.name}'s behavioral model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Archetype:</span>
                <Badge variant="outline" className="ml-2 capitalize">
                  {personality.archetype || 'Unknown'}
                </Badge>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {getArchetypeDescription(personality.archetype || '')}
                </p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Traits:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {personality.traits?.map((trait, index) => (
                    <Badge key={index} variant="secondary" className="capitalize">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Emotional State:</span>
                <div className="flex items-center gap-1 mt-1">
                  <Heart className={`h-4 w-4 ${emotionDisplay.color}`} />
                  <span className={`text-sm ${emotionDisplay.color} font-medium`}>
                    {emotionDisplay.label}
                  </span>
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Background:</span>
                <p className="mt-1 text-sm">{personality.background}</p>
              </div>
              
              {personality.motivation && (
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Motivation:</span>
                  <p className="mt-1 text-sm">{personality.motivation}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
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
                    const emotionDisplay = getMemoryEmotionDisplay(entry);
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
      </div>
    </div>
  );
};

export default AIPlayerProfile;
