
/**
 * Core game type definitions
 */

// Game phases
export type GamePhase = 
  | 'HoH Competition'
  | 'Nomination Ceremony'
  | 'PoV Competition'
  | 'Veto Ceremony'
  | 'Eviction Voting'
  | 'Eviction'
  | 'Weekly Summary'
  | 'Special Competition'
  | 'Jury Questions'
  | 'Jury Voting'
  | 'Finale';

// Game states
export type GameState = 'idle' | 'lobby' | 'playing' | 'ended';

// Game modes
export type GameMode = 'singleplayer' | 'multiplayer' | null;

// Notification type
export interface GameNotification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: number;
  read: boolean;
}

// Error state interface for handling game errors
export interface GameError {
  code: string;
  message: string;
  context?: Record<string, any>;
}
