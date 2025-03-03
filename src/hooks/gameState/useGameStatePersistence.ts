
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { v4 as uuidv4 } from 'uuid';
import { Json } from '@/integrations/supabase/types';

export interface SavedGameState {
  id: string;
  game_id: string;
  week: number;
  phase: string;
  players: PlayerData[];
  hoh: string | null;
  veto: string | null;
  nominees: string[];
  created_at?: string;
  updated_at?: string;
}

interface DatabaseGameState {
  id: string;
  game_id: string;
  week: number;
  phase: string;
  players: Json;
  hoh_id: string | null;
  veto_holder_id: string | null;
  nominees: Json | null;
  evicted_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useGameStatePersistence() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedGames, setSavedGames] = useState<SavedGameState[]>([]);
  const { toast } = useToast();

  // Load saved games for the current user
  const loadSavedGames = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('game_states')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Transform database records to SavedGameState format
      const transformedData: SavedGameState[] = (data || []).map((item: DatabaseGameState) => ({
        id: item.id,
        game_id: item.game_id,
        week: item.week,
        phase: item.phase,
        players: item.players as unknown as PlayerData[],
        hoh: item.hoh_id,
        veto: item.veto_holder_id,
        nominees: item.nominees ? (item.nominees as unknown as string[]) : [],
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      
      setSavedGames(transformedData);
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
      // Check if this game already has a saved state
      const { data: existingData } = await supabase
        .from('game_states')
        .select('id')
        .eq('game_id', state.game_id)
        .maybeSingle();

      let result;
      
      if (existingData?.id) {
        // Update existing game state
        result = await supabase
          .from('game_states')
          .update({
            week: state.week,
            phase: state.phase,
            players: state.players,
            hoh_id: state.hoh,
            veto_holder_id: state.veto,
            nominees: state.nominees,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id)
          .select()
          .single();
      } else {
        // Create new game state
        result = await supabase
          .from('game_states')
          .insert({
            id: uuidv4(),
            game_id: state.game_id,
            week: state.week,
            phase: state.phase,
            players: state.players,
            hoh_id: state.hoh,
            veto_holder_id: state.veto,
            nominees: state.nominees
          })
          .select()
          .single();
      }

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
      const { data, error } = await supabase
        .from('game_states')
        .select('*')
        .eq('game_id', gameId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
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
      
      return {
        gameId: data.game_id,
        week: data.week,
        phase: data.phase,
        players: data.players as unknown as PlayerData[],
        hoh: data.hoh_id,
        veto: data.veto_holder_id,
        nominees: data.nominees ? (data.nominees as unknown as string[]) : []
      };
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
      const { error } = await supabase
        .from('game_states')
        .delete()
        .eq('game_id', gameId);

      if (error) throw error;
      
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
