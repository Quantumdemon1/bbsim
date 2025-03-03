
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, MessageSquare, X, Shield, SkipForward } from 'lucide-react';
import GameRoom from '@/components/GameRoom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGameContext } from '@/contexts/GameContext';
import GameActionsToolbar from '@/components/game-ui/GameActionsToolbar';
import ChatPanel from '@/components/chat/ChatPanel';
import NotificationPanel from '@/components/notifications/NotificationPanel';
import PlayerProfileModal from '@/components/profile/PlayerProfileModal';
import PhaseProgressTracker from '@/components/game-ui/PhaseProgressTracker';

const Game = () => {
  const navigate = useNavigate();
  const { 
    players, 
    gameState, 
    isAuthenticated,
    currentPlayer,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    showChat,
    setShowChat,
    gameMode,
    humanPlayers,
    isAdmin,
    adminTakeControl,
    clearPhaseProgress
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
  
  const selectedPlayerData = selectedPlayer ? 
    players.find(p => p.id === selectedPlayer) || null : 
    null;
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle phase completion
  const handlePhaseComplete = () => {
    // This would be handled by the game phase manager
    // We'll use this as a placeholder for now
    console.log("Phase completed:", currentPhase);
    
    // Clear the progress for the current phase
    if (clearPhaseProgress) {
      clearPhaseProgress(currentPhase);
    }
  };

  // Admin panel for controlling the game
  const AdminPanel = () => {
    const [selectedPhase, setSelectedPhase] = useState('');
    
    const phases = [
      'HoH Competition',
      'Nomination Ceremony',
      'PoV Competition',
      'Veto Ceremony',
      'Eviction Voting',
      'Eviction',
      'Weekly Summary'
    ];
    
    const handleTakeControl = () => {
      adminTakeControl(selectedPhase || undefined);
      setShowAdminPanel(false);
      
      // Update the current phase if one is selected
      if (selectedPhase) {
        setCurrentPhase(selectedPhase);
      }
    };
    
    return (
      <div className="absolute bottom-4 right-4 z-20 bg-black/90 border border-red-500 rounded-lg p-4 w-64">
        <h3 className="text-red-500 font-bold flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Admin Controls
        </h3>
        
        <div className="mt-3">
          <label className="text-xs text-white">Jump to phase:</label>
          <select 
            className="w-full bg-gray-800 text-white rounded p-1 text-sm mt-1 border border-gray-700"
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
          >
            <option value="">Select phase...</option>
            {phases.map(phase => (
              <option key={phase} value={phase}>{phase}</option>
            ))}
          </select>
          
          <div className="flex space-x-2 mt-3">
            <Button 
              size="sm" 
              variant="destructive"
              className="flex-1"
              onClick={handleTakeControl}
            >
              <SkipForward className="w-3 h-3 mr-1" />
              Take Control
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowAdminPanel(false)}
              className="border-gray-700 text-gray-400"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="h-full relative overflow-hidden">
      <div className="absolute right-4 top-4 z-10 flex space-x-2">
        {isAdmin && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className="bg-game-dark/80 border-red-500 text-red-500 h-8"
          >
            <Shield className="h-4 w-4 mr-1" />
            Admin
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowNotifications(true)}
          className="relative bg-game-dark/80 border-game-accent text-game-accent h-8"
        >
          <Bell className="h-4 w-4 mr-1" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
              {unreadCount}
            </Badge>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowChat(!showChat)}
          className="bg-game-dark/80 border-game-accent text-game-accent h-8"
        >
          {showChat ? (
            <>
              <X className="h-4 w-4 mr-1" />
              Close Chat
            </>
          ) : (
            <>
              <MessageSquare className="h-4 w-4 mr-1" />
              Open Chat
            </>
          )}
        </Button>
      </div>
      
      {/* Game mode indicator */}
      <div className="absolute left-4 top-4 z-10">
        <Badge variant="outline" className="bg-game-dark/80 border-game-accent text-white px-3 py-1">
          {gameMode === 'singleplayer' ? 'Single Player' : 'Multiplayer'}
          {gameMode === 'multiplayer' && humanPlayers.length > 0 && (
            <span className="ml-2">({humanPlayers.length} human players)</span>
          )}
        </Badge>
      </div>
      
      {/* Show admin panel if toggled */}
      {showAdminPanel && <AdminPanel />}
      
      <GameActionsToolbar players={players} />
      <GameRoom 
        players={players} 
        initialWeek={1} 
        onPhaseChange={(phase) => setCurrentPhase(phase)} 
      />
      
      {/* Phase Progress Tracker */}
      <PhaseProgressTracker 
        currentPhase={currentPhase}
        onPhaseComplete={handlePhaseComplete}
      />
      
      {showChat && <ChatPanel minimizable />}
      
      <NotificationPanel 
        open={showNotifications}
        onOpenChange={setShowNotifications}
        notifications={notifications}
        onClearAll={clearNotifications}
        onMarkAsRead={markNotificationAsRead}
      />
      
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
