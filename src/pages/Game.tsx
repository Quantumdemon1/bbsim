
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, MessageSquare, X } from 'lucide-react';
import GameRoom from '@/components/GameRoom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGameContext } from '@/contexts/GameContext';
import GameActionsToolbar from '@/components/game-ui/GameActionsToolbar';
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
    notifications,
    markNotificationAsRead,
    clearNotifications,
    showChat,
    setShowChat,
    gameMode,
    humanPlayers
  } = useGameContext();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  
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
  
  return (
    <div className="h-full relative overflow-hidden">
      <div className="absolute right-4 top-4 z-10 flex space-x-2">
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
      
      <GameActionsToolbar players={players} />
      <GameRoom players={players} />
      
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
