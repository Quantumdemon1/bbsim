
import { usePlayerGameContext } from './usePlayerGameContext';
import { usePlayerStorylineState } from './usePlayerStorylineState';
import { usePlayerStorylineActions } from './usePlayerStorylineActions';
import { usePlayerStorylineEffects } from './usePlayerStorylineEffects';
import { StoryEvent } from '../types';

export type { StoryEvent };

/**
 * Primary hook for player storyline management
 * Provides a unified API for storyline features by composing smaller, focused hooks
 */
export function usePlayerStorylineManager() {
  // Get game context
  const gameContext = usePlayerGameContext();
  
  // Get storyline state
  const storyState = usePlayerStorylineState();
  
  // Get storyline actions
  const storyActions = usePlayerStorylineActions();
  
  // Apply side effects (useEffects)
  usePlayerStorylineEffects({
    currentPhase: gameContext.currentPhase,
    dayCount: gameContext.dayCount,
    actionsRemaining: gameContext.actionsRemaining,
    dayEvents: storyState.dayEvents,
    storyEventOpen: storyState.storyEventOpen,
    currentStoryEvent: storyState.currentStoryEvent,
    activeStorylines: storyState.activeStorylines,
    setDayEvents: storyState.setDayEvents,
    presentNextEvent: storyActions.presentNextEvent,
    generateRandomEvent: storyActions.generateRandomEvent,
    startStoryline: storyActions.startStoryline
  });

  // Return a unified API
  return {
    // State
    currentStoryEvent: storyState.currentStoryEvent,
    storyEventOpen: storyState.storyEventOpen, 
    storyQueue: storyState.storyQueue,
    playerMood: storyState.playerMood,
    activeStorylines: storyState.activeStorylines,
    completedStorylines: storyState.completedStorylines,
    
    // Setters
    setStoryEventOpen: storyState.setStoryEventOpen,
    
    // Actions
    triggerDiaryRoomEvent: storyActions.triggerDiaryRoomEvent,
    triggerSocialEvent: storyActions.triggerSocialEvent,
    handleStoryChoice: storyActions.handleStoryChoice,
    generateRandomEvent: storyActions.generateRandomEvent,
    startStoryline: storyActions.startStoryline
  };
}
