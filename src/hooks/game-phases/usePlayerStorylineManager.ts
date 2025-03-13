
import { useEffect } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import { useEventDecisionManager } from './decisions/useEventDecisionManager';
import { useStorylineState } from './storyline/useStorylineState';
import { useStorylineActions } from './storyline/useStorylineActions';
import { StoryEvent } from './storyline/types';

export type { StoryEvent } from './storyline/types';

export function usePlayerStorylineManager() {
  // Explicitly type the required properties from GameContext
  const { 
    players, 
    currentWeek,
    addMemoryEntry,
  } = useGameContext();

  // Access these properties from GameContext but with type checking
  const gameContext = useGameContext() as unknown as {
    currentPhase: any;
    dayCount: number;
    actionsRemaining: number;
    useAction: () => boolean;
  } & ReturnType<typeof useGameContext>;

  const { currentPhase, dayCount, actionsRemaining, useAction } = gameContext;
  
  // Get decision manager to use its mechanism
  const { 
    presentDecision, 
    handleDecisionMade, 
    currentEvent 
  } = useEventDecisionManager();
  
  // Use our new storyline state hook
  const storyState = useStorylineState();
  
  // Get state and setters for passing to actions hook
  const { 
    currentStoryEvent, storyEventOpen, storyQueue, dayEvents, playerMood,
    setCurrentStoryEvent, setStoryEventOpen, setStoryQueue, setDayEvents, setPlayerMood
  } = storyState;
  
  // Use our new storyline actions hook
  const storyActions = useStorylineActions(
    { currentStoryEvent, storyEventOpen, storyQueue, dayEvents, playerMood },
    { setCurrentStoryEvent, setStoryEventOpen, setStoryQueue, setDayEvents, setPlayerMood },
    { currentPhase, dayCount, actionsRemaining, players, currentWeek, useAction, addMemoryEntry }
  );
  
  // Get all the action methods
  const { 
    presentNextEvent, 
    triggerDiaryRoomEvent, 
    triggerSocialEvent, 
    handleStoryChoice, 
    generateRandomEvent 
  } = storyActions;

  // Clear day events when day changes
  useEffect(() => {
    setDayEvents([]);
  }, [dayCount, setDayEvents]);

  // Present next event when conditions are right
  useEffect(() => {
    if (!storyEventOpen && !currentEvent) {
      presentNextEvent();
    }
  }, [storyEventOpen, currentEvent, presentNextEvent]);

  // Return the same API as before to maintain compatibility
  return {
    currentStoryEvent,
    storyEventOpen, 
    setStoryEventOpen,
    storyQueue,
    triggerDiaryRoomEvent,
    triggerSocialEvent,
    handleStoryChoice,
    generateRandomEvent,
    playerMood
  };
}
