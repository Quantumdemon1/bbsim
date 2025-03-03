
import { PlayerAttributes, PlayerRelationship } from '@/hooks/game-phases/types/player';

export interface PlayerData {
  id: string;
  name: string;
  image?: string;
  status?: 'hoh' | 'nominated' | 'veto' | 'safe' | 'evicted' | 'winner' | 'juror' | 'runner-up';
  powerup?: 'immunity' | 'nullify' | 'coup' | 'replay';
  attributes?: PlayerAttributes;
  relationships?: PlayerRelationship[];
  stats?: {
    hohWins?: number;
    povWins?: number;
    timesNominated?: number;
    daysInHouse?: number;
    juryVotes?: number;
    placement?: number;
  };
  alliances?: string[];
}

export default PlayerData;
