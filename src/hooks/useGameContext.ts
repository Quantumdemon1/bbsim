
import { usePlayerManagementContext } from '../hooks/gameContext/usePlayerManagementContext';
import { useGameStateContext } from '../hooks/gameContext/useGameStateContext';
import { useAllianceContext } from '../hooks/gameContext/useAllianceContext';
import { usePowerupContext } from '../hooks/gameContext/usePowerupContext';
import { usePlayerAuthContext } from '../hooks/gameContext/usePlayerAuthContext';
import { useAIPlayerContext } from '../hooks/gameContext/useAIPlayerContext';
import { GameNotification } from '@/types/gameTypes';
import { adaptGameNotificationToAuthNotification, isGameNotificationArray } from '@/types/notificationTypes';

/**
 * Central hook to access all game-related context
 * Combines multiple specialized context hooks into a single API
 */
export function useGameContext() {
  // Get access to all specialized contexts
  const playerManager = usePlayerManagementContext();
  const gameState = useGameStateContext();
  const alliance = useAllianceContext();
  const powerup = usePowerupContext();
  const playerAuth = usePlayerAuthContext();
  const aiPlayer = useAIPlayerContext();
  
  // Create fallback functions for common operations that might not be available in all contexts
  const handleNextWeek = () => {
    console.log("Default next week handler");
  };
  
  const handlePlayerSelect = (playerId: string) => {
    console.log("Default player select handler:", playerId);
    // This is a fallback implementation, actual implementation should be provided by context
  };
  
  const adminTakeControl = (phase?: string) => {
    console.log("Admin taking control", phase);
    // This is a fallback implementation
    if (phase && gameState.markPhaseProgress) {
      // Instead of directly setting the phase, use the phase progress tracking
      // which is available in the gameState context
      gameState.clearPhaseProgress('*');
      
      // If there's a way to navigate to a specific phase in the game state context, use it
      if (gameState.adminTakeControl) {
        gameState.adminTakeControl(phase);
      }
    }
  };
  
  // Combine all contexts into a single API
  return {
    // Game State
    ...gameState,
    
    // Player Management
    ...playerManager,
    
    // Alliance Management
    ...alliance,
    
    // Powerup Management
    ...powerup,
    
    // Player Authentication (including admin properties)
    ...playerAuth,
    
    // AI Player Management
    ...aiPlayer,
    
    // Ensure core functions are properly exposed with appropriate fallbacks
    notifications: (gameState.notifications || []) as GameNotification[],
    clearNotifications: gameState.clearNotifications || (() => {}),
    markNotificationAsRead: gameState.markNotificationAsRead || (() => {}),
    saveGame: gameState.saveCurrentGame || (() => Promise.resolve()),
    savedGames: gameState.savedGames || [],
    
    // Make sure these handlers are always available
    handleNextWeek,
    handlePlayerSelect,
    adminTakeControl,
  };
}
