
import { useEventManager } from './useEventManager';
import { useDecisionManager } from './useDecisionManager';
import { useDecisionGenerators } from './useDecisionGenerators';
import { useGameContext } from '@/hooks/useGameContext';
import { DecisionData } from './types';

/**
 * Main hook that combines event and decision management
 */
export function useEventDecisionManager() {
  const { players } = useGameContext();
  
  // Initialize sub-hooks
  const eventManager = useEventManager();
  const decisionManager = useDecisionManager();
  const decisionGenerators = useDecisionGenerators();
  
  return {
    // Expose event manager functionality
    weeklyEvents: eventManager.weeklyEvents,
    currentEvent: eventManager.currentEvent,
    eventModalOpen: eventManager.eventModalOpen,
    setEventModalOpen: eventManager.setEventModalOpen,
    handleRandomEvent: eventManager.handleRandomEvent,
    handleEventChoice: eventManager.handleEventChoice,
    triggerRandomEvent: eventManager.handleRandomEvent,
    resetWeeklyEvents: eventManager.resetWeeklyEvents,
    
    // Expose decision manager functionality
    currentDecision: decisionManager.currentDecision,
    decisionPromptOpen: decisionManager.decisionPromptOpen,
    setDecisionPromptOpen: decisionManager.setDecisionPromptOpen,
    presentDecision: decisionManager.presentDecision,
    handleDecisionMade: decisionManager.handleDecisionMade,
    
    // Expose decision generators
    generateAllianceDecision: decisionGenerators.generateAllianceDecision,
    generateNominationDecision: decisionGenerators.generateNominationDecision,
    generateEvictionVoteDecision: decisionGenerators.generateEvictionVoteDecision,
    generateVetoDecision: decisionGenerators.generateVetoDecision
  };
}
