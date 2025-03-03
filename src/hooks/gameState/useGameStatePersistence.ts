import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { GameStateService, SavedGameState } from './types/gameStatePersistenceTypes';
import { 
  fetchSavedGames, 
  persistGameState, 
  fetchGameState, 
  deleteGame 
} from './utils/gameStatePersistenceUtils';

export function useGameStatePersistence(): GameStateService {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedGames, setSavedGames] = useState<SavedGameState[]>([]);
  const { toast } = useToast();

  // Load saved games for the current user
  const loadSavedGames = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const games = await fetchSavedGames();
      setSavedGames(games);
    } catch (err) {
      console.error('Error loading saved games:', err);
      setError('Failed to load saved games');
      toast({
        title: 'Error',
        description: 'Failed to load saved games',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save current game state
  const saveGameState = async (state: Omit<SavedGameState, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await persistGameState(state);
      
      if (result.error) throw result.error;
      
      toast({
        title: 'Game Saved',
        description: 'Your game has been saved successfully',
      });
      
      // Refresh the list of saved games
      await loadSavedGames();
      
      return result.data;
    } catch (err) {
      console.error('Error saving game state:', err);
      setError('Failed to save game state');
      toast({
        title: 'Error',
        description: 'Failed to save game state',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Load a specific game state
  const loadGameState = async (gameId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const gameState = await fetchGameState(gameId);
      
      if (!gameState) {
        toast({
          title: 'Game Not Found',
          description: 'The requested game could not be found',
          variant: 'destructive',
        });
        return null;
      }
      
      toast({
        title: 'Game Loaded',
        description: 'Your game has been loaded successfully',
      });
      
      return gameState;
    } catch (err) {
      console.error('Error loading game state:', err);
      setError('Failed to load game state');
      toast({
        title: 'Error',
        description: 'Failed to load game state',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a saved game
  const deleteGameState = async (gameId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await deleteGame(gameId);
      
      toast({
        title: 'Game Deleted',
        description: 'The saved game has been deleted',
      });
      
      // Refresh the list of saved games
      await loadSavedGames();
      
      return true;
    } catch (err) {
      console.error('Error deleting game state:', err);
      setError('Failed to delete game state');
      toast({
        title: 'Error',
        description: 'Failed to delete game state',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load saved games when component mounts
  useEffect(() => {
    loadSavedGames();
  }, []);

  return {
    isLoading,
    error,
    savedGames,
    saveGameState,
    loadGameState,
    deleteGameState,
    loadSavedGames
  };
}

// Re-export types for easier imports elsewhere
export type { SavedGameState } from './types/gameStatePersistenceTypes';
