
import { PlayerData } from '@/components/PlayerProfileTypes';
import { PlayerAttributes, PlayerRelationship } from './types/player';

export interface GamePhaseProps {
  players: PlayerData[];
  week: number;
  initialPhase?: string;
}

// Add AIMemoryEntry type
export interface AIMemoryEntry {
  type: string;
  week: number;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  importance: number;
  timestamp: number;
}

// Add BotEmotions type
export type BotEmotions = Record<string, string>;

export interface UseNominationPhaseResult {
  nominate: (nominees: string[]) => void;
}

export interface UseVetoPhaseResult {
  handleUseVeto: (nomineeId: string) => void;
  handleDoNotUseVeto: () => void;
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
  finalists?: string[];
  jurors?: string[];
  votes?: Record<string, string>;
  weekSummaries?: WeekSummary[];
}

export interface GamePhaseSetters {
  setWeek: (week: number) => void;
  setPlayers: (players: PlayerData[]) => void;
  setPhase: (phase: string) => void;
  setHoH: (hoh: string | null) => void;
  setVeto: (veto: string | null) => void;
  setVetoUsed: (used: boolean) => void;
  setLastHoH: (lastHoH: string | null) => void;
  setNominees: (nominees: string[]) => void;
  setSelectedPlayers: (selectedPlayers: string[]) => void;
  setStatusMessage: (message: string) => void;
  setFinalists: (finalists: string[]) => void;
  setJurors: (jurors: string[]) => void;
  setVotes: (votes: Record<string, string>) => void;
  setWeekSummaries: (summaries: WeekSummary[]) => void;
}

export interface WeekSummary {
  week: number;
  hoh: string | null;
  nominees: string[];
  vetoWinner: string | null;
  vetoUsed: boolean;
  finalNominees?: string[];
  evicted: string | null;
  evictionVotes?: string;
  jurors?: string[];
  competitions?: {
    hoh?: {
      type: string;
      winner: string;
      results?: any;
    };
    veto?: {
      type: string;
      winner: string;
      results?: any;
    };
  };
  keyEvents?: {
    type: string;
    description: string;
    players: string[];
  }[];
}

export interface ToastProps {
  toast: any;
}

export interface GameActionsProps {
  handleAction: (action: string, data?: any) => void;
  statusMessage: string;
  selectedPlayers: string[];
  handlePlayerSelect: (playerId: string) => void;
}

// Phase Props types
export interface HoHPhaseProps {
  players: PlayerData[];
  week: number;
  lastHoH: string | null;
  setHoH: (hohId: string) => void;
  setPhase: (phase: string) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
}

export interface NominationPhaseProps {
  players: PlayerData[];
  hoh: string | null;
  setNominees: (nominees: string[]) => void;
  setPhase: (phase: string) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
}

export interface PoVPhaseProps {
  players: PlayerData[];
  nominees: string[];
  hoh: string | null;
  setVeto: (vetoId: string) => void;
  setPhase: (phase: string) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
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
}

export interface EvictionPhaseProps {
  players: PlayerData[];
  nominees: string[];
  hoh: string | null;
  setPhase: (phase: string) => void;
  setPlayers: (players: PlayerData[]) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
}

export interface SpecialCompetitionPhaseProps {
  players: PlayerData[];
  setPhase: (phase: string) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
}

export interface PlayerSelectionProps {
  players: PlayerData[];
  selectedPlayers: string[];
  setSelectedPlayers: (players: string[]) => void;
  selectionLimit?: number;
  excludeIds?: string[];
  onlyStatusIds?: string[];
}

export interface JuryQuestionsProps {
  players: PlayerData[];
  jurors: string[];
  finalists: string[];
  setPhase: (phase: string) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
}

export interface JuryVotingProps {
  players: PlayerData[];
  jurors: string[];
  finalists: string[];
  setVotes: (votes: Record<string, string>) => void;
  setPhase: (phase: string) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
}

// Export player types to allow direct import from game-phases/types
export { PlayerAttributes, PlayerRelationship, relationshipTypes, RelationshipType, attributeLevels, attributeDescriptions } from './types/player';
