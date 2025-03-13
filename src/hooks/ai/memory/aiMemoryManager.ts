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
  
  /**
   * Get memory for a specific player with decay applied
   */
  const getPlayerMemory = (playerId: string): AIMemoryEntry[] => {
    const memories = aiMemory[playerId] || [];
    return applyMemoryDecay(memories);
  };
  
  /**
   * Get memories related to a specific player relationship
   */
  const getRelationshipMemories = (playerId: string, relatedPlayerId: string): AIMemoryEntry[] => {
    const memories = aiMemory[playerId] || [];
    return applyMemoryDecay(
      memories.filter(memory => memory.relatedPlayerId === relatedPlayerId)
    );
  };
  
  /**
   * Get memories that could be triggered by current game context
   */
  const getTriggeredMemories = (
    playerId: string, 
    context: { 
      phase?: string, 
      relatedPlayerId?: string,
      type?: string 
    }
  ): AIMemoryEntry[] => {
    const memories = aiMemory[playerId] || [];
    const decayedMemories = applyMemoryDecay(memories);
    
    // Filter memories relevant to current context
    return decayedMemories.filter(memory => {
      // Match by phase (e.g., nomination memories during nomination phase)
      if (context.phase && memory.type.includes(context.phase.toLowerCase())) {
        return true;
      }
      
      // Match by related player
      if (context.relatedPlayerId && memory.relatedPlayerId === context.relatedPlayerId) {
        return true;
      }
      
      // Match by memory type
      if (context.type && memory.type === context.type) {
        return true;
      }
      
      return false;
    }).slice(0, 3); // Limit to 3 most relevant
  };
  
  /**
   * Apply decay factor to memories based on age and importance
   */
  const applyMemoryDecay = (memories: AIMemoryEntry[]): AIMemoryEntry[] => {
    const currentTime = new Date().getTime();
    
    return memories.map(memory => {
      // Convert timestamp to number if it's a string
      const timestamp = typeof memory.timestamp === 'string' 
        ? new Date(memory.timestamp).getTime() 
        : memory.timestamp;
      
      // Calculate age in days
      const ageInDays = (currentTime - Number(timestamp)) / (1000 * 60 * 60 * 24);
      
      // Calculate decay based on age and decayFactor
      // Important memories (high decayFactor) decay more slowly
      const decayFactor = memory.decayFactor || 0.5;
      const effectiveImportance = Math.max(
        1, 
        memory.importance * Math.pow(decayFactor, ageInDays / 7) // Decay per week
      );
      
      return {
        ...memory,
        importance: effectiveImportance
      };
    });
  };
  
  /**
   * Sort memories by their weighted importance
   */
  const sortMemoriesByImportance = (memories: AIMemoryEntry[]): AIMemoryEntry[] => {
    return [...memories].sort((a, b) => {
      // Calculate a weight based on importance and recency
      const aTimestamp = typeof a.timestamp === 'string' 
        ? new Date(a.timestamp).getTime() 
        : a.timestamp;
        
      const bTimestamp = typeof b.timestamp === 'string' 
        ? new Date(b.timestamp).getTime() 
        : b.timestamp;
      
      const aRecency = Number(aTimestamp);
      const bRecency = Number(bTimestamp);
      
      // Weight formula: importance * 2 + recency factor
      // This prioritizes important memories but also keeps recent ones
      const aWeight = (a.importance * 2) + (aRecency / Date.now());
      const bWeight = (b.importance * 2) + (bRecency / Date.now());
      
      return bWeight - aWeight; // Sort descending
    });
  };
  
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
  
  return {
    aiMemory,
    addMemoryEntry,
    clearAIMemory,
    getPlayerMemory,
    getRelationshipMemories,
    getTriggeredMemories
  };
}
