
import { useState } from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { AIPlayerDecision, AIMemoryEntry } from '../../types';
import { generateLLMDecision } from '../../decision-making/llmDecisions';
import { makeRuleBasedDecision } from '../../decision-making/ruleBasedDecisions';

/**
 * Core decision-making hook for AI players
 */
export function useAIPlayerDecision(
  isUsingLLM: boolean,
  setIsThinking: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  addMemoryEntry: (playerId: string, entry: AIMemoryEntry) => void,
  getPlayerMemory: (playerId: string) => AIMemoryEntry[],
  getTriggeredMemories?: (playerId: string, context: any) => AIMemoryEntry[]
) {
  /**
   * Make a strategic decision for an AI player
   */
  const makeDecision = async (
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

    try {
      // Get memories relevant to this decision
      const memories = getPlayerMemory(playerId);
      
      // Get triggered memories specific to this context
      const contextMemories = getTriggeredMemories 
        ? getTriggeredMemories(playerId, { 
            phase: decisionType, 
            type: decisionType
          })
        : [];
        
      // Combine all memories, focusing on ones relevant to this decision
      const relevantMemories = [
        ...contextMemories,
        ...memories.filter(m => options.includes(m.relatedPlayerId || '')).slice(0, 5)
      ];

      let decision: AIPlayerDecision;

      if (isUsingLLM) {
        try {
          decision = await generateLLMDecision(player, decisionType, options, players, relevantMemories);
        } catch (error) {
          console.error("Error generating LLM decision:", error);
          decision = makeRuleBasedDecision(player, decisionType, options, players, relevantMemories);
        }
      } else {
        decision = makeRuleBasedDecision(player, decisionType, options, players, relevantMemories);
      }

      // Add decision to memory with emotional context
      const emotionalImpact = 
        decisionType === 'nominate' || decisionType === 'vote' 
          ? 'negative'
          : decisionType === 'alliance' 
            ? 'positive' 
            : 'neutral';
            
      const emotion = 
        emotionalImpact === 'positive' 
          ? 'strategic' 
          : emotionalImpact === 'negative' 
            ? 'nervous' 
            : 'focused';

      await addMemoryEntry(playerId, {
        type: 'player_decision',
        week: gameState.currentWeek || 1,
        description: `Made a ${decisionType} decision: ${decision.reasoning}`,
        impact: emotionalImpact,
        importance: 4, // Decisions are important memories
        timestamp: new Date().toISOString(),
        emotion: emotion,
        decayFactor: 0.8 // Decisions decay slower than typical memories
      });

      setIsThinking(prev => ({ ...prev, [playerId]: false }));
      return decision;
    } catch (error) {
      console.error("Error in makeAIDecision:", error);
      setIsThinking(prev => ({ ...prev, [playerId]: false }));

      return {
        decision: options[0] || null,
        reasoning: "Default decision due to error in processing"
      };
    }
  };

  return { makeDecision };
}
