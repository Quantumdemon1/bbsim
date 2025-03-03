
import { PlayerData } from '@/components/PlayerProfile';

// Game Phases
export type GamePhase = 
  | 'HoH Competition'
  | 'Nomination Ceremony' 
  | 'PoV Competition'
  | 'Veto Ceremony'
  | 'Eviction Voting'
  | 'Special Competition'
  | 'Jury Questions'
  | 'Jury Voting'
  | 'The Winner'
  | 'Finale Stats'
  | 'Weekly Summary'
  | 'Placements'
  | 'Eviction';

// Base Game State Types
export interface GamePhaseState {
  week: number;
  phase: GamePhase | string; 
  players: PlayerData[];
  nominees: string[];
  hoh: string | null;
  veto: string | null;
  statusMessage: string;
  selectedPlayers: string[];
  finalists: string[];
  jurors: string[];
  votes: Record<string, string>;
  weekSummaries: WeekSummary[];
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

// Weekly Summary Type
export interface WeekSummary {
  weekNumber: number;
  hoh: string | null;
  nominees: string[];
  vetoPlayers: string[];
  vetoWinner: string | null;
  vetoUsed: boolean;
  saved?: string;
  replacement?: string;
  finalNominees: string[];
  evicted: string | null;
  evictionVotes?: string;
}

// Game State Setters
export interface GamePhaseSetters {
  setWeek: (week: number) => void;
  setPlayers: (players: PlayerData[]) => void;
  setPhase: (phase: GamePhase | string) => void;
  setHoH: (hohId: string | null) => void;
  setVeto: (vetoId: string | null) => void;
  setNominees: (nominees: string[]) => void;
  setSelectedPlayers: (players: string[]) => void;
  setStatusMessage: (message: string) => void;
  setFinalists: (finalists: string[]) => void;
  setJurors: (jurors: string[]) => void;
  setVotes: (votes: Record<string, string>) => void;
  setWeekSummaries: (summaries: WeekSummary[]) => void;
}

// Toast interface
export interface ToastProps {
  title: string;
  description: string;
  variant?: "default" | "destructive";
}
