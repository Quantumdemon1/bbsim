
import { useState } from 'react';
import { GameEvent } from '../types/eventTypes';
import { EventManagerState } from './types/eventDecisionTypes';

/**
 * Hook to manage event state
 */
export function useEventManagerState(): EventManagerState & {
  setCurrentEvent: (event: GameEvent | null) => void;
  setEventModalOpen: (open: boolean) => void;
  setWeeklyEvents: (events: GameEvent[]) => void;
} {
  const [weeklyEvents, setWeeklyEvents] = useState<GameEvent[]>([]);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  
  return {
    weeklyEvents,
    eventModalOpen,
    currentEvent,
    setWeeklyEvents,
    setEventModalOpen,
    setCurrentEvent
  };
}
