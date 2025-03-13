
import { useCallback } from 'react';
import { useStorylineActions } from '../useStorylineActions';
import { usePlayerGameContext } from './usePlayerGameContext';
import { usePlayerStorylineState } from './usePlayerStorylineState';
import { StoryEvent } from '../types';

/**
 * Hook to provide storyline actions for player storylines
 */
export function usePlayerStorylineActions() {
  // Get game context
  const gameContext = usePlayerGameContext();
  
  // Get storyline state
  const storyState = usePlayerStorylineState();
  
  // Extract state and setters for passing to actions hook
  const { 
    currentStoryEvent, storyEventOpen, storyQueue, dayEvents, playerMood,
    completedStorylines, activeStorylines,
    setCurrentStoryEvent, setStoryEventOpen, setStoryQueue, setDayEvents, 
    setPlayerMood, setCompletedStorylines, setActiveStorylines
  } = storyState;
  
  // Extract game context properties
  const {
    currentPhase, dayCount, actionsRemaining, players, currentWeek,
    useAction, addMemoryEntry, alliances, nominees, hoh
  } = gameContext;
  
  // Use our storyline actions hook
  const storyActions = useStorylineActions(
    { 
      currentStoryEvent, 
      storyEventOpen, 
      storyQueue, 
      dayEvents, 
      playerMood,
      completedStorylines,
      activeStorylines
    },
    { 
      setCurrentStoryEvent, 
      setStoryEventOpen, 
      setStoryQueue, 
      setDayEvents, 
      setPlayerMood,
      setCompletedStorylines,
      setActiveStorylines
    },
    { 
      currentPhase, 
      dayCount, 
      actionsRemaining, 
      players, 
      currentWeek, 
      useAction, 
      addMemoryEntry,
      alliances,
      nominees,
      hoh
    }
  );
  
  // Get all the action methods
  const { 
    presentNextEvent, 
    triggerDiaryRoomEvent, 
    triggerSocialEvent, 
    handleStoryChoice, 
    generateRandomEvent,
    startStoryline
  } = storyActions;
  
  return {
    presentNextEvent, 
    triggerDiaryRoomEvent, 
    triggerSocialEvent, 
    handleStoryChoice, 
    generateRandomEvent,
    startStoryline
  };
}
