
import { useGameStateContext } from './gameContext/useGameStateContext';
import { usePlayerManagementContext } from './gameContext/usePlayerManagementContext';
import { useAllianceContext } from './gameContext/useAllianceContext';
import { usePowerupContext } from './gameContext/usePowerupContext';
import { usePlayerAuthContext } from './gameContext/usePlayerAuthContext';
import { useAIPlayerContext } from './gameContext/useAIPlayerContext';

/**
 * Central hook to access all game-related context
 * Combines multiple specialized context hooks into a single API
 */
export function useGameContext() {
  // Get access to all specialized contexts
  const gameState = useGameStateContext();
  const playerManager = usePlayerManagementContext();
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
    ...aiPlayer
  };
}
