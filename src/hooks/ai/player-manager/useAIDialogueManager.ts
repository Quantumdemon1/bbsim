
import { PlayerData } from '@/components/PlayerProfileTypes';
import { generateTemplateDialogue } from '../dialogue/aiDialogue';
import { generateLLMDialogue } from '../dialogue/llmDialogue';
import { AIMemoryEntry } from '../types';

/**
 * Hook to manage AI player dialogue generation
 */
export function useAIDialogueManager(
  isUsingLLM: boolean,
  setIsThinking: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  updateBotEmotion: (playerId: string, emotion: string) => void,
  getPlayerMemory: (playerId: string) => any[],
  getTriggeredMemories?: (playerId: string, context: any) => AIMemoryEntry[]
) {
  /**
   * Generate dialogue for an AI player based on their personality and current situation
   */
  const generateAIDialogue = async (
    playerId: string,
    situation: 'nomination' | 'veto' | 'eviction' | 'hoh' | 'general' | 'reaction',
    context: any,
    players: PlayerData[]
  ): Promise<string> => {
    const player = players.find(p => p.id === playerId);
    if (!player) return "I have nothing to say.";
    
    // Set thinking state for this player
    setIsThinking(prev => ({ ...prev, [playerId]: true }));
    
    try {
      // If LLM is enabled, generate more natural dialogue with OpenAI
      if (isUsingLLM) {
        // Get basic memory
        const memory = getPlayerMemory(playerId);
        
        // Get context-specific triggered memories if available
        const triggeredMemories = getTriggeredMemories 
          ? getTriggeredMemories(playerId, {
              phase: situation,
              relatedPlayerId: context.targetPlayerId || context.playerId,
              type: situation
            })
          : [];
            
        // Combine memories, prioritizing triggered ones
        const allRelevantMemories = [...triggeredMemories, ...memory.slice(0, 3)];
        
        // Format memories for LLM context
        const recentMemory = allRelevantMemories
          .map(m => m.description)
          .join("; ");
        
        try {
          const result = await generateLLMDialogue(player, situation, context, recentMemory);
          setIsThinking(prev => ({ ...prev, [playerId]: false }));
          
          // Update the bot's emotion based on the result
          updateBotEmotion(playerId, result.emotion || 'neutral');
          
          return result.text;
        } catch (error) {
          console.error("Error using LLM dialogue:", error);
          // Fall back to template-based responses if LLM fails
          setIsThinking(prev => ({ ...prev, [playerId]: false }));
          return generateTemplateDialogue(player, situation, context);
        }
      }
      
      // Otherwise use template-based responses
      setIsThinking(prev => ({ ...prev, [playerId]: false }));
      return generateTemplateDialogue(player, situation, context);
    } catch (error) {
      console.error("Error in generateAIDialogue:", error);
      setIsThinking(prev => ({ ...prev, [playerId]: false }));
      return "I'm just focusing on my game right now.";
    }
  };

  return { generateAIDialogue };
}
