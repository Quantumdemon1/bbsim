
// Fix the error in the previous file
import { StoryEvent } from '../types';
import { 
  createDiaryRoomEvent, 
  createSocialEvent
} from '../generators';
import { GamePhase } from '@/types/gameTypes';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { Alliance } from '@/contexts/types';

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

/**
 * Creates a social interaction event with another player
 */
export function triggerSocialEvent(
  targetPlayerId: string,
  players: PlayerData[],
  dayEvents: string[],
  storyQueue: StoryEvent[],
  useAction: () => boolean,
  setStoryQueue: (queue: StoryEvent[]) => void,
  setDayEvents: (events: string[]) => void,
  alliances: Alliance[] = []
): boolean {
  // Ensure useAction is a function before calling it
  if (typeof useAction !== 'function') {
    console.error('useAction is not a function', useAction);
    return false;
  }
  
  // Costs an action point
  if (!useAction()) return false;
  
  const targetPlayer = players.find(p => p.id === targetPlayerId);
  if (!targetPlayer) return false;
  
  // Get relationship with target player
  const relationship = targetPlayer.relationships?.find(r => 
    r.playerId === targetPlayerId
  )?.type || 'Neutral';
  
  const socialEvent = createSocialEvent(targetPlayer, relationship, alliances);
  
  const newQueue = [...storyQueue, socialEvent];
  setStoryQueue(newQueue);
  
  const newDayEvents = [...dayEvents, `social_${targetPlayerId}`];
  setDayEvents(newDayEvents);
  
  return true;
}
