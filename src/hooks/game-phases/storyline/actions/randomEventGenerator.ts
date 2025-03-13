
// Update import paths to new location
import { StoryEvent } from '../types';
import { generateRandomGameEvent, generateStorylineEvent } from '../generators';
import { GamePhase } from '@/types/gameTypes';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { Alliance } from '@/contexts/types';

/**
 * Generate random house events based on game state
 */
export function generateRandomEvent(
  context: {
    actionsRemaining: number,
    useAction: () => boolean,
    players: PlayerData[],
    currentPhase: GamePhase,
    dayCount: number,
    playerMood: string,
    alliances: Alliance[],
    nominees: string[],
    hoh: string | null
  },
  state: {
    dayEvents: string[],
    storyQueue: StoryEvent[],
    activeStorylines: {
      storylineId: string;
      currentSequence: number;
      choices: Record<number, string>;
    }[],
    completedStorylines: string[]
  },
  setters: {
    setStoryQueue: (queue: StoryEvent[]) => void,
    setDayEvents: (events: string[]) => void
  },
  startStoryline: (storylineId: string) => boolean
): boolean {
  // Ensure useAction is a function before calling it
  if (typeof context.useAction !== 'function') {
    console.error('useAction is not a function', context.useAction);
    return false;
  }
  
  // Limit random events based on actions
  if (context.actionsRemaining < 2 || state.dayEvents.length > 3) return false;
  
  // Check active storylines first (priority)
  const storylinesToProgress = state.activeStorylines.filter(s => {
    // Don't progress more than one stage per day
    return !state.dayEvents.includes(`storyline_${s.storylineId}`);
  });
  
  if (storylinesToProgress.length > 0) {
    // Random chance to progress a storyline (50%)
    if (Math.random() < 0.5) {
      const randomStoryline = storylinesToProgress[
        Math.floor(Math.random() * storylinesToProgress.length)
      ];
      
      const nextEvent = generateStorylineEvent(
        randomStoryline.storylineId,
        randomStoryline.currentSequence,
        randomStoryline.choices,
        context.players
      );
      
      if (nextEvent) {
        // Use an action
        if (!context.useAction()) return false;
        
        // Add to queue
        const newQueue = [...state.storyQueue, nextEvent];
        setters.setStoryQueue(newQueue);
        
        const newDayEvents = [...state.dayEvents, `storyline_${randomStoryline.storylineId}`];
        setters.setDayEvents(newDayEvents);
        
        return true;
      }
    }
  }
  
  // Chance to start a new storyline if none active (15%)
  if (state.activeStorylines.length === 0 && Math.random() < 0.15) {
    const storylineOptions = ['alliance_betrayal', 'power_struggle', 'secret_mission'];
    const availableStorylines = storylineOptions.filter(s => !state.completedStorylines.includes(s));
    
    if (availableStorylines.length > 0) {
      const newStorylineId = availableStorylines[
        Math.floor(Math.random() * availableStorylines.length)
      ];
      
      if (startStoryline(newStorylineId)) {
        if (!context.useAction()) return false;
        
        const newDayEvents = [...state.dayEvents, `storyline_${newStorylineId}`];
        setters.setDayEvents(newDayEvents);
        
        return true;
      }
    }
  }
  
  // 15% chance of a regular random event if no storyline progressed
  if (Math.random() > 0.15) return false;
  
  // Use an action only if useAction is a function
  if (!context.useAction()) return false;
  
  const newEvent = generateRandomGameEvent(
    context.players, 
    context.currentPhase, 
    context.dayCount, 
    context.playerMood, 
    context.alliances, 
    context.nominees, 
    context.hoh
  );
  
  if (!newEvent) return false;
  
  // Add to queue
  const newQueue = [...state.storyQueue, newEvent];
  setters.setStoryQueue(newQueue);
  
  const newDayEvents = [...state.dayEvents, newEvent.type];
  setters.setDayEvents(newDayEvents);
  
  return true;
}
