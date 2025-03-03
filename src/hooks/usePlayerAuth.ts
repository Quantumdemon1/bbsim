
import { useState, useEffect } from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';

export type AuthState = {
  isAuthenticated: boolean;
  currentPlayer: PlayerData | null;
  isGuest: boolean;
}

export function usePlayerAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Check local storage for existing session
    const savedAuth = localStorage.getItem('playerAuth');
    if (savedAuth) {
      try {
        return JSON.parse(savedAuth);
      } catch (e) {
        console.error("Failed to parse auth data:", e);
      }
    }
    return { isAuthenticated: false, currentPlayer: null, isGuest: true };
  });

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('playerAuth', JSON.stringify(authState));
  }, [authState]);

  const login = (player: PlayerData) => {
    setAuthState({
      isAuthenticated: true,
      currentPlayer: player,
      isGuest: false
    });
  };

  const register = (player: PlayerData) => {
    // In a real app, we would register the user in a database
    setAuthState({
      isAuthenticated: true,
      currentPlayer: player,
      isGuest: false
    });
  };

  const loginAsGuest = (guestName: string) => {
    const guestPlayer: PlayerData = {
      id: `guest-${Date.now()}`,
      name: guestName,
      stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
    };
    
    setAuthState({
      isAuthenticated: true,
      currentPlayer: guestPlayer,
      isGuest: true
    });
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      currentPlayer: null,
      isGuest: true
    });
  };

  return {
    authState,
    login,
    register,
    loginAsGuest,
    logout
  };
}
