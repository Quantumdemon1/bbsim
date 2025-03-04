
import { useState, useCallback } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import { GameEvent, EventOutcome } from '../types/eventTypes';
import { AIMemoryEntry } from '@/hooks/ai/types';

/**
 * Hook to manage random events
 */
export function useEventManager() {
  const { 
    players, 
    currentWeek, 
    addMemoryEntry, 
    updateBotEmotion,
    weeklyEvents,
    generateRandomEvent,
    processEventChoice, 
    resetWeeklyEvents
  } = useGameContext();
  
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  
  /**
   * Handle a user's choice for an event
   */
  const handleEventChoice = (eventId: string, choiceId: string) => {
    const result = processEventChoice(eventId, choiceId);
    if (result) {
      console.log("Event outcome:", result.outcome);
      console.log("Relationship effects:", result.relationshipEffect);
      
      // Create a memory entry for this event choice
      const event = weeklyEvents.find(e => e.id === eventId);
      if (event) {
        const player = players.find(p => p.id === event.playerId);
        if (player) {
          const memoryEntry: AIMemoryEntry = {
            type: "strategy_discussion",
            week: currentWeek || 1,
            description: `${player.name} ${result.outcome}`,
            impact: choiceId === 'positive' ? 'positive' : choiceId === 'negative' ? 'negative' : 'neutral',
            importance: 3,
            timestamp: new Date().toISOString()
          };
          
          addMemoryEntry(event.playerId, memoryEntry);
          
          // Update bot emotion based on the choice
          const emotions = {
            positive: 'happy',
            neutral: 'neutral',
            negative: 'disappointed'
          };
          updateBotEmotion(event.playerId, emotions[choiceId as keyof typeof emotions]);
        }
      }
      
      // Close the event modal
      setEventModalOpen(false);
      setCurrentEvent(null);
    }
  };
  
  /**
   * Trigger a random event to occur
   */
  const handleRandomEvent = async () => {
    const newEvent = await generateRandomEvent();
    if (newEvent) {
      setCurrentEvent(newEvent);
      setEventModalOpen(true);
    }
  };
  
  return {
    eventModalOpen,
    setEventModalOpen,
    currentEvent,
    handleEventChoice,
    handleRandomEvent,
    weeklyEvents,
    resetWeeklyEvents
  };
}
