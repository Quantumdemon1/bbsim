
import { useState } from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { GameEvent, EventOutcome, EventType } from '../types/eventTypes';
import { generateEventContent, getEventSummary, generateEventChoices } from './eventGenerator';

/**
 * Manages the lifecycle of random events
 */
export function useEventManager(generateAIDialogue: (playerId: string, eventType: string, context: any) => Promise<string>) {
  const [weeklyEvents, setWeeklyEvents] = useState<GameEvent[]>([]);
  
  /**
   * Generates a new random event
   */
  const generateRandomEvent = async (players: PlayerData[], currentWeek: number = 1): Promise<GameEvent | null> => {
    const eventId = Math.random().toString(36).substring(2, 9);
    
    const aiPlayers = players.filter(p => !p.isHuman && p.status !== 'evicted');
    if (aiPlayers.length === 0) return null;
    
    const randomPlayer = aiPlayers[Math.floor(Math.random() * aiPlayers.length)];
    
    const eventTypes: EventType[] = ['alliance_offer', 'strategy_discussion', 'secret_reveal', 'game_insight'];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const newEvent: GameEvent = {
      id: eventId,
      playerId: randomPlayer.id,
      playerName: randomPlayer.name,
      type: eventType,
      title: `${randomPlayer.name} wants to talk...`,
      description: `${randomPlayer.name} ${getEventSummary(eventType)}`,
      participants: [randomPlayer.id],
      choices: generateEventChoices()
    };
    
    setWeeklyEvents(prev => [...prev, newEvent]);
    
    return newEvent;
  };
  
  /**
   * Processes a player's choice for an event
   */
  const processEventChoice = (eventId: string, choiceId: string): EventOutcome | null => {
    const event = weeklyEvents.find(e => e.id === eventId);
    if (!event) return null;
    
    return {
      outcome: event.choices?.find(c => c.id === choiceId)?.outcome || 'No effect',
      relationshipEffect: choiceId === 'positive' ? 10 : choiceId === 'negative' ? -10 : 0
    };
  };
  
  /**
   * Resets all weekly events
   */
  const resetWeeklyEvents = () => {
    setWeeklyEvents([]);
  };
  
  return {
    weeklyEvents,
    generateRandomEvent,
    processEventChoice,
    resetWeeklyEvents
  };
}
