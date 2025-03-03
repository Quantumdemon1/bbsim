
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

export interface PlayerRelationship {
  playerId: string;
  targetId: string;
  type: 'Neutral' | 'Small Bond' | 'Medium Bond' | 'Strong Bond' | 'Slight Dislike' | 'Dislike' | 'Mild Dislike' | 'Strong Dislike';
  extraPoints: number;
  isMutual: boolean;
  isPermanent: boolean;
}

export const attributeLevels = [
  { value: 1, label: "1: Terrible" },
  { value: 2, label: "2: Poor" },
  { value: 3, label: "3: Average" },
  { value: 4, label: "4: Good" },
  { value: 5, label: "5: Excellent" }
];

export const relationshipTypes = [
  "Neutral",
  "Slight Bond",
  "Small Bond", 
  "Medium Bond", 
  "Strong Bond",
  "Slight Dislike",
  "Mild Dislike", 
  "Dislike", 
  "Strong Dislike"
];
