
import { useState, useMemo, useCallback } from 'react';
import { GamePhase } from '@/types/gameTypes';
import { useGameContext } from '@/hooks/useGameContext';

export function useGameState() {
  // Get global state from context
  const { 
    notifications, 
    clearNotifications, 
    markNotificationAsRead, 
    savedGames 
  } = useGameContext();

  // Local UI state with descriptive initial values
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('HoH Competition');
  
  // Use callbacks for state setters to prevent unnecessary recreations
  const handleSetShowNotifications = useCallback((show: boolean) => {
    setShowNotifications(show);
  }, []);
  
  const handleSetSelectedPlayer = useCallback((playerId: string | null) => {
    setSelectedPlayer(playerId);
  }, []);
  
  const handleSetShowAdminPanel = useCallback((show: boolean) => {
    setShowAdminPanel(show);
  }, []);
  
  const handleSetCurrentPhase = useCallback((phase: GamePhase) => {
    setCurrentPhase(phase);
  }, []);
  
  // Memoize derived state to prevent unnecessary recalculations
  const gameState = useMemo(() => ({
    showNotifications,
    selectedPlayer,
    showAdminPanel,
    currentPhase,
    notifications,
    clearNotifications,
    markNotificationAsRead,
    savedGames
  }), [
    showNotifications, 
    selectedPlayer, 
    showAdminPanel, 
    currentPhase, 
    notifications, 
    clearNotifications, 
    markNotificationAsRead, 
    savedGames
  ]);
  
  // Memoize state setters to prevent unnecessary function creation
  const stateSetters = useMemo(() => ({
    setShowNotifications: handleSetShowNotifications,
    setSelectedPlayer: handleSetSelectedPlayer,
    setShowAdminPanel: handleSetShowAdminPanel,
    setCurrentPhase: handleSetCurrentPhase
  }), [
    handleSetShowNotifications,
    handleSetSelectedPlayer,
    handleSetShowAdminPanel,
    handleSetCurrentPhase
  ]);
  
  return {
    ...gameState,
    ...stateSetters
  };
}
