
import { AIMemoryEntry } from '../types';
import { applyMemoryDecay } from './memoryUtils';

/**
 * Get memory for a specific player with decay applied
 */
export const getPlayerMemory = (
  aiMemory: Record<string, AIMemoryEntry[]>,
  playerId: string
): AIMemoryEntry[] => {
  const memories = aiMemory[playerId] || [];
  return applyMemoryDecay(memories);
};

/**
 * Get memories related to a specific player relationship
 */
export const getRelationshipMemories = (
  aiMemory: Record<string, AIMemoryEntry[]>,
  playerId: string, 
  relatedPlayerId: string
): AIMemoryEntry[] => {
  const memories = aiMemory[playerId] || [];
  return applyMemoryDecay(
    memories.filter(memory => memory.relatedPlayerId === relatedPlayerId)
  );
};

/**
 * Get memories that could be triggered by current game context
 */
export const getTriggeredMemories = (
  aiMemory: Record<string, AIMemoryEntry[]>,
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
