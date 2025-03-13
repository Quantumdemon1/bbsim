
import { GamePhase } from "@/types/gameTypes";

/**
 * Event category types for storyline filtering and organization
 */
export type EventCategory = 'social' | 'competition' | 'strategy' | 'alliance' | 'twist' | 'diary';

/**
 * Category metadata for displaying and filtering events
 */
export interface EventCategoryMetadata {
  id: EventCategory;
  label: string;
  description: string;
  color: string;
  icon: string;  // Icon identifier for UI
  defaultPriority: number; // 1-10 scale, higher is more important
  recommendedPhases: GamePhase[]; // Phases where this category is most relevant
}

/**
 * Event filtering options
 */
export interface EventFilterOptions {
  categories?: EventCategory[];
  minPriority?: number;
  maxPriority?: number;
  phases?: GamePhase[];
  playerIds?: string[];
  excludeCompleted?: boolean;
  limit?: number;
}

/**
 * Category options with selection state for UI
 */
export interface CategoryOption extends EventCategoryMetadata {
  selected: boolean;
}
