
import { StoryEvent } from '../types';
import { createDiaryRoomEvent } from '../generators';
import { GamePhase } from '@/types/gameTypes';

/**
 * Creates a diary room event
 */
export function triggerDiaryRoomEvent(
  currentPhase: GamePhase,
  dayEvents: string[],
  storyQueue: StoryEvent[],
  useAction: () => boolean,
  setStoryQueue: (queue: StoryEvent[]) => void,
  setDayEvents: (events: string[]) => void
): boolean {
  // Only allow diary room once per day
  if (dayEvents.includes('diary')) return false;
  
  // Ensure useAction is a function before calling it
  if (typeof useAction !== 'function') {
    console.error('useAction is not a function', useAction);
    return false;
  }
  
  // Costs an action point
  if (!useAction()) return false;
  
  const diaryEvent = createDiaryRoomEvent(currentPhase);
  
  const newQueue = [...storyQueue, diaryEvent];
  setStoryQueue(newQueue);
  
  const newDayEvents = [...dayEvents, 'diary'];
  setDayEvents(newDayEvents);
  
  return true;
}
