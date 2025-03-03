
import { AuthState } from './types';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { toast } from "@/components/ui/use-toast";

export function useProfile(authState: AuthState, setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) {
  const updateProfile = (updatedProfile: Partial<PlayerData>) => {
    if (!authState.currentPlayer) return;
    
    setAuthState({
      ...authState,
      currentPlayer: {
        ...authState.currentPlayer,
        ...updatedProfile
      }
    });
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  return {
    updateProfile
  };
}
