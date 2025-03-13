
import { useCallback } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import { GameEvent, EventOutcome } from '../types/eventTypes';
import { EventManagerState } from './types/eventDecisionTypes';
import { AIMemoryEntry } from '../types/gamePhaseState';

/**
 * Hook to manage event-related actions
 */
export function useEventManagerActions(
  state: EventManagerState & {
    setCurrentEvent: (event: GameEvent | null) => void;
    setEventModalOpen: (open: boolean) => void;
    setWeeklyEvents: (events: GameEvent[]) => void;
  }
) {
  const { 
    players, 
    currentWeek, 
    addMemoryEntry, 
    updateBotEmotion 
  } = useGameContext();
  
  const {
    weeklyEvents,
    setWeeklyEvents,
    setCurrentEvent,
    setEventModalOpen
  } = state;
  
  /**
   * Process an event choice and return an outcome
   */
  const processEventChoice = useCallback((eventId: string, choiceId: string): EventOutcome | null => {
    const event = weeklyEvents.find(e => e.id === eventId);
    if (!event) return null;
    
    const choice = event.choices?.find(c => c.id === choiceId);
    if (!choice) return null;
    
    // Basic outcome processing, can be enhanced later
    return {
      outcome: choice.outcome,
      relationshipEffect: choiceId === 'positive' ? 2 : choiceId === 'negative' ? -2 : 0
    };
  }, [weeklyEvents]);
  
  /**
   * Handle a user's choice for an event
   */
  const handleEventChoice = useCallback((eventId: string, choiceId: string) => {
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
  }, [processEventChoice, weeklyEvents, players, currentWeek, addMemoryEntry, updateBotEmotion, setEventModalOpen, setCurrentEvent]);
  
  /**
   * Generate a random event
   */
  const generateRandomEvent = useCallback(async (): Promise<GameEvent | null> => {
    // Simple placeholder to generate a basic event
    // In a real implementation, this would have more sophisticated logic
    const randomPlayerId = players.length > 0 ? 
      players[Math.floor(Math.random() * players.length)].id : null;
    
    if (!randomPlayerId) return null;
    
    const player = players.find(p => p.id === randomPlayerId);
    if (!player) return null;
    
    const eventTypes = ['alliance_offer', 'strategy_discussion', 'secret_reveal', 'game_insight'];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const newEvent: GameEvent = {
      id: `event_${Date.now()}`,
      playerId: randomPlayerId,
      playerName: player.name,
      type: eventType,
      title: `${player.name} wants to talk`,
      description: `${player.name} would like to discuss game strategy with you.`,
      choices: [
        { id: 'positive', text: 'Be receptive', outcome: 'appreciated your strategic insights' },
        { id: 'neutral', text: 'Stay noncommittal', outcome: 'noted your careful approach' },
        { id: 'negative', text: 'Deflect the conversation', outcome: 'seemed disappointed by your lack of engagement' }
      ],
      participants: [randomPlayerId]
    };
    
    // Add to weekly events
    setWeeklyEvents([...weeklyEvents, newEvent]);
    
    return newEvent;
  }, [players, weeklyEvents, setWeeklyEvents]);
  
  /**
   * Trigger a random event to occur
   */
  const handleRandomEvent = useCallback(async () => {
    const newEvent = await generateRandomEvent();
    if (newEvent) {
      setCurrentEvent(newEvent);
      setEventModalOpen(true);
    }
  }, [generateRandomEvent, setCurrentEvent, setEventModalOpen]);
  
  /**
   * Reset the weekly events list
   */
  const resetWeeklyEvents = useCallback(() => {
    setWeeklyEvents([]);
  }, [setWeeklyEvents]);
  
  return {
    handleEventChoice,
    handleRandomEvent,
    resetWeeklyEvents
  };
}
