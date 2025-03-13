
import { useState } from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { AIMemoryEntry, AIPlayerDecision } from '../types';
import { useAIPlayerCore } from './useAIPlayerCore';
import { useAIDecisionManager } from './useAIDecisionManager';
import { useAIDialogueManager } from './useAIDialogueManager';

/**
 * Main hook for AI player functionality that composes smaller specialized hooks
 */
export function useAIPlayerManager(players: PlayerData[]) {
  const core = useAIPlayerCore(players);
  const decisionManager = useAIDecisionManager(
    core.isUsingLLM, 
    core.setIsThinking, 
    core.memoryManager.addMemoryEntry,
    core.memoryManager.getPlayerMemory,
    core.memoryManager.getTriggeredMemories
  );
  const dialogueManager = useAIDialogueManager(
    core.isUsingLLM,
    core.setIsThinking,
    core.updateBotEmotion,
    core.memoryManager.getPlayerMemory,
    core.memoryManager.getTriggeredMemories
  );
  
  /**
   * Make a strategic decision for an AI player
   */
  const makeAIDecision = async (
    playerId: string, 
    decisionType: 'nominate' | 'vote' | 'veto' | 'alliance',
    options: string[],
    gameState: any
  ): Promise<AIPlayerDecision> => {
    return decisionManager.makeAIDecision(playerId, decisionType, options, gameState, players);
  };
  
  /**
   * Generate dialogue for an AI player
   */
  const generateAIDialogue = async (
    playerId: string,
    situation: 'nomination' | 'veto' | 'eviction' | 'hoh' | 'general' | 'reaction',
    context: any
  ): Promise<string> => {
    return dialogueManager.generateAIDialogue(playerId, situation, context, players);
  };
  
  return {
    aiMemory: core.memoryManager.aiMemory,
    addMemoryEntry: core.memoryManager.addMemoryEntry,
    clearAIMemory: core.memoryManager.clearAIMemory,
    getPlayerMemory: core.memoryManager.getPlayerMemory,
    getRelationshipMemories: core.memoryManager.getRelationshipMemories,
    getTriggeredMemories: core.memoryManager.getTriggeredMemories,
    makeAIDecision,
    generateAIDialogue,
    isUsingLLM: core.isUsingLLM,
    toggleLLMDecisionMaking: core.toggleLLMDecisionMaking,
    isThinking: core.isThinking,
    botEmotions: core.botEmotions,
    updateBotEmotion: core.updateBotEmotion
  };
}
