
import { PlayerData } from '@/components/PlayerProfileTypes';

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
  players: unknown;
  hoh_id: string | null;
  veto_holder_id: string | null;
  nominees: unknown;
  created_at: string;
  updated_at: string;
}

export interface GameStateService {
  isLoading: boolean;
  error: string | null;
  savedGames: SavedGameState[];
  saveGameState: (state: Omit<SavedGameState, 'id' | 'created_at' | 'updated_at'>) => Promise<any>;
  loadGameState: (gameId: string) => Promise<any>;
  deleteGameState: (gameId: string) => Promise<boolean>;
  loadSavedGames: () => Promise<void>;
}
