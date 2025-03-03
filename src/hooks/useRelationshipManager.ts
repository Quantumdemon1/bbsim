
import { useState } from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useGameContext } from '@/hooks/useGameContext';
import { relationshipTypes } from '@/hooks/game-phases/types';

interface UseRelationshipManagerProps {
  players: PlayerData[];
}

export const useRelationshipManager = ({ players }: UseRelationshipManagerProps) => {
  const { updatePlayerRelationships } = useGameContext();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  
  // Create array of values from -10 to +10 for relationship modifiers
  const extraOptions = Array.from({ length: 21 }, (_, i) => i - 10);

  const handleRandomizeAll = () => {
    // For each player, generate random relationships with all other players
    players.forEach(player => {
      const relationships = players
        .filter(p => p.id !== player.id && p.status !== 'evicted')
        .map(target => {
          const relationshipTypeIndex = Math.floor(Math.random() * relationshipTypes.length);
          return {
            playerId: player.id,
            targetId: target.id,
            type: relationshipTypes[relationshipTypeIndex] as any,
            extraPoints: Math.floor(Math.random() * 21) - 10, // -10 to +10
            isMutual: Math.random() > 0.7, // 30% chance of being mutual
            isPermanent: Math.random() > 0.85 // 15% chance of being permanent
          };
        });
      
      updatePlayerRelationships(player.id, relationships);
    });
  };
  
  const handleResetPlayer = () => {
    if (!selectedPlayer) return;
    
    const defaultRelationships = players
      .filter(p => p.id !== selectedPlayer && p.status !== 'evicted')
      .map(target => ({
        playerId: selectedPlayer,
        targetId: target.id,
        type: 'Neutral' as const,
        extraPoints: 0,
        isMutual: false,
        isPermanent: false
      }));
    
    updatePlayerRelationships(selectedPlayer, defaultRelationships);
  };
  
  const handleResetAll = () => {
    players.forEach(player => {
      const defaultRelationships = players
        .filter(p => p.id !== player.id && p.status !== 'evicted')
        .map(target => ({
          playerId: player.id,
          targetId: target.id,
          type: 'Neutral' as const,
          extraPoints: 0,
          isMutual: false,
          isPermanent: false
        }));
      
      updatePlayerRelationships(player.id, defaultRelationships);
    });
  };
  
  const handleMakeAllPermanent = () => {
    players.forEach(player => {
      if (!player.relationships) return;
      
      const updatedRelationships = player.relationships.map(rel => ({
        ...rel,
        isPermanent: true
      }));
      
      updatePlayerRelationships(player.id, updatedRelationships);
    });
  };
  
  const handleMakeNonePermanent = () => {
    players.forEach(player => {
      if (!player.relationships) return;
      
      const updatedRelationships = player.relationships.map(rel => ({
        ...rel,
        isPermanent: false
      }));
      
      updatePlayerRelationships(player.id, updatedRelationships);
    });
  };
  
  const handleUpdateRelationship = (targetId: string, field: string, value: any) => {
    if (!selectedPlayer) return;
    
    const player = players.find(p => p.id === selectedPlayer);
    if (!player || !player.relationships) return;
    
    const updatedRelationships = [...player.relationships];
    const relationshipIndex = updatedRelationships.findIndex(r => r.targetId === targetId);
    
    if (relationshipIndex === -1) {
      // Create new relationship
      const newRelationship = {
        playerId: selectedPlayer,
        targetId,
        type: field === 'type' ? value : 'Neutral',
        extraPoints: field === 'extraPoints' ? value : 0,
        isMutual: field === 'isMutual' ? value : false,
        isPermanent: field === 'isPermanent' ? value : false
      };
      updatedRelationships.push(newRelationship);
    } else {
      // Update existing relationship
      updatedRelationships[relationshipIndex] = {
        ...updatedRelationships[relationshipIndex],
        [field]: value
      };
    }
    
    updatePlayerRelationships(selectedPlayer, updatedRelationships);
  };
  
  const getRelationshipValue = (targetId: string, field: string) => {
    if (!selectedPlayer) return null;
    
    const player = players.find(p => p.id === selectedPlayer);
    if (!player || !player.relationships) return null;
    
    const relationship = player.relationships.find(r => r.targetId === targetId);
    if (!relationship) return null;
    
    return relationship[field as keyof typeof relationship];
  };

  return {
    selectedPlayer,
    setSelectedPlayer,
    extraOptions,
    handleRandomizeAll,
    handleResetPlayer,
    handleResetAll,
    handleMakeAllPermanent,
    handleMakeNonePermanent,
    handleUpdateRelationship,
    getRelationshipValue
  };
};
