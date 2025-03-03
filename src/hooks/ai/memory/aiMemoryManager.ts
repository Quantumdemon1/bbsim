import { useState } from 'react';
import { AIMemoryEntry } from '../types';

/**
 * Hook to manage AI player memory
 */
export function useAIMemoryManager() {
  // Store AI player memory (game events, interactions, etc.)
  const [aiMemory, setAIMemory] = useState<Record<string, AIMemoryEntry[]>>({});
  
  /**
   * Add a memory entry for an AI player
   */
  const addMemoryEntry = (playerId: string, entry: AIMemoryEntry) => {
    setAIMemory(prev => {
      const playerMemory = prev[playerId] || [];
      // Keep memory buffer limited to most recent events
      const updatedMemory = [...playerMemory, entry].slice(-20);
      
      return {
        ...prev,
        [playerId]: updatedMemory
      };
    });
  };
  
  /**
   * Clear all AI memory (used when starting a new game)
   */
  const clearAIMemory = () => {
    setAIMemory({});
  };
  
  /**
   * Get memory for a specific player
   */
  const getPlayerMemory = (playerId: string): AIMemoryEntry[] => {
    return aiMemory[playerId] || [];
  };
  
  return {
    aiMemory,
    addMemoryEntry,
    clearAIMemory,
    getPlayerMemory
  };
}
