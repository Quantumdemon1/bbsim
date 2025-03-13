
import { GamePhase } from '@/types/gameTypes';

export interface StoryEvent {
  id: string;
  title: string;
  description: string;
  type: 'competition' | 'social' | 'twist' | 'diary' | 'alliance';
  options?: {
    id: string;
    text: string;
    consequence: string;
    nextEventId?: string; // For branching storylines
    relationshipEffect?: number; // Effect on relationship (-5 to 5)
    memoryImportance?: number; // How memorable this choice is (1-10)
  }[];
  impact?: number; // How much this event impacts game (-5 to 5)
  requires?: {
    phase?: string;
    playerId?: string;
    relationship?: string;
    previousEventId?: string; // For multi-stage events
    previousChoice?: string; // Which choice led to this event
    minDay?: number; // Minimum day required
    maxDay?: number; // Maximum day allowed
  };
  frequency?: {
    phase: GamePhase;
    probability: number; // 0-1 probability of occurrence in this phase
  }[];
  storylineId?: string; // Group events in a storyline
  sequence?: number; // Position in a multi-stage storyline
  personalityTags?: string[]; // Which personality types this event is best for
  isComplete?: boolean; // Whether this storyline branch is complete
}

export interface StorylineState {
  currentStoryEvent: StoryEvent | null;
  storyEventOpen: boolean;
  storyQueue: StoryEvent[];
  dayEvents: string[];
  playerMood: string;
  completedStorylines: string[]; // Track completed storylines
  activeStorylines: {
    storylineId: string;
    currentSequence: number;
    choices: Record<number, string>; // Map of sequence to choice made
  }[];
}

export interface StorylineActions {
  setStoryEventOpen: (open: boolean) => void;
  triggerDiaryRoomEvent: () => boolean;
  triggerSocialEvent: (targetPlayerId: string) => boolean;
  handleStoryChoice: (eventId: string, choiceId: string) => void;
  generateRandomEvent: () => boolean;
  startStoryline: (storylineId: string) => boolean;
}
