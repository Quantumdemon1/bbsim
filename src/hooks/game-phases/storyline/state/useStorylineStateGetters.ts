
import { StoryEvent } from '../types';

// Types for the state values
export interface StorylineStateValues {
  currentStoryEvent: StoryEvent | null;
  storyEventOpen: boolean;
  storyQueue: StoryEvent[];
  dayEvents: string[];
  playerMood: string;
  completedStorylines: string[];
  activeStorylines: {
    storylineId: string;
    currentSequence: number;
    choices: Record<number, string>;
  }[];
}

// Hook that provides derived state and selectors
export function useStorylineStateGetters(state: StorylineStateValues) {
  // We could add computed/derived state here
  // These are functions or values computed from the raw state
  
  // Example of a derived state value:
  const hasActiveStorylines = state.activeStorylines.length > 0;
  const hasCompletedStorylines = state.completedStorylines.length > 0;
  const hasEventsInQueue = state.storyQueue.length > 0;
  
  return {
    hasActiveStorylines,
    hasCompletedStorylines,
    hasEventsInQueue,
    
    // Example of a state selector:
    // getStorylineById: (storylineId: string) => {
    //   return state.activeStorylines.find(s => s.storylineId === storylineId);
    // }
  };
}
