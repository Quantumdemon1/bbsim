
import { useEffect } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import { useEventDecisionManager } from './decisions/useEventDecisionManager';
import { useStorylineState } from './storyline/useStorylineState';
import { useStorylineActions } from './storyline/useStorylineActions';
import { StoryEvent } from './storyline/types';
import { useAllianceContext } from '../gameContext/useAllianceContext';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { GamePhaseState } from './types';

export type { StoryEvent } from './storyline/types';

export function usePlayerStorylineManager() {
  // Get game context and explicitly type it to include required properties
  const gameContext = useGameContext();
  
  // Extract common properties from gameContext
  const { 
    players, 
    currentWeek,
    addMemoryEntry,
    alliances
  } = gameContext;
  
  // Safely extract properties that might not be directly available in all useGameContext implementations
  // by using type assertion to a more specific type that includes these properties
  const gamePhaseContext = gameContext as unknown as {
    currentPhase: string;
    dayCount: number;
    actionsRemaining: number;
    useAction: () => boolean;
    nominees: string[];
    hoh: string | null;
    veto: string | null;
  } & typeof gameContext;

  const { 
    currentPhase, 
    dayCount, 
    actionsRemaining, 
    useAction,
    nominees,
    hoh,
    veto
  } = gamePhaseContext;
  
  // Get decision manager to use its mechanism
  const { 
    presentDecision, 
    handleDecisionMade, 
    currentEvent 
  } = useEventDecisionManager();
  
  // Use our storyline state hook with updated interface
  const storyState = useStorylineState();
  
  // Get state and setters for passing to actions hook
  const { 
    currentStoryEvent, storyEventOpen, storyQueue, dayEvents, playerMood,
    completedStorylines, activeStorylines,
    setCurrentStoryEvent, setStoryEventOpen, setStoryQueue, setDayEvents, 
    setPlayerMood, setCompletedStorylines, setActiveStorylines
  } = storyState;
  
  // Use our storyline actions hook with enhanced interface
  const storyActions = useStorylineActions(
    { 
      currentStoryEvent, 
      storyEventOpen, 
      storyQueue, 
      dayEvents, 
      playerMood,
      completedStorylines,
      activeStorylines
    },
    { 
      setCurrentStoryEvent, 
      setStoryEventOpen, 
      setStoryQueue, 
      setDayEvents, 
      setPlayerMood,
      setCompletedStorylines,
      setActiveStorylines
    },
    { 
      currentPhase, 
      dayCount, 
      actionsRemaining, 
      players, 
      currentWeek, 
      useAction, 
      addMemoryEntry,
      alliances,
      nominees,
      hoh
    }
  );
  
  // Get all the action methods
  const { 
    presentNextEvent, 
    triggerDiaryRoomEvent, 
    triggerSocialEvent, 
    handleStoryChoice, 
    generateRandomEvent,
    startStoryline
  } = storyActions;

  // Clear day events when day changes
  useEffect(() => {
    setDayEvents([]);
  }, [dayCount, setDayEvents]);

  // Present next event when conditions are right
  useEffect(() => {
    if (!storyEventOpen && !currentEvent) {
      presentNextEvent();
    }
  }, [storyEventOpen, currentEvent, presentNextEvent]);

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

  // Return the same API as before with new additions
  return {
    currentStoryEvent,
    storyEventOpen, 
    setStoryEventOpen,
    storyQueue,
    triggerDiaryRoomEvent,
    triggerSocialEvent,
    handleStoryChoice,
    generateRandomEvent,
    startStoryline,
    playerMood,
    activeStorylines,
    completedStorylines
  };
}
