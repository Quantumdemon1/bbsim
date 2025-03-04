
import { useEventDecisionManager } from './useEventDecisionManager';
import { PlayerData } from '@/components/PlayerProfileTypes';

export interface DecisionOption {
  id: string;
  label: string;
  description?: string;
  consequence?: string;
}

export interface DecisionData {
  title: string;
  description: string;
  situation: string;
  options: DecisionOption[];
  targetPlayerId?: string;
}

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
