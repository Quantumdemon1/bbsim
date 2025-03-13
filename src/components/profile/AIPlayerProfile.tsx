
import React from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useGameContext } from '@/contexts/GameContext';
import { Bot, Brain, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AIPlayerMemory from './AIPlayerMemory';

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
        
        <AIPlayerMemory 
          playerMemory={playerMemory}
          playerId={player.id}
        />
      </div>
    </div>
  );
};

export default AIPlayerProfile;
