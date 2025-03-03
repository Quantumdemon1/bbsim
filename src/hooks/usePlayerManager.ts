
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { PlayerData } from '@/components/PlayerProfileTypes';
import { PlayerAttributes, PlayerRelationship } from '@/hooks/game-phases/types';

export function usePlayerManager(initialPlayers: PlayerData[]) {
  const [players, setPlayers] = useState<PlayerData[]>(initialPlayers);
  
  const updatePlayerAttributes = (playerId: string, attributes: PlayerAttributes) => {
    setPlayers(prevPlayers => prevPlayers.map(player => 
      player.id === playerId ? { ...player, attributes } : player
    ));
  };
  
  const updatePlayerRelationships = (playerId: string, relationships: PlayerRelationship[]) => {
    setPlayers(prevPlayers => prevPlayers.map(player => 
      player.id === playerId ? { ...player, relationships } : player
    ));
    
    // If any relationships are mutual, update the target player as well
    relationships.forEach(relationship => {
      if (relationship.isMutual) {
        setPlayers(prevPlayers => prevPlayers.map(player => {
          if (player.id === relationship.targetId) {
            const existingRelationships = player.relationships || [];
            const existingRelIndex = existingRelationships.findIndex(r => r.targetId === playerId);
            
            if (existingRelIndex >= 0) {
              // Update existing relationship
              const updatedRelationships = [...existingRelationships];
              updatedRelationships[existingRelIndex] = {
                ...updatedRelationships[existingRelIndex],
                type: relationship.type,
                extraPoints: relationship.extraPoints,
                isMutual: true,
                isPermanent: relationship.isPermanent
              };
              return { ...player, relationships: updatedRelationships };
            } else {
              // Create new relationship
              return {
                ...player,
                relationships: [
                  ...existingRelationships,
                  {
                    playerId: relationship.targetId,
                    targetId: relationship.playerId,
                    type: relationship.type,
                    extraPoints: relationship.extraPoints,
                    isMutual: true,
                    isPermanent: relationship.isPermanent
                  }
                ]
              };
            }
          }
          return player;
        }));
      }
    });
  };

  return {
    players,
    setPlayers,
    updatePlayerAttributes,
    updatePlayerRelationships
  };
}
