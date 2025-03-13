
import { StoryEvent } from '../types';

// Types for the setters
export interface StorylineStateSetters {
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
}

// Hook that provides enhanced setters with additional functionality
export function useStorylineStateSetters(setters: StorylineStateSetters) {
  // Here we could add enhanced setters that combine multiple state updates
  // or implement more complex logic before setting state

  // For now we just return the raw setters
  return {
    ...setters,
    
    // Example of an enhanced setter that could be added:
    // addToStoryQueue: (event: StoryEvent) => {
    //   setters.setStoryQueue(prev => [...prev, event]);
    // }
  };
}
