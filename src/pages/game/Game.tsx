
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
    saveCurrentGame: saveGame
  } = useGameContext();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<string>('HoH Competition');
  
  useEffect(() => {
    // Redirect if no game mode is set
    if (!gameMode) {
      navigate('/');
    }
    
    if (!isAuthenticated) {
      navigate('/');
    }
    
    if (gameState === 'idle') {
      navigate('/lobby');
    }
  }, [gameState, isAuthenticated, navigate, gameMode]);
  
  // Auto-save game state on phase completion
  const handlePhaseComplete = () => {
    console.log("Phase completed:", currentPhase);
    
    // Clear the progress for the current phase
    if (clearPhaseProgress) {
      clearPhaseProgress(currentPhase);
    }
    
    // Save game state after phase completion
    if (saveGame) {
      saveGame();
    }
  };
  
  // Auto-save game state periodically
  useEffect(() => {
    if (gameState === 'playing' && saveGame) {
      const saveInterval = setInterval(() => {
        saveGame();
      }, 5 * 60 * 1000); // Auto-save every 5 minutes
      
      return () => clearInterval(saveInterval);
    }
  }, [gameState, saveGame]);
  
  const selectedPlayerData = selectedPlayer ? 
    players.find(p => p.id === selectedPlayer) || null : 
    null;

  return (
    <div className="h-full relative overflow-hidden">
      <GameHeader 
        showAdminPanel={showAdminPanel}
        setShowAdminPanel={setShowAdminPanel}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
      />
      
      {/* Show admin panel if toggled */}
      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
      
      <GameControls players={players} />
      
      {/* Only show SaveGameManager if saveGame function exists */}
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
      
      {/* Phase Progress Tracker */}
      {clearPhaseProgress && (
        <PhaseProgressTracker 
          phase={currentPhase}
          onPhaseComplete={handlePhaseComplete}
        />
      )}
      
      <GamePanels 
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        selectedPlayerData={selectedPlayerData}
        setSelectedPlayer={setSelectedPlayer}
      />
    </div>
  );
};

// Small inline component for the panels
const GamePanels = ({ 
  showNotifications, 
  setShowNotifications, 
  selectedPlayerData, 
  setSelectedPlayer 
}) => {
  const { showChat, notifications, clearNotifications, markNotificationAsRead } = useGameContext();
  
  return (
    <>
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
    </>
  );
};

export default Game;
