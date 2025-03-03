
import { PlayerData } from '@/components/PlayerProfileTypes';

export interface NominationPhaseProps {
  players: PlayerData[];
  hoh: string | null;
  setNominees: (nominees: string[]) => void;
  setPhase: (phase: string) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  setSelectedPlayers: (players: string[]) => void;
  usePowerup: (playerId: string) => void;
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
  setPlayers: (players: PlayerData[]) => void;
  setSelectedPlayers: (players: string[]) => void;
  usePowerup: (playerId: string) => void;
}
