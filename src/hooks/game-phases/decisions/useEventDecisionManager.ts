
import { useEventManagerState } from './useEventManagerState';
import { useDecisionManagerState } from './useDecisionManagerState';
import { useEventManagerActions } from './useEventManagerActions';
import { useDecisionManagerActions } from './useDecisionManagerActions';
import { useDecisionGenerators } from './useDecisionGenerators';
import { useGameContext } from '@/hooks/useGameContext';

/**
 * Main hook that combines event and decision management
 */
export function useEventDecisionManager() {
  const { players } = useGameContext();
  
  // Initialize state hooks
  const eventManagerState = useEventManagerState();
  const decisionManagerState = useDecisionManagerState();
  
  // Initialize action hooks
  const eventManagerActions = useEventManagerActions(eventManagerState);
  const decisionManagerActions = useDecisionManagerActions(decisionManagerState);
  
  // Initialize decision generators
  const decisionGenerators = useDecisionGenerators();
  
  return {
    // Expose event manager state
    weeklyEvents: eventManagerState.weeklyEvents,
    currentEvent: eventManagerState.currentEvent,
    eventModalOpen: eventManagerState.eventModalOpen,
    
    // Expose event manager actions
    setEventModalOpen: eventManagerState.setEventModalOpen,
    handleRandomEvent: eventManagerActions.handleRandomEvent,
    handleEventChoice: eventManagerActions.handleEventChoice,
    triggerRandomEvent: eventManagerActions.handleRandomEvent,
    resetWeeklyEvents: eventManagerActions.resetWeeklyEvents,
    
    // Expose decision manager state
    currentDecision: decisionManagerState.currentDecision,
    decisionPromptOpen: decisionManagerState.decisionPromptOpen,
    
    // Expose decision manager actions
    setDecisionPromptOpen: decisionManagerState.setDecisionPromptOpen,
    presentDecision: decisionManagerActions.presentDecision,
    handleDecisionMade: decisionManagerActions.handleDecisionMade,
    
    // Expose decision generators
    generateAllianceDecision: decisionGenerators.generateAllianceDecision,
    generateNominationDecision: decisionGenerators.generateNominationDecision,
    generateEvictionVoteDecision: decisionGenerators.generateEvictionVoteDecision,
    generateVetoDecision: decisionGenerators.generateVetoDecision
  };
}
