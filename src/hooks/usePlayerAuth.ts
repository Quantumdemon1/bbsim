
import { useState, useEffect } from 'react';
import { AuthState, defaultSettings } from './auth/types';
import { useAuthActions } from './auth/useAuthActions';
import { useNotifications } from './auth/useNotifications';
import { useFriends } from './auth/useFriends';
import { useSettings } from './auth/useSettings';
import { useProfile } from './auth/useProfile';

// Re-export necessary types
export { Notification, PlayerSettings } from './auth/types';

export function usePlayerAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Check local storage for existing session
    const savedAuth = localStorage.getItem('playerAuth');
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        
        // Ensure the parsed data has all required fields
        return {
          isAuthenticated: parsed.isAuthenticated || false,
          currentPlayer: parsed.currentPlayer || null,
          isGuest: parsed.isGuest || true,
          friends: parsed.friends || [],
          notifications: parsed.notifications || [],
          settings: parsed.settings || defaultSettings
        };
      } catch (e) {
        console.error("Failed to parse auth data:", e);
      }
    }
    return { 
      isAuthenticated: false, 
      currentPlayer: null, 
      isGuest: true,
      friends: [],
      notifications: [],
      settings: defaultSettings
    };
  });

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('playerAuth', JSON.stringify(authState));
  }, [authState]);

  // Import all our modular hooks
  const authActions = useAuthActions(authState, setAuthState);
  const notificationActions = useNotifications(authState, setAuthState);
  const friendActions = useFriends(authState, setAuthState);
  const settingsActions = useSettings(authState, setAuthState);
  const profileActions = useProfile(authState, setAuthState);

  // Combine all actions and state into a single object
  return {
    authState,
    ...authActions,
    ...notificationActions,
    ...friendActions,
    ...settingsActions,
    ...profileActions
  };
}
