
import { useGameSession } from './useGameSession';
import { useGameWeek } from './useGameWeek';
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
    gameId: gameSession.gameId,
    isHost: gameSession.isHost,
    playerName: gameSession.playerName,
    setPlayerName: gameSession.setPlayerName,
    gameState: gameSession.gameState,
    createGame: gameSession.createGame,
    joinGame: gameSession.joinGame,
    startGame: gameSession.startGame,
    endGame: gameSession.endGame,
    resetGame: gameSession.resetGame,
    toast: gameSession.toast,
    
    // Week management
    currentWeek: gameWeek.currentWeek,
    setCurrentWeek: gameWeek.setCurrentWeek,
    
    // Phase progress tracking
    phaseProgress,
    phaseCountdown,
    markPhaseProgress,
    getPhaseProgress,
    startPhaseCountdown,
    clearPhaseProgress
  };
}
