
import { useCallback } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import { useToast } from "@/components/ui/use-toast";
import { DecisionData } from './types';
import { DecisionManagerState } from './types/eventDecisionTypes';
import { AIMemoryEntry } from '../types/gamePhaseState';

/**
 * Hook to manage decision-related actions
 */
export function useDecisionManagerActions(
  state: DecisionManagerState & {
    setCurrentDecision: (decision: DecisionData | null) => void;
    setDecisionPromptOpen: (open: boolean) => void;
    setPendingDecisionCallback: (callback: ((optionId: string) => void) | null) => void;
    pendingDecisionCallback: ((optionId: string) => void) | null;
  }
) {
  const { 
    players, 
    currentWeek, 
    addMemoryEntry 
  } = useGameContext();
  
  const { toast } = useToast();
  
  const {
    pendingDecisionCallback,
    currentDecision,
    setCurrentDecision,
    setDecisionPromptOpen,
    setPendingDecisionCallback
  } = state;
  
  /**
   * Present a decision to the player
   */
  const presentDecision = useCallback((
    decisionData: DecisionData,
    onDecisionMade: (optionId: string) => void
  ) => {
    setCurrentDecision(decisionData);
    setPendingDecisionCallback(() => onDecisionMade);
    setDecisionPromptOpen(true);
    return new Promise<string>((resolve) => {
      setPendingDecisionCallback((optionId) => {
        onDecisionMade(optionId);
        resolve(optionId);
        return optionId;
      });
    });
  }, [setCurrentDecision, setPendingDecisionCallback, setDecisionPromptOpen]);
  
  /**
   * Handle the player making a decision
   */
  const handleDecisionMade = useCallback((optionId: string) => {
    if (pendingDecisionCallback && currentDecision) {
      pendingDecisionCallback(optionId);
      
      // Get the selected option
      const selectedOption = currentDecision.options.find(o => o.id === optionId);
      
      if (selectedOption) {
        toast({
          title: "Decision Made",
          description: `You chose: ${selectedOption.label}`,
        });
        
        // Create a memory entry for target player if applicable
        if (currentDecision.targetPlayerId) {
          const memoryEntry: AIMemoryEntry = {
            type: "conversation",
            week: currentWeek || 1,
            description: `The human player chose: ${selectedOption.label}`,
            impact: 'neutral',
            importance: 4,
            timestamp: new Date().toISOString()
          };
          
          addMemoryEntry(currentDecision.targetPlayerId, memoryEntry);
        }
      }
      
      // Reset decision state
      setCurrentDecision(null);
      setPendingDecisionCallback(null);
    }
  }, [pendingDecisionCallback, currentDecision, toast, currentWeek, addMemoryEntry, setCurrentDecision, setPendingDecisionCallback]);
  
  return {
    presentDecision,
    handleDecisionMade
  };
}
