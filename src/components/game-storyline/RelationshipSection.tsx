
import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface RelationshipSectionProps {
  allies: PlayerData[];
  neutralPlayers: PlayerData[];
  rivals: PlayerData[];
  actionsRemaining: number;
  triggerSocialEvent: (playerId: string) => void;
}

const RelationshipSection: React.FC<RelationshipSectionProps> = ({
  allies,
  neutralPlayers,
  rivals,
  actionsRemaining,
  triggerSocialEvent
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Houseguests</h3>
      
      {allies.length > 0 && (
        <div className="mb-2">
          <h4 className="text-sm text-green-400 font-medium">Allies</h4>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {allies.map(player => (
              <Button 
                key={player.id}
                size="sm"
                variant="ghost" 
                className="justify-start text-green-200 hover:text-green-100 hover:bg-green-900/30"
                onClick={() => triggerSocialEvent(player.id)}
                disabled={actionsRemaining === 0}
              >
                <User className="w-3 h-3 mr-2" />
                {player.name}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {neutralPlayers.length > 0 && (
        <div className="mb-2">
          <h4 className="text-sm text-gray-400 font-medium">Neutral</h4>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {neutralPlayers.map(player => (
              <Button 
                key={player.id}
                size="sm"
                variant="ghost" 
                className="justify-start text-gray-200 hover:text-gray-100 hover:bg-gray-700/30"
                onClick={() => triggerSocialEvent(player.id)}
                disabled={actionsRemaining === 0}
              >
                <User className="w-3 h-3 mr-2" />
                {player.name}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {rivals.length > 0 && (
        <div>
          <h4 className="text-sm text-red-400 font-medium">Rivals</h4>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {rivals.map(player => (
              <Button 
                key={player.id}
                size="sm"
                variant="ghost" 
                className="justify-start text-red-200 hover:text-red-100 hover:bg-red-900/30"
                onClick={() => triggerSocialEvent(player.id)}
                disabled={actionsRemaining === 0}
              >
                <User className="w-3 h-3 mr-2" />
                {player.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RelationshipSection;
