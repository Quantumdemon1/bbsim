
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle } from 'lucide-react';
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
      default: return '😐';
    }
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-xl font-bold">{playerName} {getMoodIcon()}</h2>
        <p className="text-gray-300 text-sm">Day {dayCount} | {currentPhase}</p>
      </div>
      
      <div className="flex gap-2">
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> 
          {actionsRemaining} Actions
        </Badge>
        
        {actionsRemaining === 0 && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> 
            No Actions Left
          </Badge>
        )}
      </div>
    </div>
  );
};

export default PlayerStatusHeader;
