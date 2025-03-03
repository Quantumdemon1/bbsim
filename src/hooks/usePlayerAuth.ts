
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useNotifications } from './auth/useNotifications';
import { useFriends } from './auth/useFriends';
import { useSettings } from './auth/useSettings';
import { useProfile } from './auth/useProfile';
import { useAuthActions } from './auth/useAuthActions';

// Re-export the types using "export type" syntax for TS modules
export type { AuthState, Notification, PlayerSettings } from './auth/types';

export function usePlayerAuth() {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    currentPlayer: PlayerData | null;
    isGuest: boolean;
    isAdmin: boolean;
    friends: string[];
    notifications: Array<{
      id: string;
      type: 'friend_request' | 'game_invite' | 'system_message';
      message: string;
      from?: string;
      timestamp: number;
      read: boolean;
    }>;
    settings: {
      theme: 'light' | 'dark';
      notifications: boolean;
      privacy: 'public' | 'friends' | 'private';
      autoDeclineInvites: boolean;
    };
  }>({
    isAuthenticated: false,
    currentPlayer: null,
    isGuest: false,
    isAdmin: false,
    friends: [],
    notifications: [],
    settings: {
      theme: 'dark',
      notifications: true,
      privacy: 'public',
      autoDeclineInvites: false
    }
  });

  // Import all the auth-related hooks
  const { addNotification, markNotificationAsRead, clearNotifications } = useNotifications(authState, setAuthState);
  const { addFriend, removeFriend } = useFriends(authState, setAuthState);
  const { updateSettings } = useSettings(authState, setAuthState);
  const { updateProfile } = useProfile(authState, setAuthState);
  const { login, register, loginAsGuest, loginAsAdmin, logout } = useAuthActions(authState, setAuthState);

  return {
    // Auth state
    isAuthenticated: authState.isAuthenticated,
    currentPlayer: authState.currentPlayer,
    isGuest: authState.isGuest,
    isAdmin: authState.isAdmin,
    
    // Auth actions
    login,
    register, 
    loginAsGuest,
    loginAsAdmin,
    logout,
    
    // Profile
    updateProfile,
    
    // Settings
    updateSettings,
    settings: authState.settings,
    
    // Friends
    addFriend,
    removeFriend,
    friends: authState.friends,
    
    // Notifications
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    notifications: authState.notifications
  };
}
