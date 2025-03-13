
import { useState } from 'react';
import { StoryEvent } from '../types';
import { useStorylineStateSetters } from './useStorylineStateSetters';
import { useStorylineStateGetters } from './useStorylineStateGetters';

export function useStorylineState() {
  // Core state variables
  const [currentStoryEvent, setCurrentStoryEvent] = useState<StoryEvent | null>(null);
  const [storyEventOpen, setStoryEventOpen] = useState(false);
  const [storyQueue, setStoryQueue] = useState<StoryEvent[]>([]);
  const [dayEvents, setDayEvents] = useState<string[]>([]);
  const [playerMood, setPlayerMood] = useState<string>('neutral');
  const [completedStorylines, setCompletedStorylines] = useState<string[]>([]);
  const [activeStorylines, setActiveStorylines] = useState<{
    storylineId: string;
    currentSequence: number;
    choices: Record<number, string>;
  }[]>([]);

  // Get all setters
  const setters = useStorylineStateSetters({
    setCurrentStoryEvent,
    setStoryEventOpen,
    setStoryQueue,
    setDayEvents,
    setPlayerMood,
    setCompletedStorylines,
    setActiveStorylines
  });

  // Get all getters/selectors (derived state)
  const getters = useStorylineStateGetters({
    currentStoryEvent,
    storyEventOpen,
    storyQueue,
    dayEvents,
    playerMood,
    completedStorylines,
    activeStorylines
  });

  return {
    // Raw state
    currentStoryEvent,
    storyEventOpen,
    storyQueue,
    dayEvents,
    playerMood,
    completedStorylines,
    activeStorylines,
    
    // Setters
    ...setters,
    
    // Getters/selectors
    ...getters
  };
}
