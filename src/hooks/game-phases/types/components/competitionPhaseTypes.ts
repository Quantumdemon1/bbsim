
import { PlayerData } from '@/components/PlayerProfileTypes';

export interface HoHPhaseProps {
  players: PlayerData[];
  week: number;
  lastHoH: string | null;
  setHoH: (hohId: string) => void;
  setPhase: (phase: string) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  setSelectedPlayers: (players: string[]) => void;
  setLastHoH: (lastHoH: string | null) => void;
}

export interface PoVPhaseProps {
  players: PlayerData[];
  nominees: string[];
  hoh: string | null;
  setVeto: (vetoId: string) => void;
  setPhase: (phase: string) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  setSelectedPlayers: (players: string[]) => void;
  setVetoUsed: (used: boolean) => void;
}

export interface SpecialCompetitionPhaseProps {
  players: PlayerData[];
  setPhase: (phase: string) => void;
  setStatusMessage: (message: string) => void;
  toast: any;
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  setSelectedPlayers: (players: string[]) => void;
  week: number;
  setWeek: (week: number) => void;
}

export interface UseNominationPhaseResult {
  nominate: (nominees: string[]) => void;
  handleNominate: () => void;
  startNominations: () => void;
}

export interface UseVetoPhaseResult {
  handleUseVeto: (nomineeId: string) => void;
  handleDoNotUseVeto: () => void;
  handleVetoAction: (action: string) => void;
  useVeto: (nomineeId: string) => void;
  replaceNominee: (nomineeId: string) => void;
  doNotUseVeto: () => void;
  startVetoCeremony: () => void;
}
