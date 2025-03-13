
import { StoryEvent } from '../types';
import { generateStorylineEvent } from '../generators';
import { PlayerData } from '@/components/PlayerProfileTypes';

/**
 * Presents the next event from the queue
 */
export function presentNextEvent(
  storyQueue: StoryEvent[],
  currentStoryEvent: StoryEvent | null,
  setCurrentStoryEvent: (event: StoryEvent | null) => void,
  setStoryEventOpen: (open: boolean) => void,
  setStoryQueue: (queue: StoryEvent[]) => void
): void {
  if (storyQueue.length > 0 && !currentStoryEvent) {
    const nextEvent = storyQueue[0];
    setCurrentStoryEvent(nextEvent);
    setStoryEventOpen(true);
    
    // Remove from queue
    const newQueue = storyQueue.slice(1);
    setStoryQueue(newQueue);
  }
}

/**
 * Starts a new storyline
 */
export function startStoryline(
  storylineId: string,
  players: PlayerData[],
  state: {
    activeStorylines: {
      storylineId: string;
      currentSequence: number;
      choices: Record<number, string>;
    }[],
    completedStorylines: string[],
    storyQueue: StoryEvent[]
  },
  setters: {
    setStoryQueue: (queue: StoryEvent[]) => void,
    setActiveStorylines: (storylines: {
      storylineId: string;
      currentSequence: number;
      choices: Record<number, string>;
    }[]) => void
  }
): boolean {
  // Check if already active or completed
  if (
    state.activeStorylines.some(s => s.storylineId === storylineId) ||
    state.completedStorylines.includes(storylineId)
  ) {
    return false;
  }
  
  // Generate the first event in the storyline
  const firstEvent = generateStorylineEvent(storylineId, 1, {}, players);
  if (!firstEvent) return false;
  
  // Add to queue
  const newQueue = [...state.storyQueue, firstEvent];
  setters.setStoryQueue(newQueue);
  
  // Add to active storylines
  const newActiveStorylines = [
    ...state.activeStorylines,
    {
      storylineId,
      currentSequence: 1,
      choices: {}
    }
  ];
  setters.setActiveStorylines(newActiveStorylines);
  
  return true;
}
