
import { PlayerData } from '@/components/PlayerProfileTypes';

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
