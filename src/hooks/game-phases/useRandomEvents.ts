
import { useCallback, useState } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import { createEventMemoryEntry } from './events/eventGenerator';
import { useEventManager } from './events/eventManager';
import { GameEvent } from './types/eventTypes';

export { GameEvent } from './types/eventTypes';

export function useRandomEvents() {
  const { 
    players, 
    generateAIDialogue,
    addMemoryEntry,
    updateBotEmotion,
    currentWeek
  } = useGameContext();
  
  const [lastEventDay, setLastEventDay] = useState(0);
  const [eventProbability, setEventProbability] = useState(0.3); // 30% chance by default
  
  const {
    weeklyEvents,
    generateRandomEvent,
    processEventChoice,
    resetWeeklyEvents
  } = useEventManager(generateAIDialogue);
  
  const triggerRandomEvent = useCallback(async (currentDay: number) => {
    if (currentDay <= lastEventDay) return null;
    
    if (Math.random() > eventProbability) return null;
    
    setLastEventDay(currentDay);
    
    const aiPlayers = players.filter(p => !p.isHuman && p.status !== 'evicted');
    if (aiPlayers.length === 0) return null;
    
    const randomPlayer = aiPlayers[Math.floor(Math.random() * aiPlayers.length)];
    
    const eventTypes = ['alliance_offer', 'strategy_discussion', 'secret_reveal', 'game_insight'];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const eventContent = await generateAIDialogue(randomPlayer.id, 'general', { eventType });
    
    const memoryEntry = createEventMemoryEntry(
      { 
        text: eventContent, 
        summary: `${randomPlayer.name} ${getEventSummary(eventType)}`,
        impact: "neutral",
        emotion: "neutral"
      },
      currentWeek || 1
    );
    
    addMemoryEntry(randomPlayer.id, memoryEntry);
    
    updateBotEmotion(randomPlayer.id, getEmotionForEventType(eventType));
    
    return {
      playerId: randomPlayer.id,
      playerName: randomPlayer.name,
      eventType,
      content: eventContent,
      summary: memoryEntry.description
    };
  }, [players, lastEventDay, eventProbability, generateAIDialogue, addMemoryEntry, updateBotEmotion, currentWeek]);
  
  const setEventFrequency = (probability: number) => {
    setEventProbability(Math.max(0, Math.min(1, probability)));
  };
  
  return {
    triggerRandomEvent,
    setEventFrequency,
    eventProbability,
    weeklyEvents,
    generateRandomEvent: () => generateRandomEvent(players, currentWeek || 1),
    processEventChoice,
    resetWeeklyEvents
  };
}

// Helper function to determine emotion based on event type
function getEventSummary(eventType: string): string {
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
}

// Helper function to determine emotion based on event type
function getEmotionForEventType(eventType: string): string {
  switch (eventType) {
    case 'alliance_offer':
      return 'excited';
    case 'strategy_discussion':
      return 'focused';
    case 'secret_reveal':
      return Math.random() > 0.7 ? 'worried' : 'relieved';
    case 'game_insight':
      return 'confident';
    default:
      return 'neutral';
  }
}
