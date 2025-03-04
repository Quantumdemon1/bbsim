
import React, { useEffect } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import { LoadingState } from '@/components/ui/loading-state';
import GameHeader from './components/GameHeader';
import GameContainer from './components/GameContainer';
import GameContent from './components/GameContent';
import GameOverlaysContainer from './components/GameOverlaysContainer';
import { useGameNotifications } from './components/GameNotifications';
import { useGameInit } from './hooks/useGameInit';
import { useGameState } from './hooks/useGameState';

const Game = () => {
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
  
  useEffect(() => {
    console.log("Game component - Rendered with showAdminPanel:", showAdminPanel);
    
    return () => {
      console.log("Game component - Unmounted");
    };
  }, [showAdminPanel]);

  const handleAdminPanelOpenChange = (open: boolean) => {
    console.log("handleAdminPanelOpenChange called with:", open);
    setShowAdminPanel(open);
  };

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
};

export default Game;
