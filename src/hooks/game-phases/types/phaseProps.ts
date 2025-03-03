import { PlayerData } from '@/components/PlayerProfileTypes';
import { PlayerAttributes, PlayerRelationship } from './player';
import { WeekSummary } from '.';

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

export interface HoHPhaseProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  setHoH: (hohId: string | null) => void;
  setStatusMessage: (message: string) => void;
  setPhase: (phase: string) => void;
  setSelectedPlayers: (players: string[]) => void;
  lastHoH: string | null;
  setLastHoH: (hohId: string | null) => void;
  toast: any;
}

export interface NominationPhaseProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  setNominees: (nominees: string[]) => void;
  hoh: string | null;
  setStatusMessage: (message: string) => void;
  setPhase: (phase: string) => void;
  setSelectedPlayers: (players: string[]) => void;
  usePowerup: (playerId: string) => void;
  toast: any;
}

export interface PoVPhaseProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  setVeto: (vetoId: string | null) => void;
  setStatusMessage: (message: string) => void;
  setPhase: (phase: string) => void;
  setSelectedPlayers: (players: string[]) => void;
  hoh: string | null;
  nominees: string[];
  setVetoUsed: (used: boolean) => void;
  toast: any;
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
  setSelectedPlayers: (players: string[]) => void;
  usePowerup: (playerId: string) => void;
  setVetoUsed: (used: boolean) => void;
  toast: any;
}

export interface EvictionPhaseProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  nominees: string[];
  setSelectedPlayers: (players: string[]) => void;
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
  setSelectedPlayers: (players: string[]) => void;
  setStatusMessage: (message: string) => void;
  toast: (props: ToastProps) => void;
}

export interface JuryQuestionsProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  finalists: string[];
  setFinalists: (finalists: string[]) => void;
  jurors: string[];
  setJurors: (jurors: string[]) => void;
  setStatusMessage: (message: string) => void;
  setPhase: (phase: string) => void;
  setSelectedPlayers: (players: string[]) => void;
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
  setSelectedPlayers: (players: string[]) => void;
  toast: (props: ToastProps) => void;
}

export interface FinaleManagerProps {
  players: PlayerData[];
  setFinalists: (finalists: string[]) => void;
  setJurors: (jurors: string[]) => void;
  toast: (props: ToastProps) => void;
}

export interface PlayerSelectionProps {
  selectedPlayers: string[];
  setSelectedPlayers: (players: string[]) => void;
  phase: string;
}

export interface GameActionsProps {
  state: {
    week: number;
    phase: string;
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
  };
  setPlayers: (players: PlayerData[]) => void;
  setWeek: (week: number) => void;
  setPhase: (phase: string) => void;
  setHoH: (hohId: string | null) => void;
  setVeto: (vetoId: string | null) => void;
  setNominees: (nominees: string[]) => void;
  setSelectedPlayers: (players: string[]) => void;
  setStatusMessage: (message: string) => void;
  setWeekSummaries?: (summaries: WeekSummary[]) => void;
  usePowerup: (playerId: string) => void;
  toast: (props: ToastProps) => void;
}
