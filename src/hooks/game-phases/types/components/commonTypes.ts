
import { PlayerData } from '@/components/PlayerProfileTypes';
import { GamePhaseState } from '../gamePhaseState';
import { WeekSummary } from '../weekSummary';

export interface ToastProps {
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

export interface GameActionsProps {
  state: GamePhaseState;
  setPlayers: (players: PlayerData[]) => void;
  setWeek: (week: number) => void;
  setPhase: (phase: string) => void;
  setHoH: (hohId: string | null) => void;
  setVeto: (vetoId: string | null) => void;
  setNominees: (nominees: string[]) => void;
  setSelectedPlayers: (selectedPlayers: string[]) => void;
  setStatusMessage: (message: string) => void;
  setWeekSummaries: (summaries: WeekSummary[]) => void;
  usePowerup: (playerId: string) => void;
  toast: any;
  handleAction: (action: string, data?: any) => void;
  statusMessage: string;
  selectedPlayers: string[];
  handlePlayerSelect: (playerId: string) => void;
}

export interface PlayerSelectionProps {
  players: PlayerData[];
  selectedPlayers: string[];
  setSelectedPlayers: (players: string[]) => void;
  selectionLimit?: number;
  excludeIds?: string[];
  onlyStatusIds?: string[];
  phase?: string;
}
