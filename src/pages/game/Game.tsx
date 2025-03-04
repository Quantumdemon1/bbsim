import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import GameRoom from '@/components/GameRoom';
import { useGameContext } from '@/hooks/useGameContext';
import GameHeader from './components/GameHeader';
import GameControls from './components/GameControls';
import AdminPanel from './components/AdminPanel';
import { PhaseProgressTracker } from '@/components/game-ui/PhaseProgressTracker';
import { SaveGameManager } from '@/components/game-ui/SaveGameManager';
import ChatPanel from '@/components/chat/ChatPanel';
import NotificationPanel from '@/components/notifications/NotificationPanel';
import PlayerProfileModal from '@/components/profile/PlayerProfileModal';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingState } from '@/components/ui/loading-state';
import { GamePhase } from '@/types/gameTypes';
import { adaptGameNotificationToAuthNotification, isGameNotificationArray } from '@/types/notificationTypes';
import { Notification } from '@/hooks/auth/types';
import { initPerformanceMonitoring, trackGameLoading, trackPhaseChange } from '@/services/performance-monitoring';
import { useToast } from '@/components/ui/use-toast';

const Game = () => {
  const navigate = useNavigate();
  const { 
    players = [],
    gameState, 
    isAuthenticated,
    currentPlayer,
    gameMode,
    clearPhaseProgress,
    saveGame,
    showChat,
    notifications = [],
    clearNotifications,
    markNotificationAsRead,
    savedGames = []
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
  
  const adaptedNotifications: Notification[] = React.useMemo(() => {
    if (!notifications || notifications.length === 0) return [];
    
    if (isGameNotificationArray(notifications)) {
      return notifications.map(adaptGameNotificationToAuthNotification);
    }
    
    return notifications as unknown as Notification[];
  }, [notifications]);
  
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
    const phaseChangeTracker = trackPhaseChange();
    phaseChangeTracker.start();
    
    try {
      setCurrentPhase(newPhase);
      phaseChangeTracker.end();
    } catch (error) {
      console.error("Error changing phase:", error);
      setError(error instanceof Error ? error : new Error('Unknown error during phase change'));
      phaseChangeTracker.end();
    }
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
  
  const selectedPlayerData = selectedPlayer ? 
    players?.find(p => p.id === selectedPlayer) || null : 
    null;

  if (isLoading || !players || players.length === 0) {
    return <LoadingState fullScreen text="Loading game..." />;
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-game-dark text-white p-4">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">An error occurred</h2>
          <p className="mb-6">{error.message}</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-game-accent hover:bg-game-highlight text-black font-medium rounded"
            >
              Reload Game
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="h-full relative overflow-hidden">
        <GameHeader 
          showAdminPanel={showAdminPanel}
          setShowAdminPanel={setShowAdminPanel}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        />
        
        <div className="bg-game-dark border-b border-game-accent px-4 py-2 flex justify-between items-center">
          <div className="flex space-x-4 items-center">
            <span className="text-game-accent">Day {dayCount}</span>
            <span className="text-white">Actions: {actionsRemaining}/3</span>
          </div>
          <button
            className="px-3 py-1 bg-game-accent text-black rounded hover:bg-game-highlight transition-colors"
            onClick={advanceDay}
            disabled={actionsRemaining > 0}
          >
            {actionsRemaining > 0 ? "Use All Actions First" : "Next Day"}
          </button>
        </div>
        
        {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
        
        <Suspense fallback={<LoadingState text="Loading game controls..." />}>
          <GameControls 
            players={players} 
            dayCount={dayCount}
            actionsRemaining={actionsRemaining}
            useAction={useAction}
          />
        </Suspense>
        
        {saveGame && (
          <div className="absolute top-16 right-4 z-10">
            <SaveGameManager />
          </div>
        )}
        
        <ErrorBoundary fallback={
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-4">
              <h2 className="text-xl font-bold mb-2">Game Room Error</h2>
              <p className="text-muted-foreground mb-4">There was a problem loading the game room</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-primary text-white rounded"
              >
                Reload Game
              </button>
            </div>
          </div>
        }>
          <GameRoom 
            players={players} 
            initialWeek={1} 
            onPhaseChange={handlePhaseChange} 
          />
        </ErrorBoundary>
        
        {clearPhaseProgress && (
          <PhaseProgressTracker 
            phase={currentPhase}
            onPhaseComplete={handlePhaseComplete}
          />
        )}
        
        {showChat && <ChatPanel minimizable />}
        
        {adaptedNotifications.length > 0 && (
          <NotificationPanel 
            open={showNotifications}
            onOpenChange={setShowNotifications}
            notifications={adaptedNotifications}
            onClearAll={clearNotifications}
            onMarkAsRead={markNotificationAsRead}
          />
        )}
        
        {selectedPlayerData && (
          <PlayerProfileModal
            open={!!selectedPlayerData}
            onClose={() => setSelectedPlayer(null)}
            player={selectedPlayerData}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Game;
