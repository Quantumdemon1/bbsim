
import { useEventDecisionManager } from './useEventDecisionManager';
import { PlayerData } from '@/components/PlayerProfileTypes';
import type { DecisionData, DecisionOption } from './decisions/types';

export type { DecisionData, DecisionOption };

interface UsePlayerDecisionsProps {
  players: PlayerData[];
  currentPlayerId: string | null;
}

export function usePlayerDecisions({ players, currentPlayerId }: UsePlayerDecisionsProps) {
  // Use the central event decision manager
  const eventDecisionManager = useEventDecisionManager();
  
  return {
    isDecisionPromptOpen: eventDecisionManager.decisionPromptOpen,
    setIsDecisionPromptOpen: eventDecisionManager.setDecisionPromptOpen,
    currentDecision: eventDecisionManager.currentDecision,
    presentDecision: eventDecisionManager.presentDecision,
    handleDecisionMade: eventDecisionManager.handleDecisionMade,
    generateAllianceDecision: eventDecisionManager.generateAllianceDecision,
    generateNominationDecision: eventDecisionManager.generateNominationDecision,
    generateEvictionVoteDecision: eventDecisionManager.generateEvictionVoteDecision,
    generateVetoDecision: eventDecisionManager.generateVetoDecision
  };
}
