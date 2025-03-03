
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
  type: string;
  week: number;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  importance: number;
  timestamp: number;
}

// Add BotEmotions type
export type BotEmotions = Record<string, string>;
