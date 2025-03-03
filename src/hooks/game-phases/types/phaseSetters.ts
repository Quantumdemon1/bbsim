
import { PlayerData } from '@/components/PlayerProfileTypes';
import { WeekSummary } from './weekSummary';

export interface GamePhaseSetters {
  setWeek: (week: number) => void;
  setPlayers: (players: PlayerData[]) => void;
  setPhase: (phase: string) => void;
  setHoH: (hoh: string | null) => void;
  setVeto: (veto: string | null) => void;
  setVetoUsed: (used: boolean) => void;
  setLastHoH: (lastHoH: string | null) => void;
  setNominees: (nominees: string[]) => void;
  setSelectedPlayers: (selectedPlayers: string[]) => void;
  setStatusMessage: (message: string) => void;
  setFinalists: (finalists: string[]) => void;
  setJurors: (jurors: string[]) => void;
  setVotes: (votes: Record<string, string>) => void;
  setWeekSummaries: (summaries: WeekSummary[]) => void;
}
