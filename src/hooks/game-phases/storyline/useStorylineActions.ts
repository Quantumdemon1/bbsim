
import { useCallback } from 'react';
import { StoryEvent, StorylineState } from './types';
import { createDiaryRoomEvent, createSocialEvent, generateRandomGameEvent } from './eventGenerators';
import { toast } from '@/components/ui/use-toast';
import { GamePhase } from '@/types/gameTypes';
import { PlayerData } from '@/components/PlayerProfileTypes';

export function useStorylineActions(
  storyState: StorylineState,
  stateSetters: {
    setCurrentStoryEvent: (event: StoryEvent | null) => void;
    setStoryEventOpen: (open: boolean) => void;
    setStoryQueue: (queue: StoryEvent[]) => void;
    setDayEvents: (events: string[]) => void;
    setPlayerMood: (mood: string) => void;
  },
  context: {
    currentPhase: GamePhase;
    dayCount: number;
    actionsRemaining: number;
    players: PlayerData[];
    currentWeek?: number;
    useAction: () => boolean;
    addMemoryEntry: (playerId: string, entry: any) => void;
  }
) {
  const { 
    currentStoryEvent, storyEventOpen, storyQueue, dayEvents
  } = storyState;
  
  const {
    setCurrentStoryEvent, setStoryEventOpen, setStoryQueue, 
    setDayEvents, setPlayerMood
  } = stateSetters;
  
  const {
    currentPhase, players, useAction, addMemoryEntry, currentWeek
  } = context;

  // Present next event from the queue
  const presentNextEvent = useCallback(() => {
    if (storyQueue.length > 0 && !currentStoryEvent) {
      const nextEvent = storyQueue[0];
      setCurrentStoryEvent(nextEvent);
      setStoryEventOpen(true);
      
      // Remove from queue
      setStoryQueue(prev => prev.slice(1));
    }
  }, [storyQueue, currentStoryEvent, setCurrentStoryEvent, setStoryEventOpen, setStoryQueue]);

  // Trigger a diary room event
  const triggerDiaryRoomEvent = useCallback(() => {
    // Only allow diary room once per day
    if (dayEvents.includes('diary')) return false;
    
    // Costs an action point
    if (!useAction()) return false;
    
    const diaryEvent = createDiaryRoomEvent(currentPhase);
    
    setStoryQueue(prev => [...prev, diaryEvent]);
    setDayEvents(prev => [...prev, 'diary']);
    
    return true;
  }, [currentPhase, dayEvents, useAction, setStoryQueue, setDayEvents]);

  // Trigger a social interaction with another player
  const triggerSocialEvent = useCallback((targetPlayerId: string) => {
    // Costs an action point
    if (!useAction()) return false;
    
    const targetPlayer = players.find(p => p.id === targetPlayerId);
    if (!targetPlayer) return false;
    
    const socialEvent = createSocialEvent(targetPlayer);
    
    setStoryQueue(prev => [...prev, socialEvent]);
    setDayEvents(prev => [...prev, `social_${targetPlayerId}`]);
    
    return true;
  }, [players, useAction, setStoryQueue, setDayEvents]);

  // Handle player's choice in an event
  const handleStoryChoice = useCallback((eventId: string, choiceId: string) => {
    const event = currentStoryEvent;
    if (!event) return;
    
    const choice = event.options?.find(o => o.id === choiceId);
    if (!choice) return;
    
    // Update player mood based on the choice
    if (choiceId === 'strategic') setPlayerMood('focused');
    if (choiceId === 'emotional') setPlayerMood('expressive'); 
    if (choiceId === 'deceptive') setPlayerMood('cunning');
    
    // Record the choice for AI memory if related to a specific player
    if (event.requires?.playerId) {
      addMemoryEntry(event.requires.playerId, {
        type: event.type === 'social' ? 'conversation' : 'strategy_discussion',
        week: currentWeek || 1,
        description: `In a ${event.type} interaction, the human player chose: ${choice.text}`,
        impact: 'neutral',
        importance: 3,
        timestamp: new Date().toISOString()
      });
    }
    
    // Show consequence as toast
    toast({
      title: "Decision Made",
      description: choice.consequence,
      duration: 3000
    });
    
    // Close the event dialog
    setStoryEventOpen(false);
    setCurrentStoryEvent(null);
  }, [currentStoryEvent, setStoryEventOpen, setCurrentStoryEvent, setPlayerMood, addMemoryEntry, currentWeek]);

  // Generate random house events based on game state
  const generateRandomEvent = useCallback(() => {
    // Limit random events based on actions
    if (context.actionsRemaining < 2 || dayEvents.length > 3) return false;
    
    // 15% chance of a random event
    if (Math.random() > 0.15) return false;
    
    // Use an action
    if (!useAction()) return false;
    
    const newEvent = generateRandomGameEvent(players);
    if (!newEvent) return false;
    
    // Add to queue
    setStoryQueue(prev => [...prev, newEvent]);
    setDayEvents(prev => [...prev, newEvent.type]);
    
    return true;
  }, [context.actionsRemaining, dayEvents, useAction, players, setStoryQueue, setDayEvents]);

  return {
    presentNextEvent,
    triggerDiaryRoomEvent,
    triggerSocialEvent,
    handleStoryChoice,
    generateRandomEvent
  };
}
