
import { useEffect } from 'react';
import { GamePhase } from '@/types/gameTypes';
import { StoryEvent } from '../types';

interface PlayerStorylineEffectsProps {
  currentPhase: GamePhase;
  dayCount: number;
  actionsRemaining: number;
  dayEvents: string[];
  storyEventOpen: boolean;
  currentStoryEvent: StoryEvent | null;
  activeStorylines: {
    storylineId: string;
    currentSequence: number;
    choices: Record<number, string>;
  }[];
  setDayEvents: (events: string[]) => void;
  presentNextEvent: () => void;
  generateRandomEvent: () => boolean;
  startStoryline: (storylineId: string) => boolean;
}

/**
 * Hook containing all the side effects for the player storyline manager
 */
export function usePlayerStorylineEffects({
  currentPhase,
  dayCount,
  actionsRemaining,
  dayEvents,
  storyEventOpen,
  currentStoryEvent,
  activeStorylines,
  setDayEvents,
  presentNextEvent,
  generateRandomEvent,
  startStoryline
}: PlayerStorylineEffectsProps) {
  // Clear day events when day changes
  useEffect(() => {
    setDayEvents([]);
  }, [dayCount, setDayEvents]);

  // Present next event when conditions are right
  useEffect(() => {
    if (!storyEventOpen && !currentStoryEvent) {
      presentNextEvent();
    }
  }, [storyEventOpen, currentStoryEvent, presentNextEvent]);

  // Phase-specific event generation
  useEffect(() => {
    // Adjust event probability based on phase
    // More important phases have higher chances of events
    let eventProbability = 0.1; // base probability
    
    switch (currentPhase) {
      case 'HoH Competition':
        eventProbability = 0.15;
        break;
      case 'Nomination Ceremony':
        eventProbability = 0.25;
        break;
      case 'PoV Competition':
        eventProbability = 0.15;
        break;
      case 'Veto Ceremony':
        eventProbability = 0.25;
        break;
      case 'Eviction Voting':
        eventProbability = 0.35;
        break;
    }
    
    // Random chance to generate event when phase changes
    if (Math.random() < eventProbability) {
      // Small delay to not overwhelm the player
      setTimeout(() => {
        generateRandomEvent();
      }, 2000);
    }
  }, [currentPhase, generateRandomEvent]);

  // Check for active storylines that need advancing
  useEffect(() => {
    // Every day, give a small chance to progress active storylines
    if (activeStorylines.length > 0 && Math.random() < 0.2) {
      // Try to progress a random active storyline
      const randomStoryline = activeStorylines[
        Math.floor(Math.random() * activeStorylines.length)
      ];
      
      if (randomStoryline && !dayEvents.includes(`storyline_${randomStoryline.storylineId}`)) {
        // Use startStoryline to advance it if we have actions available
        if (actionsRemaining > 1) {
          startStoryline(randomStoryline.storylineId);
        }
      }
    }
  }, [dayCount, activeStorylines, startStoryline, dayEvents, actionsRemaining]);
}
