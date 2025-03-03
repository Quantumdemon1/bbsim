
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
  isAdmin?: boolean; // Add this new property
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
