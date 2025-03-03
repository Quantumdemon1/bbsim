
import { useState } from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useGameStatePersistence } from '@/hooks/gameState/useGameStatePersistence';

interface PersistenceManagerProps {
  gameId: string | null;
  gameState: 'idle' | 'lobby' | 'playing' | 'ended';
  currentWeek: number;
  players: PlayerData[];
  phaseProgress: Record<string, { playersReady: string[], completed: boolean }>;
}

export function usePersistenceManager({
  gameId,
  gameState,
  currentWeek,
  players,
  phaseProgress
}: PersistenceManagerProps) {
  const gamePersistence = useGameStatePersistence();
  
  const saveCurrentGame = async () => {
    if (!gameId || gameState !== 'playing') {
      return;
    }
    
    await gamePersistence.saveGameState({
      game_id: gameId,
      week: currentWeek,
      phase: phaseProgress ? Object.keys(phaseProgress)[0] : 'HoH Competition',
      players: players,
      hoh: players.find(p => p.status === 'hoh')?.id || null,
      veto: players.find(p => p.status === 'veto')?.id || null,
      nominees: players.filter(p => p.status === 'nominated').map(p => p.id)
    });
  };
  
  const loadGame = async (gameId: string) => {
    const gameState = await gamePersistence.loadGameState(gameId);
    
    if (gameState) {
      return {
        gameId: gameState.gameId,
        week: gameState.week,
        phase: gameState.phase,
        players: gameState.players
      };
    }
    
    return null;
  };
  
  const deleteSavedGame = async (gameId: string) => {
    return await gamePersistence.deleteGameState(gameId);
  };

  return {
    saveCurrentGame,
    loadGame,
    deleteSavedGame,
    savedGames: gamePersistence.savedGames,
    isLoadingSave: gamePersistence.isLoading
  };
}
