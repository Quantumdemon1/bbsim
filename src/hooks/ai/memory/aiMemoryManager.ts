
import { AIMemoryEntry } from '../types';
import { useAIMemoryCore } from './useAIMemoryCore';
import { getPlayerMemory, getRelationshipMemories, getTriggeredMemories } from './memoryRetrieval';

/**
 * Hook to manage AI player memory
 */
export function useAIMemoryManager() {
  const { aiMemory, setAIMemory, addMemoryEntry, clearAIMemory } = useAIMemoryCore();
  
  return {
    aiMemory,
    addMemoryEntry,
    clearAIMemory,
    getPlayerMemory: (playerId: string) => getPlayerMemory(aiMemory, playerId),
    getRelationshipMemories: (playerId: string, relatedPlayerId: string) => 
      getRelationshipMemories(aiMemory, playerId, relatedPlayerId),
    getTriggeredMemories: (playerId: string, context: any) => 
      getTriggeredMemories(aiMemory, playerId, context)
  };
}
