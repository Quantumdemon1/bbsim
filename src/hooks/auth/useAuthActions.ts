
import { AuthState } from './types';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { toast } from "@/components/ui/use-toast";

export function useAuthActions(
  authState: AuthState, 
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) {
  const login = (player: PlayerData) => {
    setAuthState({
      ...authState,
      isAuthenticated: true,
      isGuest: false,
      currentPlayer: player
    });
    
    toast({
      title: "Welcome back!",
      description: `You are now logged in as ${player.username}.`,
    });
  };
  
  const register = (player: PlayerData) => {
    setAuthState({
      ...authState,
      isAuthenticated: true,
      isGuest: false,
      currentPlayer: player
    });
    
    toast({
      title: "Registration successful!",
      description: `Welcome to the game, ${player.username}!`,
    });
  };
  
  const loginAsGuest = (guestName: string) => {
    const guestPlayer: PlayerData = {
      id: `guest-${Date.now()}`,
      username: guestName,
      avatar: '/placeholder.svg',
      level: 1,
      stats: {
        wins: 0,
        losses: 0,
        totalGames: 0
      }
    };
    
    setAuthState({
      ...authState,
      isAuthenticated: true,
      isGuest: true,
      currentPlayer: guestPlayer
    });
    
    toast({
      title: "Guest login successful",
      description: `You are playing as guest ${guestName}.`,
    });
  };
  
  const logout = () => {
    setAuthState({
      ...authState,
      isAuthenticated: false,
      currentPlayer: null,
      isGuest: false
    });
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return {
    login,
    register,
    loginAsGuest,
    logout
  };
}
