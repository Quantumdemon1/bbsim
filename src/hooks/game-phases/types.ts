
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

// Game State Types
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

// Player Attributes
export interface PlayerAttributes {
  general: number;
  physical: number;
  endurance: number;
  mentalQuiz: number;
  strategic: number;
  loyalty: number;
  social: number;
  temperament: number;
}

// Player Relationships
export interface PlayerRelationship {
  playerId: string;
  targetId: string;
  type: RelationshipType;
  extraPoints: number;
  isMutual: boolean;
  isPermanent: boolean;
}

export type RelationshipType = 
  | 'Neutral' 
  | 'Slight Bond' 
  | 'Small Bond' 
  | 'Medium Bond' 
  | 'Strong Bond'
  | 'Ride or Die'
  | 'Slight Dislike' 
  | 'Mild Dislike' 
  | 'Dislike' 
  | 'Strong Dislike'
  | 'Nemesis';

// Phase-specific interfaces
export interface HoHPhaseProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  setHoH: (hohId: string | null) => void;
  setStatusMessage: (message: string) => void;
  setPhase: (phase: GamePhase | string) => void;
  setSelectedPlayers: (players: string[]) => void;
  toast: (props: ToastProps) => void;
}

export interface NominationPhaseProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  setNominees: (nominees: string[]) => void;
  hoh: string | null;
  setStatusMessage: (message: string) => void;
  setPhase: (phase: GamePhase | string) => void;
  setSelectedPlayers: (players: string[]) => void;
  usePowerup: (playerId: string) => void;
  toast: (props: ToastProps) => void;
}

export interface PoVPhaseProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  setVeto: (vetoId: string | null) => void;
  setStatusMessage: (message: string) => void;
  setPhase: (phase: GamePhase | string) => void;
  setSelectedPlayers: (players: string[]) => void;
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
  setPhase: (phase: GamePhase | string) => void;
  setSelectedPlayers: (players: string[]) => void;
  usePowerup: (playerId: string) => void;
  toast: (props: ToastProps) => void;
}

export interface EvictionPhaseProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  nominees: string[];
  setSelectedPlayers: (players: string[]) => void;
  setStatusMessage: (message: string) => void;
  setPhase: (phase: GamePhase | string) => void;
  usePowerup: (playerId: string) => void;
  toast: (props: ToastProps) => void;
}

export interface SpecialCompetitionPhaseProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  week: number;
  setWeek: (week: number) => void;
  setPhase: (phase: GamePhase | string) => void;
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
  setPhase: (phase: GamePhase | string) => void;
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
  setPhase: (phase: GamePhase | string) => void;
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
  phase: GamePhase | string;
}

export interface GameActionsProps {
  state: GamePhaseState;
  setPlayers: (players: PlayerData[]) => void;
  setWeek: (week: number) => void;
  setPhase: (phase: GamePhase | string) => void;
  setHoH: (hohId: string | null) => void;
  setVeto: (vetoId: string | null) => void;
  setNominees: (nominees: string[]) => void;
  setSelectedPlayers: (players: string[]) => void;
  setStatusMessage: (message: string) => void;
  setWeekSummaries?: (summaries: WeekSummary[]) => void;
  usePowerup: (playerId: string) => void;
  toast: (props: ToastProps) => void;
}

// Constants
export const attributeLevels = [
  { value: 1, label: "1: Terrible" },
  { value: 2, label: "2: Poor" },
  { value: 3, label: "3: Average" },
  { value: 4, label: "4: Good" },
  { value: 5, label: "5: Excellent" }
];

export const relationshipTypes: RelationshipType[] = [
  "Neutral",
  "Slight Bond",
  "Small Bond", 
  "Medium Bond", 
  "Strong Bond",
  "Ride or Die",
  "Slight Dislike",
  "Mild Dislike", 
  "Dislike", 
  "Strong Dislike",
  "Nemesis"
];

export const attributeDescriptions = {
  general: "Overall competition ability",
  physical: "Performance in physical competitions",
  endurance: "Stamina and ability in endurance competitions",
  mentalQuiz: "Mental quizzes and memory competitions",
  strategic: "Strategic game understanding and planning",
  loyalty: "Tendency to remain loyal to allies",
  social: "Social game and relationship building",
  temperament: "Emotional control and reaction to stress"
};
