
import React, { memo, useMemo } from 'react';
import { PhaseProgressTracker } from '@/components/game-ui/PhaseProgressTracker';
import ChatPanel from '@/components/chat/ChatPanel';
import NotificationPanel from '@/components/notifications/NotificationPanel';
import PlayerProfileModal from '@/components/profile/PlayerProfileModal';
import { SaveGameManager } from '@/components/game-ui/SaveGameManager';
import { GamePhase } from '@/types/gameTypes';
import { Notification } from '@/hooks/auth/types';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface GameOverlaysContainerProps {
  showChat: boolean;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  notifications: Notification[];
  clearNotifications?: () => void;
  markNotificationAsRead?: (id: string) => void;
  selectedPlayer: string | null;
  setSelectedPlayer: (id: string | null) => void;
  players: PlayerData[];
  currentPhase: GamePhase;
  onPhaseComplete: () => void;
  savedGames: any[];
}

// Use memo to prevent unnecessary re-renders
const GameOverlaysContainer: React.FC<GameOverlaysContainerProps> = memo(({
  showChat,
  showNotifications,
  setShowNotifications,
  notifications,
  clearNotifications,
  markNotificationAsRead,
  selectedPlayer,
  setSelectedPlayer,
  players,
  currentPhase,
  onPhaseComplete,
  savedGames
}) => {
  // Memoize computed values to prevent recalculation on every render
  const selectedPlayerData = useMemo(() => 
    selectedPlayer ? players?.find(p => p.id === selectedPlayer) || null : null, 
    [selectedPlayer, players]
  );

  const hasSaveGame = useMemo(() => savedGames.length > 0, [savedGames]);

  // Memoize handlers to prevent recreation on render
  const handlePlayerModalClose = useMemo(() => 
    () => setSelectedPlayer(null), 
    [setSelectedPlayer]
  );

  return (
    <>
      {hasSaveGame && (
        <div className="absolute top-16 right-4 z-10">
          <SaveGameManager />
        </div>
      )}
      
      {clearNotifications && (
        <PhaseProgressTracker 
          phase={currentPhase}
          onPhaseComplete={onPhaseComplete}
        />
      )}
      
      {showChat && <ChatPanel minimizable />}
      
      {notifications.length > 0 && (
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
          onClose={handlePlayerModalClose}
          player={selectedPlayerData}
        />
      )}
    </>
  );
});

// Add display name for better debugging
GameOverlaysContainer.displayName = 'GameOverlaysContainer';

export default GameOverlaysContainer;
