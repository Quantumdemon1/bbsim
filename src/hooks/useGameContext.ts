
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
    
    // Ensure notifications and saveGame are properly exposed with appropriate fallbacks
    notifications: (gameState.notifications || []) as GameNotification[],
    clearNotifications: gameState.clearNotifications || (() => {}),
    markNotificationAsRead: gameState.markNotificationAsRead || (() => {}),
    saveGame: gameState.saveCurrentGame || (() => Promise.resolve()),
    savedGames: gameState.savedGames || []
  };
}
