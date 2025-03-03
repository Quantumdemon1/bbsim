
import { usePlayerManagementContext } from '../hooks/gameContext/usePlayerManagementContext';
import { useGameStateContext } from '../hooks/gameContext/useGameStateContext';
import { useAllianceContext } from '../hooks/gameContext/useAllianceContext';
import { usePowerupContext } from '../hooks/gameContext/usePowerupContext';
import { usePlayerAuthContext } from '../hooks/gameContext/usePlayerAuthContext';
import { useAIPlayerContext } from '../hooks/gameContext/useAIPlayerContext';
import { GameNotification } from '@/types/gameTypes';

export const useGameContext = () => {
  const playerManager = usePlayerManagementContext();
  const gameState = useGameStateContext();
  const alliance = useAllianceContext();
  const powerup = usePowerupContext();
  const playerAuth = usePlayerAuthContext();
  const aiPlayer = useAIPlayerContext();

  return {
    // Player Manager
    ...playerManager,
    
    // Game State
    ...gameState,
    
    // Alliance
    ...alliance,
    
    // Powerup
    ...powerup,
    
    // Auth (including admin properties)
    ...playerAuth,
    
    // AI Player
    ...aiPlayer,
    
    // Make sure notifications and saveGame are consistently available with fallbacks
    notifications: gameState.notifications || [],
    clearNotifications: gameState.clearNotifications || (() => {}),
    markNotificationAsRead: gameState.markNotificationAsRead || (() => {}),
    saveGame: gameState.saveCurrentGame || (() => Promise.resolve()),
    savedGames: gameState.savedGames || []
  };
}
