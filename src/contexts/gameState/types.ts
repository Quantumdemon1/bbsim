
import { PlayerData } from '@/components/PlayerProfileTypes';
import { GameNotification } from '@/types/gameTypes';

export interface GameStateContextType {
  gameId: string | null;
  isHost: boolean;
  playerName: string;
  setPlayerName: (name: string) => void;
  gameState: 'idle' | 'lobby' | 'playing' | 'ended';
  currentWeek: number;
  setCurrentWeek: (week: number) => void;
  createGame: (hostName: string) => void;
  joinGame: (gameId: string, playerName: string) => void;
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  gameMode: 'singleplayer' | 'multiplayer' | null;
  humanPlayers: PlayerData[];
  countdownTimer: number | null;
  createSinglePlayerGame: (bypassAuth?: boolean) => boolean;
  createMultiplayerGame: (hostName: string) => boolean;
  joinMultiplayerGame: (gameId: string, playerName: string) => boolean;
  adminTakeControl: (phaseToSkipTo?: string) => void;
  isAdminControl: boolean;
  loginAsAdmin: () => void;
  
  phaseProgress: Record<string, { playersReady: string[], completed: boolean }>;
  phaseCountdown: number | null;
  markPhaseProgress: (phase: string, playerId: string) => void;
  getPhaseProgress: (phase: string) => { 
    playersReady: string[]; 
    completed: boolean;
    completedCount: number;
    totalCount: number;
    percentage: number;
    hasStartedCountdown: boolean;
  } | null;
  startPhaseCountdown: (seconds: number) => void;
  clearPhaseProgress: (phase: string) => void;
  
  // Add notification properties
  notifications?: GameNotification[];
  clearNotifications?: () => void;
  markNotificationAsRead?: (notificationId: string) => void;
  
  saveCurrentGame: () => Promise<void>;
  loadGame: (gameId: string) => Promise<boolean>;
  savedGames: any[];
  deleteSavedGame: (gameId: string) => Promise<boolean>;
  isLoadingSave: boolean;
}
