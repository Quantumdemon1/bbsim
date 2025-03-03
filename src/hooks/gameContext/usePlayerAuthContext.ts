
import { useContext } from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { usePlayerAuthContext as usePlayerAuth } from '@/contexts/PlayerAuthContext';
import { Notification, PlayerSettings } from '@/hooks/usePlayerAuth';

export function usePlayerAuthContext() {
  const context = usePlayerAuth();

  if (!context) {
    throw new Error('usePlayerAuthContext must be used within a PlayerAuthProvider');
  }

  return {
    // Authentication state
    isAuthenticated: context.isAuthenticated,
    currentPlayer: context.currentPlayer,
    isGuest: context.isGuest,
    login: context.login,
    register: context.register,
    loginAsGuest: context.loginAsGuest,
    logout: context.logout,
    
    // Profile management
    updateProfile: context.updateProfile,
    updateSettings: context.updateSettings,
    
    // Friends management
    friends: context.friends,
    addFriend: context.addFriend,
    removeFriend: context.removeFriend,
    
    // Notifications
    notifications: context.notifications,
    addNotification: context.addNotification,
    markNotificationAsRead: context.markNotificationAsRead,
    clearNotifications: context.clearNotifications,
    
    // Settings
    settings: context.settings,
  };
}
