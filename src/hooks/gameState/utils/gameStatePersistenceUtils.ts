
import { supabase } from '@/integrations/supabase/client';
import { DatabaseGameState, SavedGameState } from '../types/gameStatePersistenceTypes';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { v4 as uuidv4 } from 'uuid';

// Transform database records to SavedGameState format
export const transformDatabaseToGameState = (data: DatabaseGameState[]): SavedGameState[] => {
  return data.map((item: DatabaseGameState) => ({
    id: item.id,
    game_id: item.game_id,
    week: item.week,
    phase: item.phase,
    players: item.players as unknown as PlayerData[] || [],
    hoh: item.hoh_id,
    veto: item.veto_holder_id,
    nominees: item.nominees ? (item.nominees as unknown as string[]) : [],
    created_at: item.created_at,
    updated_at: item.updated_at
  }));
};

// Load saved games from database
export const fetchSavedGames = async () => {
  const { data, error } = await supabase
    .from('game_states')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  
  return transformDatabaseToGameState(data as DatabaseGameState[] || []);
};

// Save or update game state
export const persistGameState = async (
  state: Omit<SavedGameState, 'id' | 'created_at' | 'updated_at'>
) => {
  // Check if this game already has a saved state
  const { data: existingData } = await supabase
    .from('game_states')
    .select('id')
    .eq('game_id', state.game_id)
    .maybeSingle();

  if (existingData?.id) {
    // Update existing game state
    return await supabase
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
    return await supabase
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
};

// Load a specific game state
export const fetchGameState = async (gameId: string) => {
  const { data, error } = await supabase
    .from('game_states')
    .select('*')
    .eq('game_id', gameId)
    .maybeSingle();

  if (error) throw error;
  
  if (!data) return null;

  const dbState = data as DatabaseGameState;
  
  return {
    gameId: dbState.game_id,
    week: dbState.week,
    phase: dbState.phase,
    players: dbState.players as unknown as PlayerData[] || [],
    hoh: dbState.hoh_id,
    veto: dbState.veto_holder_id,
    nominees: dbState.nominees ? (dbState.nominees as unknown as string[]) : []
  };
};

// Delete a saved game
export const deleteGame = async (gameId: string) => {
  const { error } = await supabase
    .from('game_states')
    .delete()
    .eq('game_id', gameId);

  if (error) throw error;
  
  return true;
};
