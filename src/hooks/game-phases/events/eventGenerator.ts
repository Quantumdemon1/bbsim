
import { PlayerData } from '@/components/PlayerProfileTypes';
import { AIMemoryEntry } from '@/hooks/ai/types';
import { EventContent, EventType } from '../types/eventTypes';

/**
 * Generates random event content for a player
 */
export const generateEventContent = async (
  player: PlayerData, 
  eventType: EventType,
  generateAIDialogue: (playerId: string, eventType: string, context: any) => Promise<string>,
  currentWeek: number = 1
): Promise<EventContent> => {
  const dialogue = await generateAIDialogue(player.id, 'general', { eventType });
  
  let impact: "neutral" | "positive" | "negative" = "neutral";
  let emotion = 'neutral';
  
  switch (eventType) {
    case 'alliance_offer':
      impact = Math.random() > 0.5 ? "positive" : "neutral";
      emotion = impact === 'positive' ? 'excited' : 'thoughtful';
      break;
    case 'strategy_discussion':
      impact = "neutral";
      emotion = 'focused';
      break;
    case 'secret_reveal':
      impact = Math.random() > 0.7 ? "negative" : "neutral";
      emotion = impact === 'negative' ? 'worried' : 'relieved';
      break;
    case 'game_insight':
      impact = "positive";
      emotion = 'confident';
      break;
  }
  
  const summary = `${player.name} ${getEventSummary(eventType)}`;
  
  return {
    text: dialogue,
    summary,
    impact,
    emotion
  };
};

/**
 * Creates a memory entry for an event
 */
export const createEventMemoryEntry = (
  eventContent: EventContent,
  currentWeek: number = 1
): AIMemoryEntry => {
  return {
    type: "strategy_discussion",
    description: eventContent.summary,
    impact: eventContent.impact,
    importance: 3,
    timestamp: new Date().toISOString(),
    week: currentWeek
  };
};

/**
 * Gets a summary description for an event type
 */
export const getEventSummary = (eventType: EventType): string => {
  switch (eventType) {
    case 'alliance_offer':
      return 'considered forming a new alliance';
    case 'strategy_discussion':
      return 'thought about their game strategy';
    case 'secret_reveal':
      return 'revealed a secret to another houseguest';
    case 'game_insight':
      return 'had an insight about the game dynamics';
    default:
      return 'had a moment of reflection';
  }
};

/**
 * Generates appropriate choices for an event
 */
export const generateEventChoices = () => {
  return [
    { id: 'positive', text: 'React positively', outcome: 'You strengthen your relationship' },
    { id: 'neutral', text: 'Stay neutral', outcome: 'Your relationship stays the same' },
    { id: 'negative', text: 'React negatively', outcome: 'Your relationship weakens' }
  ];
};
