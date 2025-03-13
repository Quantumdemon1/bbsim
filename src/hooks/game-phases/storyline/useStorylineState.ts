
import { useState } from 'react';
import { StoryEvent, StorylineState } from './types';

export function useStorylineState() {
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

  return {
    currentStoryEvent,
    storyEventOpen,
    storyQueue,
    dayEvents,
    playerMood,
    completedStorylines,
    activeStorylines,
    setCurrentStoryEvent,
    setStoryEventOpen,
    setStoryQueue,
    setDayEvents,
    setPlayerMood,
    setCompletedStorylines,
    setActiveStorylines
  };
}
