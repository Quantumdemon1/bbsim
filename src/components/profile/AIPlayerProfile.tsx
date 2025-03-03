
import React from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useGameContext } from '@/contexts/GameContext';
import { Bot, Brain, Database, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AIPlayerProfileProps {
  player: PlayerData;
}

const AIPlayerProfile: React.FC<AIPlayerProfileProps> = ({ player }) => {
  const { getPlayerMemory } = useGameContext();
  
  const playerMemory = getPlayerMemory(player.id);
  const personality = player.personality || {
    archetype: 'floater',
    traits: ['adaptable', 'quiet', 'observant'],
    background: 'No detailed background provided.'
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
                  {playerMemory.map((entry, index) => (
                    <div key={index} className="text-sm border-l-2 pl-2 py-1 border-gray-300 dark:border-gray-700">
                      <div className="flex items-center gap-1">
                        <span className={`text-xs font-semibold ${
                          entry.impact === 'positive' ? 'text-green-500' : 
                          entry.impact === 'negative' ? 'text-red-500' : 'text-gray-500'
                        }`}>
                          Week {entry.week}
                        </span>
                        <span className="text-xs text-gray-500">
                          • {entry.type}
                        </span>
                      </div>
                      <p>{entry.description}</p>
                    </div>
                  ))}
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
