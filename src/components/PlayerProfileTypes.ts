
import { PlayerAttributes, PlayerRelationship } from '@/hooks/game-phases/types/player';

export interface PlayerData {
  id: string;
  name: string;
  image?: string;
  status?: 'hoh' | 'nominated' | 'veto' | 'safe' | 'evicted' | 'winner' | 'juror' | 'runner-up';
  powerup?: 'immunity' | 'nullify' | 'coup' | 'replay';
  attributes?: PlayerAttributes;
  relationships?: PlayerRelationship[];
  bio?: string;
  age?: number;
  hometown?: string;
  occupation?: string;
  isAdmin?: boolean;
  isHuman?: boolean; // True for human players, false for AI players
  isAI?: boolean;    // Explicit flag for AI players
  personality?: {    // AI personality traits
    archetype?: 'mastermind' | 'social-butterfly' | 'comp-beast' | 'floater' | 'villain';
    traits?: string[];
    background?: string;
    motivation?: string;
  };
  stats?: {
    hohWins?: number;
    povWins?: number;
    timesNominated?: number;
    daysInHouse?: number;
    juryVotes?: number;
    placement?: number;
    competitionsWon?: number;
  };
  alliances?: string[];
}

export interface PhaseProgressInfo {
  playersReady: string[];
  completed: boolean;
  completedCount: number;
  totalCount: number;
  percentage: number;
  hasStartedCountdown: boolean;
}
