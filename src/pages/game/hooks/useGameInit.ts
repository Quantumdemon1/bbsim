
import { useState, useEffect } from 'react';
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
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('HoH Competition');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const [dayCount, setDayCount] = useState(1);
  const [actionsRemaining, setActionsRemaining] = useState(3);

  useEffect(() => {
    initPerformanceMonitoring();
  }, []);
  
  useEffect(() => {
    const gameLoadTracker = trackGameLoading();
    gameLoadTracker.start();
    
    const checkRequirements = () => {
      if (!gameMode) {
        navigate('/');
        return false;
      }
      
      if (!isAuthenticated) {
        navigate('/');
        return false;
      }
      
      if (gameState === 'idle') {
        navigate('/lobby');
        return false;
      }
      
      return true;
    };
    
    const requirementsMet = checkRequirements();
    
    if (requirementsMet) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        gameLoadTracker.end();
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      gameLoadTracker.end();
    }
  }, [gameState, isAuthenticated, navigate, gameMode]);
  
  const advanceDay = () => {
    setDayCount(prev => prev + 1);
    setActionsRemaining(3);
    
    toast({
      title: "New Day",
      description: `Day ${dayCount + 1} in the Big Brother house begins. You have 3 actions remaining.`,
    });
  };
  
  const useAction = () => {
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
  };
  
  const handlePhaseChange = (newPhase: GamePhase) => {
    setCurrentPhase(newPhase);
  };
  
  const handlePhaseComplete = () => {
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
  };
  
  useEffect(() => {
    if (gameState === 'playing' && saveGame) {
      const saveInterval = setInterval(() => {
        saveGame().catch(error => {
          console.error("Failed to auto-save game:", error);
        });
      }, 5 * 60 * 1000);
      
      return () => clearInterval(saveInterval);
    }
  }, [gameState, saveGame]);

  return {
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
  };
}
