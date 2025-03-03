
import { usePlayerManagerContext } from './PlayerManagerContext';
import { useGameStateContext } from './GameStateContext';
import { useAllianceContext } from './AllianceContext';
import { usePowerupContext } from './PowerupContext';
import { usePlayerAuthContext } from './PlayerAuthContext';
import { useAIPlayerContext } from './AIPlayerContext';

export const useGameContext = () => {
  const playerManager = usePlayerManagerContext();
  const gameState = useGameStateContext();
  const alliance = useAllianceContext();
  const powerup = usePowerupContext();
  const playerAuth = usePlayerAuthContext();
  const aiPlayer = useAIPlayerContext();

  return {
    // Player Manager
    players: playerManager.players,
    setPlayers: playerManager.setPlayers,
    updatePlayerAttributes: playerManager.updatePlayerAttributes,
    updatePlayerRelationships: playerManager.updatePlayerRelationships,
    
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
    
    // Alliance
    alliances: alliance.alliances,
    setAlliances: alliance.setAlliances,
    createAlliance: alliance.createAlliance,
    addToAlliance: alliance.addToAlliance,
    removeFromAlliance: alliance.removeFromAlliance,
    
    // Powerup
    awardPowerup: powerup.awardPowerup,
    usePowerup: powerup.usePowerup,
    
    // Auth
    isAuthenticated: playerAuth.isAuthenticated,
    currentPlayer: playerAuth.currentPlayer,
    isGuest: playerAuth.isGuest,
    isAdmin: playerAuth.isAdmin,
    login: playerAuth.login,
    register: playerAuth.register,
    loginAsGuest: playerAuth.loginAsGuest,
    loginAsAdmin: playerAuth.loginAsAdmin,
    logout: playerAuth.logout,
    updateProfile: playerAuth.updateProfile,
    updateSettings: playerAuth.updateSettings,
    addFriend: playerAuth.addFriend,
    removeFriend: playerAuth.removeFriend,
    addNotification: playerAuth.addNotification,
    markNotificationAsRead: playerAuth.markNotificationAsRead,
    clearNotifications: playerAuth.clearNotifications,
    friends: playerAuth.friends,
    notifications: playerAuth.notifications,
    settings: playerAuth.settings,
    
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
    
    // AI Player
    makeAIDecision: aiPlayer.makeAIDecision,
    generateAIDialogue: aiPlayer.generateAIDialogue,
    addAIMemoryEntry: aiPlayer.addMemoryEntry,
    clearAIMemory: aiPlayer.clearAIMemory,
    getPlayerMemory: aiPlayer.getPlayerMemory,
    isUsingLLM: aiPlayer.isUsingLLM,
    toggleLLMDecisionMaking: aiPlayer.toggleLLMDecisionMaking,
    isThinking: aiPlayer.isThinking,
    botEmotions: aiPlayer.botEmotions,
    updateBotEmotion: aiPlayer.updateBotEmotion
  };
}
