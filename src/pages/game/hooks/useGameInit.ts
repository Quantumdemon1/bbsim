
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useGameContext } from '@/hooks/useGameContext';
import { initPerformanceMonitoring, trackGameLoading } from '@/services/performance-monitoring';
import { GamePhase } from '@/types/gameTypes';

export function useGameInit() {
  const navigate = useNavigate();
  const { 
    players = [],
    gameState, 
    isAuthenticated,
    gameMode,
    clearPhaseProgress,
    saveGame,
  } = useGameContext();
  const { toast } = useToast();
  
  // UI State
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('HoH Competition');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Game mechanics state
  const [dayCount, setDayCount] = useState(1);
  const [actionsRemaining, setActionsRemaining] = useState(3);

  // Initialize performance monitoring only once
  useEffect(() => {
    const cleanup = initPerformanceMonitoring();
    return cleanup;
  }, []);
  
  // Game loading and validation
  useEffect(() => {
    const gameLoadTracker = trackGameLoading();
    gameLoadTracker.start();
    
    const checkRequirements = () => {
      // Check if game mode is set
      if (!gameMode) {
        navigate('/');
        return false;
      }
      
      // Check if user is authenticated
      if (!isAuthenticated) {
        navigate('/');
        return false;
      }
      
      // Check if game is in a valid state
      if (gameState === 'idle') {
        navigate('/lobby');
        return false;
      }
      
      return true;
    };
    
    const requirementsMet = checkRequirements();
    let timer: number | undefined;
    
    if (requirementsMet) {
      // Delay showing content to prevent flashing
      timer = window.setTimeout(() => {
        setIsLoading(false);
        gameLoadTracker.end();
      }, 500);
    } else {
      gameLoadTracker.end();
    }
    
    // Proper cleanup to prevent memory leaks
    return () => {
      if (timer) window.clearTimeout(timer);
      gameLoadTracker.end();
    };
  }, [gameState, isAuthenticated, navigate, gameMode]);
  
  // Memoized action handlers to prevent recreating functions
  const advanceDay = useCallback(() => {
    setDayCount(prev => prev + 1);
    setActionsRemaining(3);
    
    toast({
      title: "New Day",
      description: `Day ${dayCount + 1} in the Big Brother house begins. You have 3 actions remaining.`,
    });
  }, [dayCount, toast]);
  
  const useAction = useCallback(() => {
    if (actionsRemaining > 0) {
      setActionsRemaining(prev => prev - 1);
      
      if (actionsRemaining === 1) {
        toast({
          title: "Last Action Used",
          description: "You have no more actions for today. Advance to the next day when ready.",
          variant: "destructive"
        });
      }
      
      return true;
    } else {
      toast({
        title: "No Actions Left",
        description: "You have no more actions for today. Advance to the next day to continue.",
        variant: "destructive"
      });
      return false;
    }
  }, [actionsRemaining, toast]);
  
  const handlePhaseChange = useCallback((newPhase: GamePhase) => {
    console.log(`Phase changing to: ${newPhase}`);
    setCurrentPhase(newPhase);
  }, []);
  
  const handlePhaseComplete = useCallback(() => {
    console.log("Phase completed:", currentPhase);
    
    try {
      if (clearPhaseProgress) {
        clearPhaseProgress(currentPhase);
      }
      
      if (saveGame) {
        saveGame().catch(error => {
          console.error("Failed to save game:", error);
          setError(error instanceof Error ? error : new Error('Unknown error during save'));
        });
      }
    } catch (error) {
      console.error("Error completing phase:", error);
      setError(error instanceof Error ? error : new Error('Unknown error during phase completion'));
    }
  }, [currentPhase, clearPhaseProgress, saveGame]);
  
  // Auto-save with proper cleanup
  useEffect(() => {
    if (gameState === 'playing' && saveGame) {
      console.log("Setting up auto-save interval");
      const saveInterval = window.setInterval(() => {
        console.log("Auto-saving game");
        saveGame().catch(error => {
          console.error("Failed to auto-save game:", error);
        });
      }, 5 * 60 * 1000); // 5 minutes
      
      return () => {
        console.log("Clearing auto-save interval");
        window.clearInterval(saveInterval);
      };
    }
  }, [gameState, saveGame]);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    players,
    dayCount,
    actionsRemaining,
    currentPhase,
    showNotifications,
    selectedPlayer,
    showAdminPanel,
    isLoading,
    error,
    setShowNotifications,
    setSelectedPlayer,
    setShowAdminPanel,
    advanceDay,
    useAction,
    handlePhaseChange,
    handlePhaseComplete,
  }), [
    players,
    dayCount,
    actionsRemaining,
    currentPhase,
    showNotifications,
    selectedPlayer,
    showAdminPanel,
    isLoading,
    error,
    advanceDay,
    useAction,
    handlePhaseChange,
    handlePhaseComplete
  ]);
}
