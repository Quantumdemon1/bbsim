
import { PlayerData } from '@/components/PlayerProfileTypes';

export type AuthState = {
  isAuthenticated: boolean;
  currentPlayer: PlayerData | null;
  isGuest: boolean;
  friends: string[];
  notifications: Notification[];
  settings: PlayerSettings;
}

export type Notification = {
  id: string;
  type: 'friend_request' | 'game_invite' | 'system_message';
  message: string;
  from?: string;
  timestamp: number;
  read: boolean;
}

export type PlayerSettings = {
  theme: 'light' | 'dark';
  notifications: boolean;
  privacy: 'public' | 'friends' | 'private';
  autoDeclineInvites: boolean;
}

export const defaultSettings: PlayerSettings = {
  theme: 'dark',
  notifications: true,
  privacy: 'public',
  autoDeclineInvites: false
};
