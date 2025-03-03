
import React, { createContext, useContext, ReactNode } from 'react';
import { usePlayerAuth, Notification, PlayerSettings } from '@/hooks/usePlayerAuth';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface PlayerAuthContextType {
  isAuthenticated: boolean;
  currentPlayer: PlayerData | null;
  isGuest: boolean;
  login: (player: PlayerData) => void;
  register: (player: PlayerData) => void;
  loginAsGuest: (guestName: string) => void;
  logout: () => void;
  updateProfile: (updatedProfile: Partial<PlayerData>) => void;
  updateSettings: (newSettings: Partial<PlayerSettings>) => void;
  addFriend: (friendId: string) => void;
  removeFriend: (friendId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  friends: string[];
  notifications: Notification[];
  settings: PlayerSettings;
}

const PlayerAuthContext = createContext<PlayerAuthContextType>({} as PlayerAuthContextType);

export const PlayerAuthProvider = ({ children }: { children: ReactNode }) => {
  const playerAuth = usePlayerAuth();

  return (
    <PlayerAuthContext.Provider
      value={{
        isAuthenticated: playerAuth.authState.isAuthenticated,
        currentPlayer: playerAuth.authState.currentPlayer,
        isGuest: playerAuth.authState.isGuest,
        login: playerAuth.login,
        register: playerAuth.register,
        loginAsGuest: playerAuth.loginAsGuest,
        logout: playerAuth.logout,
        updateProfile: playerAuth.updateProfile,
        updateSettings: playerAuth.updateSettings,
        addFriend: playerAuth.addFriend,
        removeFriend: playerAuth.removeFriend,
        addNotification: playerAuth.addNotification,
        markNotificationAsRead: playerAuth.markNotificationAsRead,
        clearNotifications: playerAuth.clearNotifications,
        friends: playerAuth.authState.friends,
        notifications: playerAuth.authState.notifications,
        settings: playerAuth.authState.settings
      }}
    >
      {children}
    </PlayerAuthContext.Provider>
  );
};

export const usePlayerAuthContext = () => {
  const context = useContext(PlayerAuthContext);
  if (context === undefined) {
    throw new Error('usePlayerAuthContext must be used within a PlayerAuthProvider');
  }
  return context;
};
