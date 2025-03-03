
import { useGameStateContext as useGameState } from '../../contexts/GameStateContext';

export function useGameStateContext() {
  const gameState = useGameState();
  
  return {
    // Game State
    gameId: gameState.gameId,
    isHost: gameState.isHost,
    playerName: gameState.playerName,
    setPlayerName: gameState.setPlayerName,
    gameState: gameState.gameState,
    currentWeek: gameState.currentWeek,
    setCurrentWeek: gameState.setCurrentWeek,
    createGame: gameState.createGame,
    joinGame: gameState.joinGame,
    startGame: gameState.startGame,
    endGame: gameState.endGame,
    resetGame: gameState.resetGame,
    
    // Phase progress tracking
    phaseProgress: gameState.phaseProgress,
    phaseCountdown: gameState.phaseCountdown,
    markPhaseProgress: gameState.markPhaseProgress,
    getPhaseProgress: gameState.getPhaseProgress,
    startPhaseCountdown: gameState.startPhaseCountdown,
    clearPhaseProgress: gameState.clearPhaseProgress,
    
    // Additional Game State properties
    showChat: gameState.showChat,
    setShowChat: gameState.setShowChat,
    gameMode: gameState.gameMode,
    humanPlayers: gameState.humanPlayers,
    countdownTimer: gameState.countdownTimer,
    createSinglePlayerGame: gameState.createSinglePlayerGame,
    createMultiplayerGame: gameState.createMultiplayerGame,
    joinMultiplayerGame: gameState.joinMultiplayerGame,
    
    // Admin control
    adminTakeControl: gameState.adminTakeControl,
    isAdminControl: gameState.isAdminControl,
    
    // Game state persistence - ensure consistent naming
    saveGame: gameState.saveCurrentGame, // Alias saveCurrentGame as saveGame
    loadGame: gameState.loadGame,
    savedGames: gameState.savedGames,
    deleteSavedGame: gameState.deleteSavedGame,
    isLoadingSave: gameState.isLoadingSave
  };
}
