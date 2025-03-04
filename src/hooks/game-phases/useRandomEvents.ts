
import { useCallback } from 'react';
import { useEventDecisionManager } from './decisions/useEventDecisionManager';
import { GameEvent } from './types/eventTypes';

// Use "export type" instead of "export" when re-exporting type definitions
export type { GameEvent } from './types/eventTypes';

export function useRandomEvents() {
  const {
    weeklyEvents,
    resetWeeklyEvents,
    triggerRandomEvent: handleRandomEvent,
    handleEventChoice: processEventChoice
  } = useEventDecisionManager();
  
  return {
    triggerRandomEvent: handleRandomEvent,
    setEventFrequency: (probability: number) => {
      // This is now handled internally in the event manager
      console.log("Event frequency set to", probability);
    },
    eventProbability: 0.3, // Default
    weeklyEvents,
    generateRandomEvent: handleRandomEvent,
    processEventChoice,
    resetWeeklyEvents
  };
}
