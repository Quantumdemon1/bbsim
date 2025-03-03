
import { usePlayerAuthContext as usePlayerAuth } from '../../contexts/PlayerAuthContext';

export function usePlayerAuthContext() {
  const playerAuth = usePlayerAuth();
  
  return {
    // Auth
    isAuthenticated: playerAuth.isAuthenticated,
    currentPlayer: playerAuth.currentPlayer,
    isGuest: playerAuth.isGuest,
    isAdmin: playerAuth.isAdmin,
    login: playerAuth.login,
    register: playerAuth.register,
    loginAsGuest: playerAuth.loginAsGuest,
    loginAsAdmin: playerAuth.loginAsAdmin,
    logout: playerAuth.logout,
    updateProfile: playerAuth.updateProfile,
    updateSettings: playerAuth.updateSettings,
    addFriend: playerAuth.addFriend,
    removeFriend: playerAuth.removeFriend,
    addNotification: playerAuth.addNotification,
    markNotificationAsRead: playerAuth.markNotificationAsRead,
    clearNotifications: playerAuth.clearNotifications,
    friends: playerAuth.friends,
    notifications: playerAuth.notifications,
    settings: playerAuth.settings,
  };
}
