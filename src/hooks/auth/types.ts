
import { PlayerData } from '@/components/PlayerProfileTypes';

export interface AuthState {
  isAuthenticated: boolean;
  currentPlayer: PlayerData | null;
  isGuest: boolean;
  isAdmin?: boolean; // Add this new property
  friends: string[];
  notifications: Notification[];
  settings: PlayerSettings;
}

export interface Notification {
  id: string;
  type: 'friend_request' | 'game_invite' | 'system_message';
  message: string;
  from?: string;
  timestamp: number;
  read: boolean;
}

export interface PlayerSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  privacy: 'public' | 'friends' | 'private';
  autoDeclineInvites: boolean;
}
