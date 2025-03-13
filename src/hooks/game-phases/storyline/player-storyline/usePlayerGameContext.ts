
import { useGameContext } from '@/hooks/useGameContext';
import { GamePhase } from '@/types/gameTypes';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { Alliance } from '@/contexts/types';

/**
 * Hook to extract and type-cast game context properties needed for player storyline
 */
export function usePlayerGameContext() {
  // Get game context and explicitly type it to include required properties
  const gameContext = useGameContext();
  
  // Extract common properties from gameContext
  const { 
    players, 
    currentWeek,
    addMemoryEntry,
    alliances
  } = gameContext;
  
  // Safely extract properties that might not be directly available in all useGameContext implementations
  // by using type assertion to a more specific type that includes these properties
  const gamePhaseContext = gameContext as unknown as {
    currentPhase: GamePhase;
    dayCount: number;
    actionsRemaining: number;
    useAction: () => boolean;
    nominees: string[];
    hoh: string | null;
    veto: string | null;
  } & typeof gameContext;

  const { 
    currentPhase, 
    dayCount, 
    actionsRemaining, 
    useAction,
    nominees,
    hoh,
    veto
  } = gamePhaseContext;
  
  return {
    // Game state
    currentPhase,
    dayCount,
    actionsRemaining,
    useAction,
    
    // Player data
    players,
    currentWeek,
    nominees: nominees || [],
    hoh: hoh || null,
    veto: veto || null,
    
    // Functions
    addMemoryEntry,
    
    // Relationships
    alliances: alliances || []
  };
}
