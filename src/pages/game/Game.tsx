
import React, { useEffect, memo, useMemo } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import GameHeader from './components/GameHeader';
import GameContainer from './components/GameContainer';
import GameContent from './components/GameContent';
import GameOverlaysContainer from './components/GameOverlaysContainer';
import { useGameNotifications } from './components/GameNotifications';
import { useGameInit } from './hooks/useGameInit';
import { useGameState } from './hooks/useGameState';

// Using memo to prevent unnecessary re-renders
const Game = memo(() => {
  const { 
    showChat,
    notifications = [],
    clearNotifications,
    markNotificationAsRead,
    savedGames = []
  } = useGameContext();
  
  const {
    players,
    dayCount,
    actionsRemaining,
    currentPhase,
    isLoading,
    error,
    advanceDay,
    useAction,
    handlePhaseChange,
    handlePhaseComplete,
  } = useGameInit();

  const {
    showNotifications,
    selectedPlayer,
    showAdminPanel,
    setShowNotifications,
    setSelectedPlayer,
    setShowAdminPanel
  } = useGameState();

  const { adaptedNotifications } = useGameNotifications({ notifications });
  
  // Memoized handler to prevent recreation
  const handleAdminPanelOpenChange = React.useCallback((open: boolean) => {
    console.log("Admin panel open changed to:", open);
    setShowAdminPanel(open);
  }, [setShowAdminPanel]);
  
  // Memoize props for child components to prevent unnecessary renders
  const gameHeaderProps = useMemo(() => ({
    showAdminPanel,
    setShowAdminPanel: handleAdminPanelOpenChange,
    showNotifications,
    setShowNotifications,
  }), [showAdminPanel, handleAdminPanelOpenChange, showNotifications, setShowNotifications]);
  
  const gameContentProps = useMemo(() => ({
    players,
    dayCount,
    actionsRemaining,
    currentPhase,
    showAdminPanel,
    onAdminPanelOpenChange: handleAdminPanelOpenChange,
    advanceDay,
    useAction,
    handlePhaseChange,
    handlePhaseComplete,
  }), [
    players, 
    dayCount, 
    actionsRemaining, 
    currentPhase, 
    showAdminPanel, 
    handleAdminPanelOpenChange,
    advanceDay,
    useAction,
    handlePhaseChange,
    handlePhaseComplete
  ]);
  
  const gameOverlaysProps = useMemo(() => ({
    showChat,
    showNotifications,
    setShowNotifications,
    notifications: adaptedNotifications,
    clearNotifications,
    markNotificationAsRead,
    selectedPlayer,
    setSelectedPlayer,
    players,
    currentPhase,
    onPhaseComplete: handlePhaseComplete,
    savedGames,
  }), [
    showChat,
    showNotifications,
    setShowNotifications,
    adaptedNotifications,
    clearNotifications,
    markNotificationAsRead,
    selectedPlayer,
    setSelectedPlayer,
    players,
    currentPhase,
    handlePhaseComplete,
    savedGames
  ]);
  
  // Improved effect with better logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Game component - Rendered with gameState:", currentPhase, "showAdminPanel:", showAdminPanel);
      
      return () => {
        console.log("Game component - Unmounted");
      };
    }
  }, [currentPhase, showAdminPanel]);

  return (
    <GameContainer isLoading={isLoading || !players || players.length === 0} error={error}>
      <GameHeader {...gameHeaderProps} />
      <GameContent {...gameContentProps} />
      <GameOverlaysContainer {...gameOverlaysProps} />
    </GameContainer>
  );
});

// Add display name for easier debugging
Game.displayName = 'Game';

export default Game;
