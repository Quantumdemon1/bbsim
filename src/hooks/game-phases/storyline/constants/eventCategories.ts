
import { EventCategoryMetadata } from "../types/eventCategories";

/**
 * Definitions for event categories with metadata
 */
export const EVENT_CATEGORIES: Record<string, EventCategoryMetadata> = {
  social: {
    id: 'social',
    label: 'Social',
    description: 'Interactions with other houseguests',
    color: 'blue',
    icon: 'users',
    defaultPriority: 7,
    recommendedPhases: ['HoH Competition', 'Nomination Ceremony', 'PoV Competition', 'Veto Ceremony', 'Eviction Voting']
  },
  competition: {
    id: 'competition',
    label: 'Competition',
    description: 'Events related to game competitions',
    color: 'red',
    icon: 'trophy',
    defaultPriority: 9,
    recommendedPhases: ['HoH Competition', 'PoV Competition']
  },
  strategy: {
    id: 'strategy',
    label: 'Strategy',
    description: 'Strategic game decisions and planning',
    color: 'purple',
    icon: 'brain',
    defaultPriority: 8,
    recommendedPhases: ['Nomination Ceremony', 'Veto Ceremony', 'Eviction Voting']
  },
  alliance: {
    id: 'alliance',
    label: 'Alliance',
    description: 'Alliance formation and management',
    color: 'green',
    icon: 'handshake',
    defaultPriority: 8,
    recommendedPhases: ['Nomination Ceremony', 'Eviction Voting']
  },
  twist: {
    id: 'twist',
    label: 'Twist',
    description: 'Unexpected game twists and turns',
    color: 'amber',
    icon: 'sparkles',
    defaultPriority: 10,
    recommendedPhases: ['HoH Competition', 'Nomination Ceremony', 'PoV Competition', 'Veto Ceremony', 'Eviction Voting']
  },
  diary: {
    id: 'diary',
    label: 'Diary Room',
    description: 'Personal reflections and confessions',
    color: 'indigo',
    icon: 'book',
    defaultPriority: 6,
    recommendedPhases: ['Nomination Ceremony', 'Eviction Voting']
  }
};

/**
 * Event category mapping for existing event types
 */
export const EVENT_TYPE_TO_CATEGORY: Record<string, string> = {
  'social': 'social',
  'competition': 'competition',
  'twist': 'twist',
  'diary': 'diary',
  'alliance': 'alliance',
  'strategy': 'strategy'
  // Map any other existing event types to categories
};

/**
 * Get category metadata for an event type
 */
export function getCategoryForEventType(eventType: string): EventCategoryMetadata {
  const categoryId = EVENT_TYPE_TO_CATEGORY[eventType] || 'social';
  return EVENT_CATEGORIES[categoryId];
}
