
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, ThermometerSun } from 'lucide-react';
import { GamePhase } from '@/types/gameTypes';

interface PlayerStatusHeaderProps {
  playerName: string;
  dayCount: number;
  currentPhase: GamePhase;
  actionsRemaining: number;
  playerMood: string;
}

const PlayerStatusHeader: React.FC<PlayerStatusHeaderProps> = ({
  playerName,
  dayCount,
  currentPhase,
  actionsRemaining,
  playerMood,
}) => {
  const getMoodIcon = () => {
    switch (playerMood) {
      case 'focused': return '🧠';
      case 'expressive': return '😊';
      case 'cunning': return '😏';
      case 'excited': return '😃';
      case 'nervous': return '😰';
      case 'angry': return '😠';
      case 'happy': return '😄';
      case 'sad': return '😢';
      case 'strategic': return '🤔';
      default: return '😐';
    }
  };
  
  const getMoodColor = () => {
    switch (playerMood) {
      case 'focused': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'expressive': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'cunning': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'excited': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'nervous': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'angry': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'happy': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'sad': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'strategic': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="flex justify-between items-center mb-4 relative z-10">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          {playerName} 
          <Badge variant="outline" className={`ml-2 ${getMoodColor()} text-xs`}>
            <span className="mr-1">{getMoodIcon()}</span>
            <span className="capitalize">{playerMood || 'Neutral'}</span>
          </Badge>
        </h2>
        <p className="text-gray-300 text-sm">Day {dayCount} | {currentPhase}</p>
      </div>
      
      <div className="flex gap-2">
        <Badge variant="outline" className="flex items-center gap-1 bg-game-medium/30 border-game-accent/30">
          <Clock className="w-3 h-3" /> 
          {actionsRemaining} Actions
        </Badge>
        
        {actionsRemaining === 0 && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> 
            No Actions Left
          </Badge>
        )}
        
        <Badge variant="outline" className="flex items-center gap-1 bg-game-medium/30 border-game-accent/30">
          <ThermometerSun className="w-3 h-3" /> 
          House Mood: Tense
        </Badge>
      </div>
    </div>
  );
};

export default PlayerStatusHeader;
