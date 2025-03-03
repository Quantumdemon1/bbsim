
import { PlayerData } from '@/components/PlayerProfileTypes';

export interface WeekSummary {
  week: number;
  hoh: string | null;
  nominees: string[];
  veto: string | null;
  vetoUsed: boolean;
  evicted: string | null;
  notes?: string[];
}

export interface GamePhaseProps {
  players: PlayerData[];
  week: number;
  initialPhase?: string;
}

export interface GamePhaseState {
  week: number;
  phase: string;
  players: PlayerData[];
  nominees: string[];
  hoh: string | null;
  veto: string | null;
  vetoUsed: boolean;
  lastHoH: string | null;
  statusMessage: string;
  selectedPlayers: string[];
  finalists: string[];
  jurors: string[];
  votes: Record<string, string>;
  weekSummaries: WeekSummary[];
}

export interface GamePhaseSetters {
  setWeek: (week: number) => void;
  setPlayers: (players: PlayerData[]) => void;
  setPhase: (phase: string) => void;
  setHoH: (hohId: string | null) => void;
  setVeto: (vetoId: string | null) => void;
  setVetoUsed: (used: boolean) => void;
  setLastHoH: (hohId: string | null) => void;
  setNominees: (nominees: string[]) => void;
  setSelectedPlayers: (players: string[]) => void;
  setStatusMessage: (message: string) => void;
  setFinalists: (finalists: string[]) => void;
  setJurors: (jurors: string[]) => void;
  setVotes: (votes: Record<string, string>) => void;
  setWeekSummaries: (summaries: WeekSummary[]) => void;
}

export interface ToastProps {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}
