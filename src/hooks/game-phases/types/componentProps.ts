
import { PlayerData } from '@/components/PlayerProfile';
import { WeekSummary } from './common';

export interface HoHCompetitionProps {
  players: PlayerData[];
  selectedPlayers: string[];
  onPlayerSelect: (playerId: string) => void;
  onAction: (action: string) => void;
}

export interface NominationCeremonyProps {
  players: PlayerData[];
  hoh: string | null;
  selectedPlayers: string[];
  onPlayerSelect: (playerId: string) => void;
  onAction: (action: string) => void;
}

export interface PoVCompetitionProps {
  players: PlayerData[];
  selectedPlayers: string[];
  onPlayerSelect: (playerId: string) => void;
  onAction: (action: string) => void;
}

export interface VetoCeremonyProps {
  players: PlayerData[];
  veto: string | null;
  nominees: string[];
  onAction: (action: string, data?: any) => void;
}

export interface EvictionVotingProps {
  players: PlayerData[];
  nominees: string[];
  alliances: any[];
  onAction: (action: string, data?: any) => void;
}

export interface EvictionProps {
  players: PlayerData[];
  selectedPlayers: string[];
  statusMessage: string;
  week: number;
  onAction: (action: string) => void;
}

export interface WeeklySummaryProps {
  players: PlayerData[];
  weekSummaries: WeekSummary[];
  currentWeek: number;
  onAction: (action: string) => void;
}

export interface PlacementsChartProps {
  players: PlayerData[];
  finalists: string[];
  jurors: string[];
  votes: Record<string, string>;
  onAction: (action: string) => void;
}

export interface SpecialCompetitionProps {
  players: PlayerData[];
  selectedPlayers: string[];
  onPlayerSelect: (playerId: string) => void;
  onAction: (action: string) => void;
}

export interface JuryQuestionsProps {
  players: PlayerData[];
  finalists: string[];
  jurors: string[];
  statusMessage: string;
  onAction: (action: string) => void;
}

export interface JuryVotingProps {
  players: PlayerData[];
  finalists: string[];
  jurors: string[];
  votes: Record<string, string>;
  statusMessage: string;
  onAction: (action: string, data?: any) => void;
}

export interface WinnerRevealProps {
  players: PlayerData[];
  votes: Record<string, string>;
  finalists: string[];
  onAction: (action: string) => void;
}

export interface FinaleStatsProps {
  players: PlayerData[];
  onAction: (action: string) => void;
}

export interface DefaultPhaseProps {
  phase: string;
  statusMessage: string;
}
