
import { usePlayerAuthContext as usePlayerAuth } from '../../contexts/PlayerAuthContext';

export function usePlayerAuthContext() {
  const playerAuth = usePlayerAuth();
  
  return {
    // Authentication status
    isAuthenticated: playerAuth.isAuthenticated,
    currentPlayer: playerAuth.currentPlayer,
    isGuest: playerAuth.isGuest,
    isAdmin: playerAuth.isAdmin,
    
    // Auth actions
    login: playerAuth.login,
    register: playerAuth.register,
    loginAsGuest: playerAuth.loginAsGuest,
    loginAsAdmin: playerAuth.loginAsAdmin,
    logout: playerAuth.logout,
    
    // Profile and settings
    updateProfile: playerAuth.updateProfile,
    updateSettings: playerAuth.updateSettings,
    settings: playerAuth.settings,
    
    // Friends
    friends: playerAuth.friends,
    addFriend: playerAuth.addFriend,
    removeFriend: playerAuth.removeFriend,
    
    // Notifications
    notifications: playerAuth.notifications,
    addNotification: playerAuth.addNotification,
    markNotificationAsRead: playerAuth.markNotificationAsRead,
    clearNotifications: playerAuth.clearNotifications
  };
}
