
import { PlayerData } from '@/components/PlayerProfile';

export interface GamePhaseState {
  week: number;
  phase: string;
  players: PlayerData[];
  nominees: string[];
  hoh: string | null;
  veto: string | null;
  statusMessage: string;
  selectedPlayers: string[];
}

export interface GamePhaseActions {
  handlePlayerSelect: (playerId: string) => void;
  handleAction: (action: string, data?: any) => void;
  setWeek: (week: number) => void;
  setPhase: (phase: string) => void;
}

export interface GamePhaseProps {
  players: PlayerData[];
  week: number;
  initialPhase?: string;
}
