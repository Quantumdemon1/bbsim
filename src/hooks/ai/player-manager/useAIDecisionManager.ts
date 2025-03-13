
import { PlayerData } from '@/components/PlayerProfileTypes';
import { AIPlayerDecision, AIMemoryEntry } from '../types';
import { useAIPlayerDecision } from './decision/useAIPlayerDecision';

/**
 * Hook to manage AI player decision-making
 */
export function useAIDecisionManager(
  isUsingLLM: boolean,
  setIsThinking: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  addMemoryEntry: (playerId: string, entry: AIMemoryEntry) => void,
  getPlayerMemory: (playerId: string) => AIMemoryEntry[],
  getTriggeredMemories?: (playerId: string, context: any) => AIMemoryEntry[]
) {
  const { makeDecision } = useAIPlayerDecision(
    isUsingLLM, 
    setIsThinking, 
    addMemoryEntry,
    getPlayerMemory,
    getTriggeredMemories
  );

  /**
   * Make a strategic decision for an AI player
   */
  const makeAIDecision = async (
    playerId: string,
    decisionType: 'nominate' | 'vote' | 'veto' | 'alliance',
    options: string[],
    gameState: any,
    players: PlayerData[]
  ): Promise<AIPlayerDecision> => {
    return makeDecision(playerId, decisionType, options, gameState, players);
  };

  return { makeAIDecision };
}
