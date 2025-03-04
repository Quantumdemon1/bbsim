
import React from 'react';
import { PhaseProgressTracker } from '@/components/game-ui/PhaseProgressTracker';
import ChatPanel from '@/components/chat/ChatPanel';
import NotificationPanel from '@/components/notifications/NotificationPanel';
import PlayerProfileModal from '@/components/profile/PlayerProfileModal';
import { SaveGameManager } from '@/components/game-ui/SaveGameManager';
import { GamePhase } from '@/types/gameTypes';
import { Notification } from '@/hooks/auth/types';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface GameOverlaysProps {
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
  saveGame?: () => Promise<void>;
}

const GameOverlays: React.FC<GameOverlaysProps> = ({
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
  saveGame
}) => {
  const selectedPlayerData = selectedPlayer ? 
    players?.find(p => p.id === selectedPlayer) || null : 
    null;

  return (
    <>
      {saveGame && (
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
          onClose={() => setSelectedPlayer(null)}
          player={selectedPlayerData}
        />
      )}
    </>
  );
};

export default GameOverlays;
