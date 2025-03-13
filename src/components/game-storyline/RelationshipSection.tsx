
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Heart, Shield, Sword } from 'lucide-react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { Badge } from '@/components/ui/badge';

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
      <h3 className="text-sm font-medium text-gray-300 mb-1">Houseguests</h3>
      <p className="text-xs text-gray-400 mb-3">
        Connect with others to build trust and gather information
      </p>
      
      {allies.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm text-green-400 font-medium flex items-center gap-1">
            <Shield className="w-3 h-3" /> Allies
          </h4>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {allies.map(player => {
              // Find extra relationship points if any
              const relationship = player.relationships?.find(r => r.targetId === player.id);
              const extraPoints = relationship?.extraPoints || 0;
              
              return (
                <Button 
                  key={player.id}
                  size="sm"
                  variant="ghost" 
                  className="justify-start text-green-200 hover:text-green-100 hover:bg-green-900/30 relative overflow-hidden"
                  onClick={() => triggerSocialEvent(player.id)}
                  disabled={actionsRemaining === 0}
                >
                  <div className={`absolute inset-0 bg-green-500/10 rounded`} style={{ 
                    width: `${Math.min(100, 20 + Math.abs(extraPoints) * 15)}%` 
                  }} />
                  <div className="flex items-center z-10 relative">
                    <Heart className="w-3 h-3 mr-2 text-green-400" />
                    {player.name}
                    
                    {extraPoints > 0 && (
                      <Badge className="ml-auto bg-green-600/20 text-green-400 text-[10px]">
                        +{extraPoints}
                      </Badge>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      )}
      
      {neutralPlayers.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm text-gray-400 font-medium flex items-center gap-1">
            <User className="w-3 h-3" /> Neutral
          </h4>
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
          <h4 className="text-sm text-red-400 font-medium flex items-center gap-1">
            <Sword className="w-3 h-3" /> Rivals
          </h4>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {rivals.map(player => {
              // Find extra relationship points if any
              const relationship = player.relationships?.find(r => r.targetId === player.id);
              const extraPoints = relationship?.extraPoints || 0;
              
              return (
                <Button 
                  key={player.id}
                  size="sm"
                  variant="ghost" 
                  className="justify-start text-red-200 hover:text-red-100 hover:bg-red-900/30 relative overflow-hidden"
                  onClick={() => triggerSocialEvent(player.id)}
                  disabled={actionsRemaining === 0}
                >
                  <div className={`absolute inset-0 bg-red-500/10 rounded`} style={{ 
                    width: `${Math.min(100, 20 + Math.abs(extraPoints) * 15)}%` 
                  }} />
                  <div className="flex items-center z-10 relative">
                    <Sword className="w-3 h-3 mr-2 text-red-400" />
                    {player.name}
                    
                    {extraPoints < 0 && (
                      <Badge className="ml-auto bg-red-600/20 text-red-400 text-[10px]">
                        {extraPoints}
                      </Badge>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RelationshipSection;
