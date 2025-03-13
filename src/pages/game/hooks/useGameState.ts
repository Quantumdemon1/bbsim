
import { useState, useMemo } from 'react';
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

  // Local UI state
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('HoH Competition');
  
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
  
  // Memoize state setters to prevent unnecessary function recreation
  const stateSetters = useMemo(() => ({
    setShowNotifications,
    setSelectedPlayer,
    setShowAdminPanel,
    setCurrentPhase
  }), []);
  
  return {
    ...gameState,
    ...stateSetters
  };
}
