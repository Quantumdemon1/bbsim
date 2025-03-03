
import React, { useEffect, useState } from 'react';
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
  const [currentPhase, setCurrentPhase] = useState<string>('HoH Competition');
  
  useEffect(() => {
    if (!gameMode) {
      navigate('/');
      return;
    }
    
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    if (gameState === 'idle') {
      navigate('/lobby');
      return;
    }
  }, [gameState, isAuthenticated, navigate, gameMode]);
  
  const handlePhaseComplete = () => {
    console.log("Phase completed:", currentPhase);
    
    if (clearPhaseProgress) {
      clearPhaseProgress(currentPhase);
    }
    
    if (saveGame) {
      saveGame();
    }
  };
  
  useEffect(() => {
    if (gameState === 'playing' && saveGame) {
      const saveInterval = setInterval(() => {
        saveGame();
      }, 5 * 60 * 1000);
      
      return () => clearInterval(saveInterval);
    }
  }, [gameState, saveGame]);
  
  const selectedPlayerData = selectedPlayer ? 
    players?.find(p => p.id === selectedPlayer) || null : 
    null;

  if (!players || players.length === 0) {
    return <div className="flex items-center justify-center h-screen">Loading game...</div>;
  }

  return (
    <div className="h-full relative overflow-hidden">
      <GameHeader 
        showAdminPanel={showAdminPanel}
        setShowAdminPanel={setShowAdminPanel}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
      />
      
      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
      
      <GameControls players={players} />
      
      {saveGame && (
        <div className="absolute top-16 right-4 z-10">
          <SaveGameManager />
        </div>
      )}
      
      <GameRoom 
        players={players} 
        initialWeek={1} 
        onPhaseChange={(phase) => setCurrentPhase(phase)} 
      />
      
      {clearPhaseProgress && (
        <PhaseProgressTracker 
          phase={currentPhase}
          onPhaseComplete={handlePhaseComplete}
        />
      )}
      
      {/* Use the moved notifications, chat, and profile data here */}
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
  );
};

export default Game;
