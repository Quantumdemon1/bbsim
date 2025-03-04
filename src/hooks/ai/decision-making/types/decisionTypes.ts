
import { PlayerData } from '@/components/PlayerProfileTypes';
import { AIPlayerDecision, AIMemoryEntry } from '../../types';

export type DecisionType = 'nominate' | 'vote' | 'veto' | 'alliance';

export interface DecisionContext {
  player: PlayerData;
  options: string[];
  allPlayers: PlayerData[];
  memory: AIMemoryEntry[];
}
