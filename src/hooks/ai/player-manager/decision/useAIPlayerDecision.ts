
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
  addMemoryEntry: (playerId: string, entry: AIMemoryEntry) => void
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
      let decision: AIPlayerDecision;

      if (isUsingLLM) {
        try {
          decision = await generateLLMDecision(player, decisionType, options, players, []);
        } catch (error) {
          console.error("Error generating LLM decision:", error);
          decision = makeRuleBasedDecision(player, decisionType, options, players, []);
        }
      } else {
        decision = makeRuleBasedDecision(player, decisionType, options, players, []);
      }

      // Add decision to memory
      await addMemoryEntry(playerId, {
        type: 'player_decision',
        week: gameState.currentWeek || 1,
        description: `Made a decision: ${decision.reasoning}`,
        impact: 'neutral',
        importance: 3,
        timestamp: new Date().toISOString()
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
