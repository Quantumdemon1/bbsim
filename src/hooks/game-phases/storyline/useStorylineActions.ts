
import { useCallback } from 'react';
import { StorylineState, StoryEvent } from './types';
import { GamePhase } from '@/types/gameTypes';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { Alliance } from '@/contexts/types';

// Import refactored action modules
import { triggerDiaryRoomEvent, triggerSocialEvent } from './actions/eventTriggers';
import { handleStoryChoice as handleChoice } from './actions/eventHandler';
import { generateRandomEvent as generateEvent } from './actions/randomEventGenerator';
import { presentNextEvent as presentEvent, startStoryline as startNewStoryline } from './actions/storylineManager';

export function useStorylineActions(
  storyState: StorylineState,
  stateSetters: {
    setCurrentStoryEvent: (event: StoryEvent | null) => void;
    setStoryEventOpen: (open: boolean) => void;
    setStoryQueue: (queue: StoryEvent[]) => void;
    setDayEvents: (events: string[]) => void;
    setPlayerMood: (mood: string) => void;
    setCompletedStorylines: (storylines: string[]) => void;
    setActiveStorylines: (storylines: {
      storylineId: string;
      currentSequence: number;
      choices: Record<number, string>;
    }[]) => void;
  },
  context: {
    currentPhase: GamePhase;
    dayCount: number;
    actionsRemaining: number;
    players: PlayerData[];
    currentWeek?: number;
    useAction: () => boolean;
    addMemoryEntry: (playerId: string, entry: any) => void;
    alliances?: Alliance[];
    nominees?: string[];
    hoh?: string | null;
  }
) {
  const { 
    currentStoryEvent, storyEventOpen, storyQueue, dayEvents,
    completedStorylines, activeStorylines, playerMood
  } = storyState;
  
  const {
    setCurrentStoryEvent, setStoryEventOpen, setStoryQueue, 
    setDayEvents, setPlayerMood, setCompletedStorylines, setActiveStorylines
  } = stateSetters;
  
  const {
    currentPhase, dayCount, players, useAction, addMemoryEntry, 
    currentWeek, alliances = [], nominees = [], hoh = null
  } = context;

  // Present next event from the queue
  const presentNextEvent = useCallback(() => {
    presentEvent(
      storyQueue, 
      currentStoryEvent, 
      setCurrentStoryEvent, 
      setStoryEventOpen, 
      setStoryQueue
    );
  }, [storyQueue, currentStoryEvent, setCurrentStoryEvent, setStoryEventOpen, setStoryQueue]);

  // Trigger a diary room event
  const diaryRoomEvent = useCallback(() => {
    return triggerDiaryRoomEvent(
      currentPhase,
      dayEvents,
      storyQueue,
      useAction,
      setStoryQueue,
      setDayEvents
    );
  }, [currentPhase, dayEvents, useAction, storyQueue, setStoryQueue, setDayEvents]);

  // Trigger a social interaction with another player
  const socialEvent = useCallback((targetPlayerId: string) => {
    return triggerSocialEvent(
      targetPlayerId,
      players,
      dayEvents,
      storyQueue,
      useAction,
      setStoryQueue,
      setDayEvents,
      alliances
    );
  }, [players, useAction, storyQueue, dayEvents, setStoryQueue, setDayEvents, alliances]);

  // Handle player's choice in an event
  const handleStoryChoice = useCallback((eventId: string, choiceId: string) => {
    handleChoice(
      eventId,
      choiceId,
      { 
        currentStoryEvent, 
        activeStorylines, 
        completedStorylines, 
        storyQueue 
      },
      {
        setCurrentStoryEvent,
        setStoryEventOpen,
        setPlayerMood,
        setActiveStorylines,
        setCompletedStorylines,
        setStoryQueue
      },
      {
        currentWeek,
        addMemoryEntry,
        players
      }
    );
  }, [
    currentStoryEvent,
    activeStorylines,
    completedStorylines,
    storyQueue,
    setCurrentStoryEvent,
    setStoryEventOpen,
    setPlayerMood,
    setActiveStorylines,
    setCompletedStorylines,
    setStoryQueue,
    currentWeek,
    addMemoryEntry,
    players
  ]);

  // Generate random house events based on game state
  const generateRandomEvent = useCallback(() => {
    return generateEvent(
      {
        actionsRemaining: context.actionsRemaining,
        useAction,
        players,
        currentPhase,
        dayCount,
        playerMood,
        alliances,
        nominees,
        hoh
      },
      {
        dayEvents,
        storyQueue,
        activeStorylines,
        completedStorylines
      },
      {
        setStoryQueue,
        setDayEvents
      },
      (storylineId) => startStoryline(storylineId)
    );
  }, [
    context.actionsRemaining,
    useAction,
    players,
    currentPhase,
    dayCount,
    playerMood,
    alliances,
    nominees,
    hoh,
    dayEvents,
    storyQueue,
    activeStorylines,
    completedStorylines,
    setStoryQueue,
    setDayEvents
  ]);

  // Start a new storyline
  const startStoryline = useCallback((storylineId: string) => {
    return startNewStoryline(
      storylineId,
      players,
      {
        activeStorylines,
        completedStorylines,
        storyQueue
      },
      {
        setStoryQueue,
        setActiveStorylines
      }
    );
  }, [
    players,
    activeStorylines,
    completedStorylines,
    storyQueue,
    setStoryQueue,
    setActiveStorylines
  ]);

  return {
    presentNextEvent,
    triggerDiaryRoomEvent: diaryRoomEvent,
    triggerSocialEvent: socialEvent,
    handleStoryChoice,
    generateRandomEvent,
    startStoryline
  };
}
