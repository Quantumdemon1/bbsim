
import { PlayerData } from '@/components/PlayerProfileTypes';
import { WeekSummary } from './weekSummary';
import { toast } from '@/hooks/use-toast';

export interface ToastProps {
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

export interface GameActionsProps {
  state: GamePhaseState;
  setPlayers: (players: PlayerData[]) => void;
  setWeek: (week: number) => void;
  setPhase: (phase: string) => void;
  setHoH: (hohId: string | null) => void;
  setVeto: (vetoId: string | null) => void;
  setNominees: (nominees: string[]) => void;
  setSelectedPlayers: (selectedPlayers: string[]) => void;
  setStatusMessage: (message: string) => void;
  setWeekSummaries: (summaries: WeekSummary[]) => void;
  usePowerup: (playerId: string) => void;
  toast: any;
  handleAction: (action: string, data?: any) => void;
  statusMessage: string;
  selectedPlayers: string[];
  handlePlayerSelect: (playerId: string) => void;
}

// Import required types
import { GamePhaseState } from './gamePhaseState';

// Phase Props types
export interface HoHPhaseProps {
  players: PlayerData[];
  week: number;
  lastHoH: string | null;
  setHoH: (hohId: string) => void;
  setPhase: (phase: string) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  setSelectedPlayers: (players: string[]) => void;
  setLastHoH: (lastHoH: string | null) => void;
}

export interface NominationPhaseProps {
  players: PlayerData[];
  hoh: string | null;
  setNominees: (nominees: string[]) => void;
  setPhase: (phase: string) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  setSelectedPlayers: (players: string[]) => void;
  usePowerup: (playerId: string) => void;
}

export interface PoVPhaseProps {
  players: PlayerData[];
  nominees: string[];
  hoh: string | null;
  setVeto: (vetoId: string) => void;
  setPhase: (phase: string) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  setSelectedPlayers: (players: string[]) => void;
  setVetoUsed: (used: boolean) => void;
}

export interface VetoPhaseProps {
  players: PlayerData[];
  nominees: string[];
  hoh: string | null;
  veto: string | null;
  setNominees: (nominees: string[]) => void;
  setPhase: (phase: string) => void;
  setVetoUsed: (used: boolean) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
  setPlayers: (players: PlayerData[]) => void;
  setSelectedPlayers: (players: string[]) => void;
  usePowerup: (playerId: string) => void;
}

export interface EvictionPhaseProps {
  players: PlayerData[];
  nominees: string[];
  hoh: string | null;
  setPhase: (phase: string) => void;
  setPlayers: (players: PlayerData[]) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
  setSelectedPlayers: (players: string[]) => void;
  usePowerup: (playerId: string) => void;
}

export interface SpecialCompetitionPhaseProps {
  players: PlayerData[];
  setPhase: (phase: string) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  setSelectedPlayers: (players: string[]) => void;
  week: number;
  setWeek: (week: number) => void;
}

export interface PlayerSelectionProps {
  players: PlayerData[];
  selectedPlayers: string[];
  setSelectedPlayers: (players: string[]) => void;
  selectionLimit?: number;
  excludeIds?: string[];
  onlyStatusIds?: string[];
  phase?: string;
}

export interface JuryQuestionsProps {
  players: PlayerData[];
  jurors: string[];
  finalists: string[];
  setPhase: (phase: string) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
  setPlayers: (players: PlayerData[]) => void;
  setSelectedPlayers: (players: string[]) => void;
}

export interface JuryVotingProps {
  players: PlayerData[];
  jurors: string[];
  finalists: string[];
  setVotes: (votes: Record<string, string>) => void;
  setPhase: (phase: string) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
  setPlayers: (players: PlayerData[]) => void;
  votes: Record<string, string>;
  setSelectedPlayers: (players: string[]) => void;
}

export interface UseNominationPhaseResult {
  nominate: (nominees: string[]) => void;
  handleNominate: () => void;
  startNominations: () => void;
}

export interface UseVetoPhaseResult {
  handleUseVeto: (nomineeId: string) => void;
  handleDoNotUseVeto: () => void;
  handleVetoAction: (action: string) => void;
  useVeto: (nomineeId: string) => void;
  replaceNominee: (nomineeId: string) => void;
  doNotUseVeto: () => void;
  startVetoCeremony: () => void;
}
