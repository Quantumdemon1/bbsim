
import { useStorylineState } from '../state';

/**
 * Hook to manage storyline state for player storylines
 */
export function usePlayerStorylineState() {
  // Use our storyline state hook with updated interface
  const storyState = useStorylineState();
  
  // Destructure for easier access
  const { 
    currentStoryEvent, 
    storyEventOpen, 
    storyQueue, 
    dayEvents, 
    playerMood,
    completedStorylines, 
    activeStorylines,
    
    // Setters
    setCurrentStoryEvent, 
    setStoryEventOpen, 
    setStoryQueue, 
    setDayEvents, 
    setPlayerMood, 
    setCompletedStorylines, 
    setActiveStorylines,
    
    // Getters/selectors
    hasActiveStorylines,
    hasCompletedStorylines,
    hasEventsInQueue
  } = storyState;
  
  return {
    // State
    currentStoryEvent, 
    storyEventOpen, 
    storyQueue, 
    dayEvents, 
    playerMood,
    completedStorylines, 
    activeStorylines,
    
    // Setters
    setCurrentStoryEvent, 
    setStoryEventOpen, 
    setStoryQueue, 
    setDayEvents, 
    setPlayerMood, 
    setCompletedStorylines, 
    setActiveStorylines,
    
    // Getters/derived state
    hasActiveStorylines,
    hasCompletedStorylines,
    hasEventsInQueue
  };
}
