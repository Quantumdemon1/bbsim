
import { PlayerData } from '@/components/PlayerProfileTypes';

export interface GamePhaseProps {
  players: PlayerData[];
  week: number;
  initialPhase?: string;
}
