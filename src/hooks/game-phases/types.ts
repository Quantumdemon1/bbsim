
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
