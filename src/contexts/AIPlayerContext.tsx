
import React, { createContext, useContext, ReactNode } from 'react';
import { useAIPlayerManager } from '@/hooks/ai/useAIPlayerManager';
import { usePlayerManagerContext } from './PlayerManagerContext';
import { AIMemoryEntry, AIPlayerDecision } from '@/hooks/ai/types';

interface AIPlayerContextType {
  makeAIDecision: (
    playerId: string, 
    decisionType: 'nominate' | 'vote' | 'veto' | 'alliance',
    options: string[],
    gameState: any
  ) => Promise<AIPlayerDecision>;
  generateAIDialogue: (
    playerId: string,
    situation: 'nomination' | 'veto' | 'eviction' | 'hoh' | 'general' | 'reaction',
    context: any
  ) => Promise<string>;
  addMemoryEntry: (playerId: string, entry: AIMemoryEntry) => void;
  clearAIMemory: () => void;
  getPlayerMemory: (playerId: string) => AIMemoryEntry[];
  isUsingLLM: boolean;
  toggleLLMDecisionMaking: () => void;
}

const AIPlayerContext = createContext<AIPlayerContextType>({} as AIPlayerContextType);

export const AIPlayerProvider = ({ children }: { children: ReactNode }) => {
  const { players } = usePlayerManagerContext();
  const aiManager = useAIPlayerManager(players);
  
  return (
    <AIPlayerContext.Provider
      value={{
        makeAIDecision: aiManager.makeAIDecision,
        generateAIDialogue: aiManager.generateAIDialogue,
        addMemoryEntry: aiManager.addMemoryEntry,
        clearAIMemory: aiManager.clearAIMemory,
        getPlayerMemory: (playerId: string) => aiManager.getPlayerMemory(playerId),
        isUsingLLM: aiManager.isUsingLLM,
        toggleLLMDecisionMaking: aiManager.toggleLLMDecisionMaking
      }}
    >
      {children}
    </AIPlayerContext.Provider>
  );
};

export const useAIPlayerContext = () => {
  const context = useContext(AIPlayerContext);
  if (context === undefined) {
    throw new Error('useAIPlayerContext must be used within an AIPlayerProvider');
  }
  return context;
};

