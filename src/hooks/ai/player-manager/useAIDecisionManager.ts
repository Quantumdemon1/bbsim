
import { PlayerData } from '@/components/PlayerProfileTypes';
import { AIMemoryEntry, AIPlayerDecision } from '../types';
import { makeRuleBasedDecision } from '../decision-making/ruleBasedDecisions';
import { generateLLMDecision } from '../decision-making/llmDecisions';

/**
 * Hook to manage AI player decision-making
 */
export function useAIDecisionManager(
  isUsingLLM: boolean, 
  setIsThinking: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  addMemoryEntry: (playerId: string, entry: AIMemoryEntry) => void,
  getPlayerMemory: (playerId: string) => AIMemoryEntry[]
) {
  /**
   * Make a strategic decision for an AI player based on their personality and memory
   */
  const makeAIDecision = async (
    playerId: string, 
    decisionType: 'nominate' | 'vote' | 'veto' | 'alliance',
    options: string[],
    gameState: any,
    players: PlayerData[]
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
    const memory = getPlayerMemory(playerId);
    
    try {
      // If LLM decisions are enabled, use OpenAI to generate a decision
      if (isUsingLLM) {
        try {
          const decision = await generateLLMDecision(player, decisionType, options, players, memory);
          // Add decision to memory
          await addMemoryEntry(playerId, {
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
          // Fall back to rule-based decision making if LLM fails
        }
      }
      
      // Rule-based decision making
      const decision = makeRuleBasedDecision(player, decisionType, options, players, memory);
      
      // Add decision to memory
      await addMemoryEntry(playerId, {
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

  return { makeAIDecision };
}
