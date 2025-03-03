
export interface PhaseProgressProps {
  gameMode: 'singleplayer' | 'multiplayer' | null;
  humanPlayerCount: number;
}

export interface PhaseProgressInfo {
  [phase: string]: SinglePhaseProgressInfo;
}

export interface SinglePhaseProgressInfo {
  playersReady: string[];
  completed: boolean;
  completedCount: number;
  totalCount: number;
  percentage: number;
  hasStartedCountdown: boolean;
}
