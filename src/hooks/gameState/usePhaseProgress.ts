
import { usePhaseTracker } from './phase-progress/usePhaseTracker';
import { usePhaseCountdown } from './phase-progress/usePhaseCountdown';
import { PhaseProgressProps, PhaseProgressInfo } from './types/phaseProgressTypes';

export function usePhaseProgress({ gameMode, humanPlayerCount }: PhaseProgressProps) {
  const { 
    phaseProgress, 
    markPhaseProgress: trackPhaseProgress, 
    getPhaseProgress: getTrackProgress, 
    clearPhaseProgress: clearTrackProgress 
  } = usePhaseTracker();
  
  const { 
    phaseCountdown, 
    startPhaseCountdown, 
    clearCountdown 
  } = usePhaseCountdown();
  
  const markPhaseProgress = (phase: string, playerId: string) => {
    trackPhaseProgress(phase, playerId, gameMode, humanPlayerCount);
    
    // Start countdown if enough players are ready and we're in multiplayer mode
    const progressData = getTrackProgress(phase, humanPlayerCount);
    if (progressData.completed && gameMode === 'multiplayer' && phaseCountdown === null) {
      startPhaseCountdown(30);
    }
  };
  
  const getPhaseProgress = (phase: string): PhaseProgressInfo => {
    const progressData = getTrackProgress(phase, humanPlayerCount);
    
    return {
      ...progressData,
      hasStartedCountdown: phaseCountdown !== null && progressData.completed
    };
  };
  
  const clearPhaseProgress = (phase: string) => {
    clearTrackProgress(phase);
    clearCountdown();
  };

  return {
    phaseProgress,
    phaseCountdown,
    markPhaseProgress,
    getPhaseProgress,
    startPhaseCountdown,
    clearPhaseProgress
  };
}
