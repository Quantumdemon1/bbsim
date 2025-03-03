
import { useGameSession } from './core/useGameSession';
import { useGameWeek } from './core/useGameWeek';
import { usePhaseProgress } from './usePhaseProgress';

export function useGameCore() {
  const gameSession = useGameSession();
  const gameWeek = useGameWeek();
  const { 
    phaseProgress, 
    phaseCountdown, 
    markPhaseProgress, 
    getPhaseProgress, 
    startPhaseCountdown, 
    clearPhaseProgress 
  } = usePhaseProgress({
    gameMode: null, // This will be set in GameStateContext
    humanPlayerCount: 0 // This will be set in GameStateContext
  });
  
  return {
    // Game session management
    ...gameSession,
    
    // Week management
    ...gameWeek,
    
    // Phase progress tracking
    phaseProgress,
    phaseCountdown,
    markPhaseProgress,
    getPhaseProgress,
    startPhaseCountdown,
    clearPhaseProgress
  };
}
