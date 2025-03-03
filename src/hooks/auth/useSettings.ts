
import { AuthState, PlayerSettings } from './types';
import { toast } from "@/components/ui/use-toast";

export function useSettings(authState: AuthState, setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) {
  const updateSettings = (newSettings: Partial<PlayerSettings>) => {
    setAuthState({
      ...authState,
      settings: {
        ...authState.settings,
        ...newSettings
      }
    });
    
    toast({
      title: "Settings updated",
      description: "Your settings have been updated successfully.",
    });
  };

  return {
    updateSettings
  };
}
