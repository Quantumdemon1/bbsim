
import { PlayerData } from '@/components/PlayerProfileTypes';
import { GameEvent, EventOutcome } from '../types/eventTypes';

/**
 * Decision option presented to a player
 */
export interface DecisionOption {
  id: string;
  label: string;
  description?: string;
  consequence?: string;
}

/**
 * Data structure for a player decision
 */
export interface DecisionData {
  title: string;
  description: string;
  situation: string;
  options: DecisionOption[];
  targetPlayerId?: string;
}

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
