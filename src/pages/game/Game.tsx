import React, { Suspense, useEffect } from 'react';
import { adaptGameNotificationToAuthNotification, isGameNotificationArray } from '@/types/notificationTypes';
import { Notification } from '@/hooks/auth/types';
import { useGameContext } from '@/hooks/useGameContext';
import { LoadingState } from '@/components/ui/loading-state';
import GameHeader from './components/GameHeader';
import GameControls from './components/GameControls';
import AdminPanel from './components/AdminPanel';
import GameRoom from '@/components/GameRoom';
import GameContainer from './components/GameContainer';
import DayTracker from './components/DayTracker';
import GameOverlays from './components/GameOverlays';
import { useGameInit } from './hooks/useGameInit';

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
  } = useGameInit();

  useEffect(() => {
    console.log("Game component - Rendered with showAdminPanel:", showAdminPanel);
    
    return () => {
      console.log("Game component - Unmounted");
    };
  }, [showAdminPanel]);
  
  const adaptedNotifications: Notification[] = React.useMemo(() => {
    if (!notifications || notifications.length === 0) return [];
    
    if (isGameNotificationArray(notifications)) {
      return notifications.map(adaptGameNotificationToAuthNotification);
    }
    
    return notifications as unknown as Notification[];
  }, [notifications]);

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
      
      <DayTracker 
        dayCount={dayCount} 
        actionsRemaining={actionsRemaining} 
        advanceDay={advanceDay} 
      />
      
      <AdminPanel 
        open={showAdminPanel}
        onOpenChange={handleAdminPanelOpenChange}
      />
      
      <Suspense fallback={<LoadingState text="Loading game controls..." />}>
        <GameControls 
          players={players} 
          dayCount={dayCount}
          actionsRemaining={actionsRemaining}
          useAction={useAction}
        />
      </Suspense>
      
      <Suspense fallback={<LoadingState text="Loading game room..." />}>
        <GameRoom 
          players={players} 
          initialWeek={1} 
          onPhaseChange={handlePhaseChange} 
        />
      </Suspense>
      
      <GameOverlays
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
        saveGame={savedGames.length > 0 ? () => Promise.resolve() : undefined}
      />
    </GameContainer>
  );
};

export default Game;
