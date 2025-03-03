import { useState, useEffect } from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { AIMemoryEntry, AIPlayerDecision } from './types';
import { useToast } from '@/components/ui/use-toast';
import { useAIMemoryManager } from './memory/aiMemoryManager';
import { makeRuleBasedDecision } from './decision-making/ruleBasedDecisions';
import { generateLLMDecision } from './decision-making/llmDecisions';
import { generateTemplateDialogue } from './dialogue/aiDialogue';
import { generateLLMDialogue } from './dialogue/llmDialogue';

/**
 * Hook to manage AI player behavior and decision-making
 */
export function useAIPlayerManager(players: PlayerData[]) {
  const memoryManager = useAIMemoryManager();
  const [isUsingLLM, setIsUsingLLM] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<Record<string, boolean>>({});
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
  
  /**
   * Make a strategic decision for an AI player based on their personality and memory
   */
  const makeAIDecision = async (
    playerId: string, 
    decisionType: 'nominate' | 'vote' | 'veto' | 'alliance',
    options: string[],
    gameState: any
  ): Promise<AIPlayerDecision> => {
    const player = players.find(p => p.id === playerId);
    if (!player) {
      console.error(`AI player ${playerId} not found`);
      return { 
        decision: options[0] || null,
        reasoning: "Default decision due to player not found"
      };
    }
    
    // Set thinking state for this player
    setIsThinking(prev => ({ ...prev, [playerId]: true }));
    
    // Get player memory
    const memory = memoryManager.getPlayerMemory(playerId);
    
    try {
      // If LLM decisions are enabled, use OpenAI to generate a decision
      if (isUsingLLM) {
        try {
          const decision = await generateLLMDecision(player, decisionType, options, players, memory);
          // Add decision to memory
          await memoryManager.addMemoryEntry(playerId, {
            type: 'strategy_discussion',
            week: gameState.currentWeek || 1,
            description: `Made a decision: ${decision.reasoning}`,
            impact: 'neutral',
            importance: 3,
            timestamp: new Date().toISOString()
          });
          
          setIsThinking(prev => ({ ...prev, [playerId]: false }));
          return decision;
        } catch (error) {
          console.error("Error generating LLM decision:", error);
          toast({
            title: "LLM Decision Failed",
            description: "Falling back to rule-based decisions.",
            variant: "destructive"
          });
          // Fall back to rule-based decision making if LLM fails
        }
      }
      
      // Rule-based decision making
      const decision = makeRuleBasedDecision(player, decisionType, options, players, memory);
      
      // Add decision to memory
      await memoryManager.addMemoryEntry(playerId, {
        type: 'strategy_discussion',
        week: gameState.currentWeek || 1,
        description: `Made a decision: ${decision.reasoning}`,
        impact: 'neutral',
        importance: 2,
        timestamp: new Date().toISOString()
      });
      
      setIsThinking(prev => ({ ...prev, [playerId]: false }));
      return decision;
    } catch (error) {
      console.error("Error in makeAIDecision:", error);
      setIsThinking(prev => ({ ...prev, [playerId]: false }));
      
      // Fallback to basic decision
      return { 
        decision: options[0] || null,
        reasoning: "Default decision due to error in processing"
      };
    }
  };
  
  /**
   * Generate dialogue for an AI player based on their personality and current situation
   */
  const generateAIDialogue = async (
    playerId: string,
    situation: 'nomination' | 'veto' | 'eviction' | 'hoh' | 'general' | 'reaction',
    context: any
  ): Promise<string> => {
    const player = players.find(p => p.id === playerId);
    if (!player) return "I have nothing to say.";
    
    // Set thinking state for this player
    setIsThinking(prev => ({ ...prev, [playerId]: true }));
    
    try {
      // If LLM is enabled, generate more natural dialogue with OpenAI
      if (isUsingLLM) {
        const memory = memoryManager.getPlayerMemory(playerId);
        const recentMemory = memory.slice(-3).map(m => m.description).join("; ");
        
        try {
          const dialogue = await generateLLMDialogue(player, situation, context, recentMemory);
          setIsThinking(prev => ({ ...prev, [playerId]: false }));
          return dialogue;
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
  
  return {
    aiMemory: memoryManager.aiMemory,
    addMemoryEntry: memoryManager.addMemoryEntry,
    clearAIMemory: memoryManager.clearAIMemory,
    getPlayerMemory: memoryManager.getPlayerMemory,
    makeAIDecision,
    generateAIDialogue,
    isUsingLLM,
    toggleLLMDecisionMaking,
    isThinking
  };
}
