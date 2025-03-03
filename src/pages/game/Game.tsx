
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

const Game = () => {
  const navigate = useNavigate();
  const { 
    players, 
    gameState, 
    isAuthenticated,
    currentPlayer,
    gameMode,
    clearPhaseProgress,
    saveGame,
    showChat,
    notifications,
    clearNotifications,
    markNotificationAsRead
  } = useGameContext();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('HoH Competition');
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for required game conditions and navigate if not met
  useEffect(() => {
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
    
    // Only set loading to false if all requirements are met
    if (requirementsMet) {
      // Small delay to allow components to load
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [gameState, isAuthenticated, navigate, gameMode]);
  
  const handlePhaseComplete = () => {
    console.log("Phase completed:", currentPhase);
    
    if (clearPhaseProgress) {
      clearPhaseProgress(currentPhase);
    }
    
    if (saveGame) {
      saveGame().catch(error => {
        console.error("Failed to save game:", error);
      });
    }
  };
  
  // Auto-save game state every 5 minutes
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

  // Show loading state while checking requirements or if players data is missing
  if (isLoading || !players || players.length === 0) {
    return <LoadingState fullScreen text="Loading game..." />;
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
        
        {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
        
        <Suspense fallback={<LoadingState text="Loading game controls..." />}>
          <GameControls players={players} />
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
            onPhaseChange={(phase) => setCurrentPhase(phase as GamePhase)} 
          />
        </ErrorBoundary>
        
        {clearPhaseProgress && (
          <PhaseProgressTracker 
            phase={currentPhase}
            onPhaseComplete={handlePhaseComplete}
          />
        )}
        
        {/* Game panels for chat, notifications, and player profiles */}
        {showChat && <ChatPanel minimizable />}
        
        {notifications && (
          <NotificationPanel 
            open={showNotifications}
            onOpenChange={setShowNotifications}
            notifications={notifications}
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
