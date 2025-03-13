import { useState, useEffect } from 'react';
import { AIMemoryEntry } from '../types';
import { AIPlayerService } from '../aiPlayerService';
import { sortMemoriesByImportance } from './memoryUtils';
import { getDefaultEmotion } from './memoryUtils';

/**
 * Core hook for AI memory management
 */
export function useAIMemoryCore() {
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
      // Set timestamp to current time if not provided
      const memoryEntry = {
        ...entry,
        player_id: playerId,
        timestamp: entry.timestamp || new Date().toISOString(),
        // Default emotion if not provided
        emotion: entry.emotion || getDefaultEmotion(entry.impact),
        // Default decay factor based on importance (important memories decay slower)
        decayFactor: entry.decayFactor || (entry.importance / 5)
      };
      
      // Add to local state
      setAIMemory(prev => {
        const playerMemory = prev[playerId] || [];
        // Keep memory buffer with weighting by importance
        const updatedMemory = [...playerMemory, memoryEntry];
        
        // Sort memories by importance and recency
        const sortedMemory = sortMemoriesByImportance(updatedMemory);
        
        // Limit to 30 most important memories (increased from 20)
        const trimmedMemory = sortedMemory.slice(0, 30);
        
        return {
          ...prev,
          [playerId]: trimmedMemory
        };
      });
      
      // Persist to database
      await AIPlayerService.addMemoryEntry(memoryEntry);
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

  return {
    aiMemory,
    setAIMemory,
    addMemoryEntry,
    clearAIMemory
  };
}

/**
 * Get default emotion based on impact
 */
const getDefaultEmotion = (impact: 'positive' | 'negative' | 'neutral'): string => {
  switch (impact) {
    case 'positive':
      return 'happy';
    case 'negative':
      return 'upset';
    case 'neutral':
    default:
      return 'neutral';
  }
};
