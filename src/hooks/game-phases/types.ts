export interface GamePhaseProps {
  players: PlayerData[];
  week: number;
  initialPhase?: string;
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

export interface UseNominationPhaseResult {
  handleNominate: () => void;
}

export interface UseVetoPhaseResult {
  handleVetoAction: (action: string) => void;
}
