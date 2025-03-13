
import React, { useEffect, memo } from 'react';
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
  
  // Optimized effect with better logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Game component - Rendered with showAdminPanel:", showAdminPanel);
      
      return () => {
        console.log("Game component - Unmounted");
      };
    }
  }, [showAdminPanel]);

  // Memoized handler to prevent recreation
  const handleAdminPanelOpenChange = React.useCallback((open: boolean) => {
    console.log("handleAdminPanelOpenChange called with:", open);
    setShowAdminPanel(open);
  }, [setShowAdminPanel]);

  return (
    <GameContainer isLoading={isLoading || !players || players.length === 0} error={error}>
      <GameHeader 
        showAdminPanel={showAdminPanel}
        setShowAdminPanel={setShowAdminPanel}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
      />
      
      <GameContent
        players={players}
        dayCount={dayCount}
        actionsRemaining={actionsRemaining}
        currentPhase={currentPhase}
        showAdminPanel={showAdminPanel}
        onAdminPanelOpenChange={handleAdminPanelOpenChange}
        advanceDay={advanceDay}
        useAction={useAction}
        handlePhaseChange={handlePhaseChange}
        handlePhaseComplete={handlePhaseComplete}
      />
      
      <GameOverlaysContainer
        showChat={showChat}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        notifications={adaptedNotifications}
        clearNotifications={clearNotifications}
        markNotificationAsRead={markNotificationAsRead}
        selectedPlayer={selectedPlayer}
        setSelectedPlayer={setSelectedPlayer}
        players={players}
        currentPhase={currentPhase}
        onPhaseComplete={handlePhaseComplete}
        savedGames={savedGames}
      />
    </GameContainer>
  );
});

// Add display name for easier debugging
Game.displayName = 'Game';

export default Game;
