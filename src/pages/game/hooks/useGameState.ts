
import { useState } from 'react';
import { GamePhase } from '@/types/gameTypes';

export function useGameState() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('HoH Competition');
  
  return {
    showNotifications,
    selectedPlayer,
    showAdminPanel,
    currentPhase,
    setShowNotifications,
    setSelectedPlayer,
    setShowAdminPanel,
    setCurrentPhase
  };
}
