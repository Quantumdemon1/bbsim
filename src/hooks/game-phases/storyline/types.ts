
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
  }[];
  impact?: number; // How much this event impacts game (-5 to 5)
  requires?: {
    phase?: string;
    playerId?: string;
    relationship?: string;
  };
}

export interface StorylineState {
  currentStoryEvent: StoryEvent | null;
  storyEventOpen: boolean;
  storyQueue: StoryEvent[];
  dayEvents: string[];
  playerMood: string;
}

export interface StorylineActions {
  setStoryEventOpen: (open: boolean) => void;
  triggerDiaryRoomEvent: () => boolean;
  triggerSocialEvent: (targetPlayerId: string) => boolean;
  handleStoryChoice: (eventId: string, choiceId: string) => void;
  generateRandomEvent: () => boolean;
}
