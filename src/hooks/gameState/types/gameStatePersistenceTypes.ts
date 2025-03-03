
import { PlayerData } from '@/components/PlayerProfileTypes';
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

export interface DatabaseGameState {
  id: string;
  game_id: string;
  week: number;
  phase: string;
  players?: Json;
  hoh_id: string | null;
  veto_holder_id: string | null;
  nominees: Json | null;
  evicted_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface GameStateService {
  isLoading: boolean;
  error: string | null;
  savedGames: SavedGameState[];
  saveGameState: (state: Omit<SavedGameState, 'id' | 'created_at' | 'updated_at'>) => Promise<any>;
  loadGameState: (gameId: string) => Promise<{
    gameId: string;
    week: number;
    phase: string;
    players: PlayerData[];
    hoh: string | null;
    veto: string | null;
    nominees: string[];
  } | null>;
  deleteGameState: (gameId: string) => Promise<boolean>;
  loadSavedGames: () => Promise<void>;
}
