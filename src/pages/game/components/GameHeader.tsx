
import React from 'react';
import { Bell, MessageSquare, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGameContext } from '@/contexts/GameContext';

interface GameHeaderProps {
  showAdminPanel: boolean;
  setShowAdminPanel: (show: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  showAdminPanel,
  setShowAdminPanel,
  showNotifications,
  setShowNotifications
}) => {
  const { 
    isAdmin, 
    showChat, 
    setShowChat, 
    notifications,
    gameMode,
    humanPlayers
  } = useGameContext();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <>
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
    </>
  );
};

export default GameHeader;
