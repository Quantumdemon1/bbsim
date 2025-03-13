
import { useCallback, useMemo } from 'react';
import { StoryEvent } from '../types';
import { getCategoryForEventType } from '../constants/eventCategories';
import { GamePhase } from '@/types/gameTypes';

type SortMethod = 'priority' | 'phase' | 'category' | 'sequence';

/**
 * Hook for sorting and prioritizing events
 */
export function useEventSorting() {
  // Sort events by priority (impact or importance)
  const sortByPriority = useCallback((events: StoryEvent[]) => {
    return [...events].sort((a, b) => {
      // Calculate priority score
      const getPriority = (event: StoryEvent) => {
        const categoryPriority = getCategoryForEventType(event.type).defaultPriority;
        const eventPriority = typeof event.impact === 'number' 
          ? Math.abs(event.impact) * 2 
          : 0;
        const choiceImportance = Math.max(
          ...((event.options || []).map(opt => opt.memoryImportance || 0))
        );
        
        return categoryPriority + eventPriority + choiceImportance;
      };

      return getPriority(b) - getPriority(a); // Descending order
    });
  }, []);

  // Sort events by phase relevance
  const sortByPhase = useCallback((events: StoryEvent[], currentPhase: GamePhase) => {
    return [...events].sort((a, b) => {
      const aRelevance = a.frequency?.find(f => f.phase === currentPhase)?.probability || 0;
      const bRelevance = b.frequency?.find(f => f.phase === currentPhase)?.probability || 0;
      
      return bRelevance - aRelevance; // Descending order
    });
  }, []);

  // Sort events by category
  const sortByCategory = useCallback((events: StoryEvent[], categoryOrder?: string[]) => {
    const order = categoryOrder || ['twist', 'competition', 'alliance', 'strategy', 'social', 'diary'];
    
    return [...events].sort((a, b) => {
      const aCategory = getCategoryForEventType(a.type).id;
      const bCategory = getCategoryForEventType(b.type).id;
      
      return order.indexOf(aCategory) - order.indexOf(bCategory);
    });
  }, []);

  // Sort events by storyline sequence
  const sortBySequence = useCallback((events: StoryEvent[]) => {
    return [...events].sort((a, b) => {
      // Group by storyline first
      if (a.storylineId !== b.storylineId) {
        return (a.storylineId || '').localeCompare(b.storylineId || '');
      }
      
      // Then by sequence number
      return (a.sequence || 0) - (b.sequence || 0);
    });
  }, []);

  // Smart sorting that combines multiple methods
  const smartSort = useCallback((
    events: StoryEvent[], 
    currentPhase: GamePhase,
    activeStorylines: { storylineId: string }[] = []
  ) => {
    // Clone the events to avoid mutation
    const sortedEvents = [...events];
    
    // First prioritize continuing active storylines
    sortedEvents.sort((a, b) => {
      const aIsActive = a.storylineId && activeStorylines.some(s => s.storylineId === a.storylineId);
      const bIsActive = b.storylineId && activeStorylines.some(s => s.storylineId === b.storylineId);
      
      if (aIsActive && !bIsActive) return -1;
      if (!aIsActive && bIsActive) return 1;
      return 0;
    });
    
    // Then apply regular priority sorting for events with same active status
    const activeEvents = sortedEvents.filter(e => 
      e.storylineId && activeStorylines.some(s => s.storylineId === e.storylineId)
    );
    
    const normalEvents = sortedEvents.filter(e => 
      !e.storylineId || !activeStorylines.some(s => s.storylineId === e.storylineId)
    );
    
    const sortedActiveEvents = sortBySequence(activeEvents);
    const sortedNormalEvents = sortByPriority(
      sortByPhase(normalEvents, currentPhase)
    );
    
    return [...sortedActiveEvents, ...sortedNormalEvents];
  }, [sortByPriority, sortByPhase, sortBySequence]);

  return {
    sortByPriority,
    sortByPhase,
    sortByCategory,
    sortBySequence,
    smartSort
  };
}
