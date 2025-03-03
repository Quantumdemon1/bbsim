
import { useState, useEffect } from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useGameStatePersistence } from '@/hooks/gameState/useGameStatePersistence';
import { handleGameError, GameErrorCode } from '@/hooks/gameState/utils/errorHandling';
import { trackSaveGame } from '@/services/performance-monitoring';

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
  const [lastSaveAttempt, setLastSaveAttempt] = useState<Date | null>(null);
  const [lastSaveSuccess, setLastSaveSuccess] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<Error | null>(null);
  
  const saveCurrentGame = async (): Promise<void> => {
    if (!gameId || gameState !== 'playing') {
      return;
    }
    
    const performanceTracker = trackSaveGame();
    performanceTracker.start();
    setLastSaveAttempt(new Date());
    setSaveError(null);
    
    try {
      await gamePersistence.saveGameState({
        game_id: gameId,
        week: currentWeek,
        phase: phaseProgress ? Object.keys(phaseProgress)[0] : 'HoH Competition',
        players: players,
        hoh: players.find(p => p.status === 'hoh')?.id || null,
        veto: players.find(p => p.status === 'veto')?.id || null,
        nominees: players.filter(p => p.status === 'nominated').map(p => p.id)
      });
      
      setLastSaveSuccess(new Date());
    } catch (error) {
      setSaveError(error instanceof Error ? error : new Error('Unknown error during save'));
      handleGameError({
        code: GameErrorCode.SAVE_FAILED,
        message: error instanceof Error ? error.message : 'Failed to save game state',
        originalError: error
      });
    } finally {
      performanceTracker.end();
    }
  };
  
  const loadGame = async (gameId: string): Promise<boolean> => {
    const performanceTracker = trackSaveGame();
    performanceTracker.start();
    
    try {
      const gameState = await gamePersistence.loadGameState(gameId);
      
      if (gameState) {
        return true;
      }
      
      handleGameError({
        code: GameErrorCode.LOAD_FAILED,
        message: 'No game state found with the specified ID',
        context: { gameId }
      });
      
      return false;
    } catch (error) {
      handleGameError({
        code: GameErrorCode.LOAD_FAILED,
        message: error instanceof Error ? error.message : 'Failed to load game state',
        originalError: error,
        context: { gameId }
      });
      return false;
    } finally {
      performanceTracker.end();
    }
  };
  
  const deleteSavedGame = async (gameId: string): Promise<boolean> => {
    try {
      return await gamePersistence.deleteGameState(gameId);
    } catch (error) {
      handleGameError({
        code: GameErrorCode.DELETE_FAILED,
        message: error instanceof Error ? error.message : 'Failed to delete saved game',
        originalError: error,
        context: { gameId }
      });
      return false;
    }
  };

  return {
    saveCurrentGame,
    loadGame,
    deleteSavedGame,
    savedGames: gamePersistence.savedGames,
    isLoadingSave: gamePersistence.isLoading,
    lastSaveAttempt,
    lastSaveSuccess,
    saveError
  };
}
