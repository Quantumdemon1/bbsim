
export interface PhaseProgressProps {
  gameMode: 'singleplayer' | 'multiplayer' | null;
  humanPlayerCount: number;
}

export interface PhaseProgressInfo {
  [phase: string]: {
    playersReady: string[];
    completed: boolean;
  };
}

export interface SinglePhaseProgressInfo {
  playersReady: string[];
  completed: boolean;
  completedCount: number;
  totalCount: number;
  percentage: number;
  hasStartedCountdown: boolean;
}
