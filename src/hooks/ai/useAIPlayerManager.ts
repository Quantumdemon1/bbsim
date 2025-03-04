
import { useAIPlayerManager as useAIPlayerManagerImpl } from './player-manager';

/**
 * Hook to manage AI player behavior and decision-making
 * Re-exported from the implementation for backward compatibility
 */
export function useAIPlayerManager(players: any) {
  return useAIPlayerManagerImpl(players);
}
