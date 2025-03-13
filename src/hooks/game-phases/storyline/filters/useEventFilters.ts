
import { useState, useCallback, useMemo } from 'react';
import { StoryEvent } from '../types';
import { 
  EventCategory, 
  EventFilterOptions, 
  CategoryOption 
} from '../types/eventCategories';
import { EVENT_CATEGORIES, getCategoryForEventType } from '../constants/eventCategories';
import { GamePhase } from '@/types/gameTypes';

/**
 * Hook for filtering storyline events by various criteria
 */
export function useEventFilters() {
  // Filter state
  const [activeFilters, setActiveFilters] = useState<EventFilterOptions>({
    categories: Object.keys(EVENT_CATEGORIES) as EventCategory[],
    minPriority: 0,
    excludeCompleted: false
  });

  // Category options with selection state
  const categoryOptions = useMemo<CategoryOption[]>(() => {
    return Object.values(EVENT_CATEGORIES).map(category => ({
      ...category,
      selected: activeFilters.categories?.includes(category.id as EventCategory) || false
    }));
  }, [activeFilters.categories]);

  // Toggle a category filter
  const toggleCategory = useCallback((categoryId: EventCategory) => {
    setActiveFilters(prev => {
      const categories = prev.categories || [];
      if (categories.includes(categoryId)) {
        return {
          ...prev,
          categories: categories.filter(id => id !== categoryId)
        };
      } else {
        return {
          ...prev,
          categories: [...categories, categoryId]
        };
      }
    });
  }, []);

  // Set priority filter
  const setPriorityFilter = useCallback((min: number, max?: number) => {
    setActiveFilters(prev => ({
      ...prev,
      minPriority: min,
      maxPriority: max
    }));
  }, []);

  // Filter events by phase
  const setPhaseFilter = useCallback((phases: GamePhase[]) => {
    setActiveFilters(prev => ({
      ...prev,
      phases
    }));
  }, []);

  // Toggle completed storylines filter
  const toggleCompletedFilter = useCallback(() => {
    setActiveFilters(prev => ({
      ...prev,
      excludeCompleted: !prev.excludeCompleted
    }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setActiveFilters({
      categories: Object.keys(EVENT_CATEGORIES) as EventCategory[],
      minPriority: 0,
      excludeCompleted: false
    });
  }, []);

  // Filter events based on active filters
  const filterEvents = useCallback((events: StoryEvent[]) => {
    return events.filter(event => {
      // Filter by category
      if (activeFilters.categories && activeFilters.categories.length > 0) {
        const eventCategory = getCategoryForEventType(event.type);
        if (!activeFilters.categories.includes(eventCategory.id as EventCategory)) {
          return false;
        }
      }

      // Filter by priority (using impact or memoryImportance as priority proxy)
      if (activeFilters.minPriority !== undefined) {
        const priority = typeof event.impact === 'number' 
          ? Math.abs(event.impact) 
          : event.options?.[0]?.memoryImportance || 0;
          
        if (priority < activeFilters.minPriority) {
          return false;
        }
        
        if (activeFilters.maxPriority !== undefined && priority > activeFilters.maxPriority) {
          return false;
        }
      }

      // Filter by phase
      if (activeFilters.phases && activeFilters.phases.length > 0) {
        const eventPhases = event.frequency?.map(f => f.phase) || [];
        if (!eventPhases.some(phase => activeFilters.phases?.includes(phase))) {
          return false;
        }
      }

      // Filter by player ID
      if (activeFilters.playerIds && activeFilters.playerIds.length > 0) {
        if (!event.requires?.playerId || 
            !activeFilters.playerIds.includes(event.requires.playerId)) {
          return false;
        }
      }

      // Filter by completion status
      if (activeFilters.excludeCompleted && event.isComplete) {
        return false;
      }

      return true;
    }).slice(0, activeFilters.limit || events.length);
  }, [activeFilters]);

  return {
    activeFilters,
    categoryOptions,
    toggleCategory,
    setPriorityFilter,
    setPhaseFilter,
    toggleCompletedFilter,
    resetFilters,
    filterEvents
  };
}
