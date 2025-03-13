
import React from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Sword, User, AlertCircle } from 'lucide-react';

interface SocialNetworkVisualizerProps {
  players: PlayerData[];
  currentPlayerId: string | null;
  alliances: any[];
}

const SocialNetworkVisualizer: React.FC<SocialNetworkVisualizerProps> = ({ 
  players, 
  currentPlayerId,
  alliances
}) => {
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  
  // Get relationship type color
  const getRelationshipColor = (type: string) => {
    switch (type) {
      case 'Ally': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Friend': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'Neutral': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'Rival': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'Enemy': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };
  
  // Get relationship icon
  const getRelationshipIcon = (type: string) => {
    switch (type) {
      case 'Ally': return <Shield className="w-3 h-3 text-green-400" />;
      case 'Friend': return <Heart className="w-3 h-3 text-emerald-400" />;
      case 'Neutral': return <User className="w-3 h-3 text-blue-400" />;
      case 'Rival': return <AlertCircle className="w-3 h-3 text-orange-400" />;
      case 'Enemy': return <Sword className="w-3 h-3 text-red-400" />;
      default: return <User className="w-3 h-3 text-gray-400" />;
    }
  };
  
  // Get player alliances
  const getPlayerAlliances = (playerId: string) => {
    return alliances.filter(alliance => 
      alliance.members.includes(playerId)
    );
  };

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h3 className="text-sm font-medium text-gray-300 mb-1">Your Social Network</h3>
        <p className="text-xs text-gray-400">
          Visualize your game relationships and alliance connections
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {players
          .filter(player => player.id !== currentPlayerId)
          .map(player => {
            // Find the relationship between the current player and this player
            const relationship = currentPlayer?.relationships?.find(
              r => r.targetId === player.id
            );
            
            const relationshipType = relationship?.type || 'Unknown';
            const relationshipColor = getRelationshipColor(relationshipType);
            const relationshipIcon = getRelationshipIcon(relationshipType);
            
            // Get shared alliances
            const currentPlayerAlliances = getPlayerAlliances(currentPlayerId || '');
            const thisPlayerAlliances = getPlayerAlliances(player.id);
            const sharedAlliances = currentPlayerAlliances.filter(alliance => 
              thisPlayerAlliances.some(a => a.id === alliance.id)
            );
            
            return (
              <Card 
                key={player.id} 
                className={`${relationshipColor} p-2 border rounded-lg transition-all duration-300 hover:scale-105`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium flex items-center gap-1">
                      {relationshipIcon} {player.name}
                    </div>
                    <div className="text-xs opacity-80">{relationshipType}</div>
                  </div>
                  
                  {player.personality?.archetype && (
                    <Badge variant="outline" className="text-xs capitalize opacity-70">
                      {player.personality.archetype}
                    </Badge>
                  )}
                </div>
                
                {sharedAlliances.length > 0 && (
                  <div className="mt-2 text-xs">
                    <div className="opacity-70 mb-1">Shared Alliances:</div>
                    <div className="flex flex-wrap gap-1">
                      {sharedAlliances.map(alliance => (
                        <Badge key={alliance.id} variant="secondary" className="text-[10px]">
                          {alliance.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Emotional impact indicators */}
                {relationship?.extraPoints && (
                  <div className="mt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <span>Impact:</span>
                      {[...Array(Math.min(5, Math.abs(relationship.extraPoints)))].map((_, i) => (
                        <span key={i} className={relationship.extraPoints > 0 ? "text-green-400" : "text-red-400"}>
                          {relationship.extraPoints > 0 ? "+" : "−"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default SocialNetworkVisualizer;
