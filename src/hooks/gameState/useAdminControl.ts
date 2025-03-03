
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { PlayerData } from '@/components/PlayerProfileTypes';

interface AdminControlProps {
  gameState: 'idle' | 'lobby' | 'playing' | 'ended';
  clearPhaseProgress?: (phase: string) => void;
}

export function useAdminControl({ gameState, clearPhaseProgress }: AdminControlProps) {
  const [isAdminControl, setIsAdminControl] = useState(false);
  const { toast } = useToast();

  // Admin functions
  const adminTakeControl = (phaseToSkipTo?: string) => {
    if (gameState !== 'playing') return;
    
    setIsAdminControl(true);
    
    // If a specific phase is provided, set it
    if (phaseToSkipTo && clearPhaseProgress) {
      // Clear progress for any current phases
      clearPhaseProgress(phaseToSkipTo);
      
      // Notify players about admin intervention
      const notification = {
        type: 'system_message' as const,
        message: 'Game Admin has taken control of the game.'
      };
      
      toast({
        title: "Admin Control",
        description: `Skipping to phase: ${phaseToSkipTo}`,
      });
    } else {
      toast({
        title: "Admin Control",
        description: "You now have control of the game.",
      });
    }
  };

  // Login as admin (to be connected to PlayerAuthContext)
  const loginAsAdmin = () => {
    // This will be connected to the PlayerAuthContext in the component tree
    // For now, we'll just set the admin control flag
    setIsAdminControl(true);
    toast({
      title: "Admin Mode",
      description: "You are now logged in as an admin.",
    });
  };

  return {
    isAdminControl,
    adminTakeControl,
    loginAsAdmin
  };
}
