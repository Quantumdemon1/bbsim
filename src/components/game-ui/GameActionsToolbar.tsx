
import React from 'react';
import AllianceManagementDialog from '../game-dialogs/AllianceManagementDialog';
import PowerupsDialog from '../game-dialogs/PowerupsDialog';
import PlayerAttributesDialog from '../game-dialogs/PlayerAttributesDialog';
import RelationshipsDialog from '../game-dialogs/RelationshipsDialog';
import { PlayerData } from '@/components/PlayerProfile';

interface GameActionsToolbarProps {
  players: PlayerData[];
}

const GameActionsToolbar: React.FC<GameActionsToolbarProps> = ({ players }) => {
  return (
    <div className="fixed top-16 right-4 z-10 flex gap-2">
      <PlayerAttributesDialog players={players} />
      <RelationshipsDialog players={players} />
      <AllianceManagementDialog players={players} />
      <PowerupsDialog players={players} />
    </div>
  );
};

export default GameActionsToolbar;
