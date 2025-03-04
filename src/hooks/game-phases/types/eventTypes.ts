
/**
 * Types for random event system
 */

export interface GameEvent {
  id: string;
  playerId: string;
  playerName: string;
  type: string;
  title: string;
  description: string;
  choices?: { id: string; text: string; outcome: string }[];
  participants: string[];
}

export interface EventOutcome {
  outcome: string;
  relationshipEffect: number;
}

export interface EventContent {
  text: string;
  summary: string;
  impact: "neutral" | "positive" | "negative";
  emotion: string;
}

export type EventType = 'alliance_offer' | 'strategy_discussion' | 'secret_reveal' | 'game_insight';
