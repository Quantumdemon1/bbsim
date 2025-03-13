import { AIMemoryEntry } from '../types';

/**
 * Sort memories by their weighted importance
 */
export const sortMemoriesByImportance = (memories: AIMemoryEntry[]): AIMemoryEntry[] => {
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
 * Apply decay factor to memories based on age and importance
 */
export const applyMemoryDecay = (memories: AIMemoryEntry[]): AIMemoryEntry[] => {
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
 * Get default emotion based on impact
 */
export const getDefaultEmotion = (impact: 'positive' | 'negative' | 'neutral'): string => {
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
