
import { useState } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import { useToast } from "@/components/ui/use-toast";
import { DecisionData } from './types';
import { AIMemoryEntry } from '@/hooks/game-phases/types/gamePhaseState';

/**
 * Hook to manage player decisions
 */
export function useDecisionManager() {
  const { players, currentWeek, addMemoryEntry } = useGameContext();
  const { toast } = useToast();
  
  const [decisionPromptOpen, setDecisionPromptOpen] = useState(false);
  const [currentDecision, setCurrentDecision] = useState<DecisionData | null>(null);
  const [pendingDecisionCallback, setPendingDecisionCallback] = useState<((optionId: string) => void) | null>(null);
  
  /**
   * Present a decision to the player
   */
  const presentDecision = (
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
  };
  
  /**
   * Handle the player making a decision
   */
  const handleDecisionMade = (optionId: string) => {
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
  };
  
  return {
    decisionPromptOpen,
    setDecisionPromptOpen,
    currentDecision,
    presentDecision,
    handleDecisionMade
  };
}
