
import { AuthState, defaultSettings } from './types';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { toast } from "@/components/ui/use-toast";

export function useAuthActions(authState: AuthState, setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) {
  const login = (player: PlayerData) => {
    setAuthState({
      ...authState,
      isAuthenticated: true,
      currentPlayer: player,
      isGuest: false
    });
    
    toast({
      title: "Welcome back!",
      description: `You're now logged in as ${player.name}.`,
    });
  };

  const register = (player: PlayerData) => {
    // In a real app, we would register the user in a database
    setAuthState({
      ...authState,
      isAuthenticated: true,
      currentPlayer: player,
      isGuest: false
    });
    
    toast({
      title: "Account created!",
      description: `Welcome to the game, ${player.name}!`,
    });
  };

  const loginAsGuest = (guestName: string) => {
    const guestPlayer: PlayerData = {
      id: `guest-${Date.now()}`,
      name: guestName,
      stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
    };
    
    setAuthState({
      ...authState,
      isAuthenticated: true,
      currentPlayer: guestPlayer,
      isGuest: true
    });
    
    toast({
      title: "Playing as guest",
      description: `Welcome, ${guestName}! Your progress won't be saved when you leave.`,
    });
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      currentPlayer: null,
      isGuest: true,
      friends: [],
      notifications: [],
      settings: defaultSettings
    });
    
    toast({
      title: "Logged out",
      description: "You've been logged out successfully.",
    });
  };

  return {
    login,
    register,
    loginAsGuest,
    logout
  };
}
