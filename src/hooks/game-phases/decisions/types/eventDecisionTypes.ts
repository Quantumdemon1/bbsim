
import { DecisionData } from '../types';
import { GameEvent, EventOutcome } from '../../types/eventTypes';

/**
 * Event decision manager state
 */
export interface EventDecisionState {
  eventModalOpen: boolean;
  currentEvent: GameEvent | null;
  decisionPromptOpen: boolean;
  currentDecision: DecisionData | null;
  pendingDecisionCallback: ((optionId: string) => void) | null;
}

/**
 * EventManager state and actions
 */
export interface EventManagerState {
  eventModalOpen: boolean;
  currentEvent: GameEvent | null;
  weeklyEvents: GameEvent[];
}

export interface EventManagerActions {
  setEventModalOpen: (open: boolean) => void;
  handleEventChoice: (eventId: string, choiceId: string) => void;
  handleRandomEvent: () => void;
  resetWeeklyEvents: () => void;
}

/**
 * DecisionManager state and actions
 */
export interface DecisionManagerState {
  decisionPromptOpen: boolean;
  currentDecision: DecisionData | null;
}

export interface DecisionManagerActions {
  setDecisionPromptOpen: (open: boolean) => void;
  presentDecision: (decisionData: DecisionData, onDecisionMade: (optionId: string) => void) => Promise<string>;
  handleDecisionMade: (optionId: string) => void;
}
