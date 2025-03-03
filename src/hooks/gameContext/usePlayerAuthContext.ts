
import { useContext } from 'react';
import { PlayerAuthContext } from '../../contexts/PlayerAuthContext';

export function usePlayerAuthContext() {
  const authContext = useContext(PlayerAuthContext);
  
  if (!authContext) {
    throw new Error('usePlayerAuthContext must be used within a PlayerAuthProvider');
  }
  
  return {
    // Authentication
    isAuthenticated: authContext.isAuthenticated,
    currentPlayer: authContext.currentPlayer,
    isGuest: authContext.isGuest,
    login: authContext.login,
    register: authContext.register,
    loginAsGuest: authContext.loginAsGuest,
    logout: authContext.logout,
    
    // Profile
    updateProfile: authContext.updateProfile,
    updateSettings: authContext.updateSettings,
    
    // Friends
    friends: authContext.friends,
    addFriend: authContext.addFriend,
    removeFriend: authContext.removeFriend,
    
    // Notifications
    notifications: authContext.notifications,
    addNotification: authContext.addNotification,
    markNotificationAsRead: authContext.markNotificationAsRead,
    clearNotifications: authContext.clearNotifications,
    
    // Settings
    settings: authContext.settings
  };
}
