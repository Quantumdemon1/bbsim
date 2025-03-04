
import { useState, useEffect } from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useToast } from '@/components/ui/use-toast';
import { useAIMemoryManager } from '../memory/aiMemoryManager';

/**
 * Core hook for AI player management - handles state and initialization
 */
export function useAIPlayerCore(players: PlayerData[]) {
  const memoryManager = useAIMemoryManager();
  const [isUsingLLM, setIsUsingLLM] = useState<boolean>(true); // Default to true for better experience
  const [isThinking, setIsThinking] = useState<Record<string, boolean>>({});
  const [botEmotions, setBotEmotions] = useState<Record<string, string>>({});
  const { toast } = useToast();
  
  // Initialize AI memory for new players
  useEffect(() => {
    const aiPlayers = players.filter(p => !p.isHuman && !p.isAdmin);
    
    // Initialize memory for AI players that don't have it yet
    const newMemory = { ...memoryManager.aiMemory };
    let memoryUpdated = false;
    
    aiPlayers.forEach(player => {
      if (!newMemory[player.id]) {
        newMemory[player.id] = [];
        memoryUpdated = true;
      }
    });
    
    if (memoryUpdated) {
      // Handle memory initialization if needed
    }
  }, [players]);
  
  /**
   * Update bot's emotional state
   */
  const updateBotEmotion = (playerId: string, emotion: string) => {
    setBotEmotions(prev => ({
      ...prev,
      [playerId]: emotion
    }));
  };
  
  /**
   * Toggle LLM-based decision making
   */
  const toggleLLMDecisionMaking = () => {
    setIsUsingLLM(prev => !prev);
    toast({
      title: isUsingLLM ? "LLM Decision Making Disabled" : "LLM Decision Making Enabled",
      description: isUsingLLM 
        ? "AI players will now use rule-based decisions" 
        : "AI players will now use LLM for more realistic decisions",
    });
  };
  
  return {
    memoryManager,
    isUsingLLM,
    setIsThinking,
    isThinking,
    botEmotions,
    updateBotEmotion,
    toggleLLMDecisionMaking
  };
}
