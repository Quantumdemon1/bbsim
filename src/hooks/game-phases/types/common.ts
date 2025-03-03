
import { PlayerData } from '@/components/PlayerProfileTypes';

export interface WeekSummary {
  week: number;
  weekNumber?: number; // Add for backward compatibility
  hoh: string | null;
  nominees: string[];
  vetoPlayers?: string[]; // Add for PoV participants
  vetoWinner?: string | null; // Add for veto winner
  vetoUsed: boolean;
  finalNominees?: string[]; // Add for final nominees after veto
  evicted: string | null;
  evictionVotes?: string; // Add for voting results
  notes?: string[];
}

export interface ToastProps {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

export interface GamePhaseProps {
  players: PlayerData[];
  week: number;
  initialPhase?: string;
}

export interface GamePhaseState {
  week: number;
  phase: string;
  players: PlayerData[];
  nominees: string[];
  hoh: string | null;
  veto: string | null;
  vetoUsed: boolean;
  lastHoH: string | null;
  statusMessage: string;
  selectedPlayers: string[];
  finalists: string[];
  jurors: string[];
  votes: Record<string, string>;
  weekSummaries: WeekSummary[];
}

export interface GamePhaseSetters {
  setWeek: (week: number) => void;
  setPlayers: (players: PlayerData[]) => void;
  setPhase: (phase: string) => void;
  setHoH: (hohId: string | null) => void;
  setVeto: (vetoId: string | null) => void;
  setVetoUsed: (used: boolean) => void;
  setLastHoH: (hohId: string | null) => void;
  setNominees: (nominees: string[]) => void;
  setSelectedPlayers: (players: string[]) => void;
  setStatusMessage: (message: string) => void;
  setFinalists: (finalists: string[]) => void;
  setJurors: (jurors: string[]) => void;
  setVotes: (votes: Record<string, string>) => void;
  setWeekSummaries: (summaries: WeekSummary[]) => void;
}

// Add all the missing props interfaces
export interface GameActionsProps {
  state: {
    week: number;
    players: PlayerData[];
    hoh: string | null;
    veto: string | null;
    nominees: string[];
  };
  setPlayers: (players: PlayerData[]) => void;
  setWeek: (week: number) => void;
  setPhase: (phase: string) => void;
  setHoH: (hohId: string | null) => void;
  setVeto: (vetoId: string | null) => void;
  setNominees: (nominees: string[]) => void;
  setSelectedPlayers: (players: string[]) => void;
  setStatusMessage: (message: string) => void;
  usePowerup: (playerId: string) => void;
  toast: (props: ToastProps) => void;
}

export interface HoHPhaseProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  setHoH: (playerId: string | null) => void;
  setStatusMessage: (message: string) => void;
  setPhase: (phase: string) => void;
  setSelectedPlayers: (playerIds: string[]) => void;
  lastHoH: string | null;
  setLastHoH: (playerId: string | null) => void;
  toast: (props: ToastProps) => void;
}

export interface NominationPhaseProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  setNominees: (nominees: string[]) => void;
  hoh: string | null;
  setStatusMessage: (message: string) => void;
  setPhase: (phase: string) => void;
  setSelectedPlayers: (playerIds: string[]) => void;
  usePowerup: (playerId: string) => void;
  toast: (props: ToastProps) => void;
}

export interface PoVPhaseProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  setVeto: (playerId: string | null) => void;
  setStatusMessage: (message: string) => void;
  setPhase: (phase: string) => void;
  setSelectedPlayers: (playerIds: string[]) => void;
  hoh: string | null;
  nominees: string[];
  setVetoUsed: (used: boolean) => void;
  toast: (props: ToastProps) => void;
}

export interface VetoPhaseProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  nominees: string[];
  setNominees: (nominees: string[]) => void;
  veto: string | null;
  hoh: string | null;
  setStatusMessage: (message: string) => void;
  setPhase: (phase: string) => void;
  setSelectedPlayers: (playerIds: string[]) => void;
  usePowerup: (playerId: string) => void;
  setVetoUsed: (used: boolean) => void;
  toast: (props: ToastProps) => void;
}

export interface EvictionPhaseProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  nominees: string[];
  setSelectedPlayers: (playerIds: string[]) => void;
  setStatusMessage: (message: string) => void;
  setPhase: (phase: string) => void;
  usePowerup: (playerId: string) => void;
  toast: (props: ToastProps) => void;
}

export interface SpecialCompetitionPhaseProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  week: number;
  setWeek: (week: number) => void;
  setPhase: (phase: string) => void;
  setSelectedPlayers: (playerIds: string[]) => void;
  setStatusMessage: (message: string) => void;
  toast: (props: ToastProps) => void;
}

export interface PlayerSelectionProps {
  selectedPlayers: string[];
  setSelectedPlayers: (playerIds: string[]) => void;
  phase: string;
}

export interface JuryQuestionsProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  finalists: string[];
  setFinalists: (finalistIds: string[]) => void;
  jurors: string[];
  setJurors: (jurorIds: string[]) => void;
  setStatusMessage: (message: string) => void;
  setPhase: (phase: string) => void;
  setSelectedPlayers: (playerIds: string[]) => void;
  toast: (props: ToastProps) => void;
}

export interface JuryVotingProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  finalists: string[];
  votes: Record<string, string>;
  setVotes: (votes: Record<string, string>) => void;
  setStatusMessage: (message: string) => void;
  setPhase: (phase: string) => void;
  setSelectedPlayers: (playerIds: string[]) => void;
  toast: (props: ToastProps) => void;
}
