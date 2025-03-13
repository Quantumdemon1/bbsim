
import { useGameContext } from '@/hooks/useGameContext';
import { useStorylineState } from '../state';
import { useStorylineActions } from '../useStorylineActions';
import { usePlayerStorylineEffects } from './usePlayerStorylineEffects';
import { StoryEvent } from '../types';
import { GamePhase } from '@/types/gameTypes';

export type { StoryEvent };

/**
 * Primary hook for player storyline management
 * Provides a unified API for storyline features
 */
export function usePlayerStorylineManager() {
  // Get game context and explicitly type it to include required properties
  const gameContext = useGameContext();
  
  // Extract common properties from gameContext
  const { 
    players, 
    currentWeek,
    addMemoryEntry,
    alliances
  } = gameContext;
  
  // Safely extract properties that might not be directly available in all useGameContext implementations
  // by using type assertion to a more specific type that includes these properties
  const gamePhaseContext = gameContext as unknown as {
    currentPhase: GamePhase;
    dayCount: number;
    actionsRemaining: number;
    useAction: () => boolean;
    nominees: string[];
    hoh: string | null;
    veto: string | null;
  } & typeof gameContext;

  const { 
    currentPhase, 
    dayCount, 
    actionsRemaining, 
    useAction,
    nominees,
    hoh,
    veto
  } = gamePhaseContext;
  
  // Use our storyline state hook with updated interface
  const storyState = useStorylineState();
  
  // Get state and setters for passing to actions hook
  const { 
    currentStoryEvent, storyEventOpen, storyQueue, dayEvents, playerMood,
    completedStorylines, activeStorylines,
    setCurrentStoryEvent, setStoryEventOpen, setStoryQueue, setDayEvents, 
    setPlayerMood, setCompletedStorylines, setActiveStorylines
  } = storyState;
  
  // Use our storyline actions hook with enhanced interface
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

  // Apply side effects (useEffects)
  usePlayerStorylineEffects({
    currentPhase,
    dayCount,
    actionsRemaining,
    dayEvents,
    storyEventOpen,
    currentStoryEvent: storyState.currentStoryEvent,
    activeStorylines,
    setDayEvents,
    presentNextEvent,
    generateRandomEvent,
    startStoryline
  });

  // Return the same API as before
  return {
    currentStoryEvent,
    storyEventOpen, 
    setStoryEventOpen,
    storyQueue,
    triggerDiaryRoomEvent,
    triggerSocialEvent,
    handleStoryChoice,
    generateRandomEvent,
    startStoryline,
    playerMood,
    activeStorylines,
    completedStorylines
  };
}
