
import { useState, useEffect } from 'react';
import { StoryEvent, StorylineState } from './types';
import { GamePhase } from '@/types/gameTypes';

export function useStorylineState(): StorylineState & {
  setCurrentStoryEvent: (event: StoryEvent | null) => void;
  setStoryEventOpen: (open: boolean) => void;
  setStoryQueue: (queue: StoryEvent[]) => void;
  setDayEvents: (events: string[]) => void;
  setPlayerMood: (mood: string) => void;
} {
  const [currentStoryEvent, setCurrentStoryEvent] = useState<StoryEvent | null>(null);
  const [storyEventOpen, setStoryEventOpen] = useState(false);
  const [storyQueue, setStoryQueue] = useState<StoryEvent[]>([]);
  const [dayEvents, setDayEvents] = useState<string[]>([]);
  const [playerMood, setPlayerMood] = useState<string>('neutral');
  
  return {
    currentStoryEvent,
    storyEventOpen,
    storyQueue,
    dayEvents,
    playerMood,
    setCurrentStoryEvent,
    setStoryEventOpen,
    setStoryQueue,
    setDayEvents,
    setPlayerMood
  };
}
