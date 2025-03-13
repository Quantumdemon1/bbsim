
import { useMemo } from 'react';
import { usePlayerGameContext } from './player-storyline/usePlayerGameContext';
import { usePlayerStorylineState } from './player-storyline/usePlayerStorylineState';
import { useEventFilters } from './filters/useEventFilters';
import { useEventSorting } from './filters/useEventSorting';
import { useEventRecommendations } from './filters/useEventRecommendations';
import { EVENT_CATEGORIES, getCategoryForEventType } from './constants/eventCategories';
import { StoryEvent } from './types';
import { EventCategory } from './types/eventCategories';

/**
 * Main hook for the storyline event categorization and filtering system
 */
export function useStorylineEventSystem() {
  // Get game context
  const gameContext = usePlayerGameContext();
  
  // Get storyline state
  const storyState = usePlayerStorylineState();
  
  // Get event filters
  const eventFilters = useEventFilters();
  
  // Get event sorting
  const eventSorting = useEventSorting();
  
  // Get event recommendations
  const eventRecommendations = useEventRecommendations();
  
  // All available events (from queue and active storylines)
  const allEvents = useMemo(() => {
    return [...storyState.storyQueue];
  }, [storyState.storyQueue]);
  
  // Filtered events based on current filters
  const filteredEvents = useMemo(() => {
    return eventFilters.filterEvents(allEvents);
  }, [allEvents, eventFilters]);
  
  // Events sorted by priority
  const prioritizedEvents = useMemo(() => {
    return eventSorting.sortByPriority(filteredEvents);
  }, [filteredEvents, eventSorting]);
  
  // Events sorted by phase relevance
  const phaseRelevantEvents = useMemo(() => {
    return eventSorting.sortByPhase(filteredEvents, gameContext.currentPhase);
  }, [filteredEvents, eventSorting, gameContext.currentPhase]);
  
  // Events recommended based on game state
  const recommendedEvents = useMemo(() => {
    return eventRecommendations.getRecommendedEvents(
      filteredEvents,
      gameContext.currentPhase,
      gameContext.players,
      storyState.playerMood,
      gameContext.dayCount,
      gameContext.nominees,
      gameContext.hoh
    );
  }, [
    filteredEvents, 
    eventRecommendations, 
    gameContext.currentPhase,
    gameContext.players,
    storyState.playerMood,
    gameContext.dayCount,
    gameContext.nominees,
    gameContext.hoh
  ]);
  
  // Contextual events specific to player situation
  const contextualEvents = useMemo(() => {
    return eventRecommendations.getContextualEvents(
      filteredEvents,
      gameContext.players,
      gameContext.nominees,
      gameContext.hoh
    );
  }, [
    filteredEvents,
    eventRecommendations,
    gameContext.players,
    gameContext.nominees,
    gameContext.hoh
  ]);
  
  // Smart sorted events combining priority, phase, and storyline continuity
  const smartSortedEvents = useMemo(() => {
    return eventSorting.smartSort(
      filteredEvents,
      gameContext.currentPhase,
      storyState.activeStorylines
    );
  }, [
    filteredEvents,
    eventSorting,
    gameContext.currentPhase,
    storyState.activeStorylines
  ]);
  
  // Get event category metadata
  const getEventCategory = (event: StoryEvent) => {
    return getCategoryForEventType(event.type);
  };
  
  // Check if an event is in a specific category
  const isEventInCategory = (event: StoryEvent, category: EventCategory) => {
    return getEventCategory(event).id === category;
  };
  
  // Get all available categories
  const eventCategories = useMemo(() => {
    return Object.values(EVENT_CATEGORIES);
  }, []);
  
  return {
    // Event collections
    allEvents,
    filteredEvents,
    prioritizedEvents,
    phaseRelevantEvents,
    recommendedEvents,
    contextualEvents,
    smartSortedEvents,
    
    // Category information
    eventCategories,
    getEventCategory,
    isEventInCategory,
    
    // Filter controls
    ...eventFilters,
    
    // Sorting methods
    ...eventSorting,
    
    // Recommendation methods
    ...eventRecommendations
  };
}
