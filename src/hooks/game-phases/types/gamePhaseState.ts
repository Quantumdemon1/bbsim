
import { PlayerData } from '@/components/PlayerProfileTypes';
import { WeekSummary } from './weekSummary';

export interface GamePhaseState {
  week: number;
  phase: string;
  players: PlayerData[];
  nominees: string[];
  hoh: string | null;
  veto: string | null;
  vetoUsed: boolean;
  lastHoH: string | null;
  statusMessage: string;
  selectedPlayers: string[];
  finalists?: string[];
  jurors?: string[];
  votes?: Record<string, string>;
  weekSummaries?: WeekSummary[];
}

// Add AIMemoryEntry type
export interface AIMemoryEntry {
  type: 'nomination' | 'veto' | 'eviction' | 'hoh' | 'alliance' | 'betrayal' | 
        'conversation' | 'competition_win' | 'competition_loss' | 'argument' | 
        'celebration' | 'strategy_discussion' | 'private_conversation' | 
        'random_event' | 'player_decision';
  week: number;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  importance: number;
  timestamp: number | string;
}

// Add BotEmotions type
export type BotEmotions = Record<string, string>;
