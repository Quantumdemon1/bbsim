
import { usePlayerManagerContext } from '../../contexts/PlayerManagerContext';

export function usePlayerManagementContext() {
  const playerManager = usePlayerManagerContext();
  
  return {
    // Player Management
    players: playerManager.players,
    setPlayers: playerManager.setPlayers,
    updatePlayerAttributes: playerManager.updatePlayerAttributes,
    updatePlayerRelationships: playerManager.updatePlayerRelationships,
  };
}
