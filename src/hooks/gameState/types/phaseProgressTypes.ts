
export type PhaseProgress = {
  [phase: string]: {
    playersReady: string[];
    completed: boolean;
  }
};

export interface PhaseProgressProps {
  gameMode: 'singleplayer' | 'multiplayer' | null;
  humanPlayerCount: number;
}

export interface PhaseProgressInfo {
  playersReady: string[];
  completed: boolean;
  completedCount: number;
  totalCount: number;
  percentage: number;
  hasStartedCountdown: boolean;
}
