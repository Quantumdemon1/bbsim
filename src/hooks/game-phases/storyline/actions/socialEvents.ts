
import { StoryEvent } from '../types';
import { createSocialEvent } from '../generators';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { Alliance } from '@/contexts/types';

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
