
import { useState } from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';

export function usePlayerUtilities(
  players: PlayerData[],
  phase: string,
  selectedPlayers: string[],
  setSelectedPlayers: (players: string[]) => void
) {
  // Handle player selection based on the current phase
  const handlePlayerSelect = (playerId: string) => {
    if (phase === 'Nomination Ceremony') {
      if (selectedPlayers.includes(playerId)) {
        setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
      } else if (selectedPlayers.length < 2) {
        setSelectedPlayers([...selectedPlayers, playerId]);
      }
    } else {
      if (selectedPlayers.includes(playerId)) {
        setSelectedPlayers([]);
      } else {
        setSelectedPlayers([playerId]);
      }
    }
  };

  // Utility function to get player name by ID
  const getPlayerName = (playerId: string | null) => {
    if (!playerId) return 'Unknown';
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown';
  };

  // Utility function to use player powerup
  const usePowerup = (playerId: string) => {
    console.log(`Using powerup for player: ${playerId}`);
    return players.map(p => 
      p.id === playerId ? { ...p, powerup: undefined } : p
    );
  };

  return {
    handlePlayerSelect,
    getPlayerName,
    usePowerup
  };
}
