
import { useState } from 'react';
import { DecisionData } from './types';
import { DecisionManagerState } from './types/eventDecisionTypes';

/**
 * Hook to manage decision state
 */
export function useDecisionManagerState(): DecisionManagerState & {
  setCurrentDecision: (decision: DecisionData | null) => void;
  setDecisionPromptOpen: (open: boolean) => void;
  setPendingDecisionCallback: (callback: ((optionId: string) => void) | null) => void;
  pendingDecisionCallback: ((optionId: string) => void) | null;
} {
  const [decisionPromptOpen, setDecisionPromptOpen] = useState(false);
  const [currentDecision, setCurrentDecision] = useState<DecisionData | null>(null);
  const [pendingDecisionCallback, setPendingDecisionCallback] = useState<((optionId: string) => void) | null>(null);
  
  return {
    decisionPromptOpen,
    currentDecision,
    pendingDecisionCallback,
    setDecisionPromptOpen,
    setCurrentDecision,
    setPendingDecisionCallback
  };
}
