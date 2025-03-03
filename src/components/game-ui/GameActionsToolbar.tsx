
import React from 'react';
import AllianceManagementDialog from '../game-dialogs/AllianceManagementDialog';
import PowerupsDialog from '../game-dialogs/PowerupsDialog';
import { PlayerData } from '@/components/PlayerProfile';

interface GameActionsToolbarProps {
  players: PlayerData[];
}

const GameActionsToolbar: React.FC<GameActionsToolbarProps> = ({ players }) => {
  return (
    <div className="fixed top-16 right-4 z-10 flex gap-2">
      <AllianceManagementDialog players={players} />
      <PowerupsDialog players={players} />
    </div>
  );
};

export default GameActionsToolbar;
