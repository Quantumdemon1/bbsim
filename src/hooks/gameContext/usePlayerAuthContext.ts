
import { useContext } from 'react';
import { usePlayerAuthContext as useAuthContext } from '../../contexts/PlayerAuthContext';

export function usePlayerAuthContext() {
  const authContext = useAuthContext();
  
  if (!authContext) {
    throw new Error('usePlayerAuthContext must be used within a PlayerAuthProvider');
  }
  
  return {
    // Authentication
    isAuthenticated: authContext.isAuthenticated,
    currentPlayer: authContext.currentPlayer,
    isGuest: authContext.isGuest,
    isAdmin: authContext.isAdmin,
    login: authContext.login,
    register: authContext.register,
    loginAsGuest: authContext.loginAsGuest,
    loginAsAdmin: authContext.loginAsAdmin,
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
