import { useState, useEffect } from 'react';
import { AIMemoryEntry } from '../types';
import { AIPlayerService } from '../aiPlayerService';

/**
 * Hook to manage AI player memory
 */
export function useAIMemoryManager() {
  // Store AI player memory (game events, interactions, etc.)
  const [aiMemory, setAIMemory] = useState<Record<string, AIMemoryEntry[]>>({});
  
  // Load initial memory from Supabase
  useEffect(() => {
    const loadMemoryFromDB = async () => {
      try {
        // Get all AI players
        const aiProfiles = await AIPlayerService.getAllProfiles();
        
        // Initialize memory object
        const initialMemory: Record<string, AIMemoryEntry[]> = {};
        
        // Load memory for each AI player
        for (const profile of aiProfiles) {
          const playerMemory = await AIPlayerService.getPlayerMemory(profile.id);
          initialMemory[profile.id] = playerMemory;
        }
        
        setAIMemory(initialMemory);
      } catch (error) {
        console.error("Error loading AI memory from database:", error);
      }
    };
    
    loadMemoryFromDB();
  }, []);
  
  /**
   * Add a memory entry for an AI player
   */
  const addMemoryEntry = async (playerId: string, entry: AIMemoryEntry) => {
    try {
      // Add to local state
      setAIMemory(prev => {
        const playerMemory = prev[playerId] || [];
        // Keep memory buffer limited to most recent events
        const updatedMemory = [...playerMemory, entry].slice(-20);
        
        return {
          ...prev,
          [playerId]: updatedMemory
        };
      });
      
      // Persist to database
      await AIPlayerService.addMemoryEntry({
        ...entry,
        player_id: playerId
      } as AIMemoryEntry);
    } catch (error) {
      console.error("Error adding memory entry:", error);
    }
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
