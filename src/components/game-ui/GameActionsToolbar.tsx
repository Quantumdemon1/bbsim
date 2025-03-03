import React from 'react';
import AllianceManagementDialog from '../game-dialogs/AllianceManagementDialog';
import PowerupsDialog from '../game-dialogs/PowerupsDialog';
import PlayerAttributesDialog from '../game-dialogs/PlayerAttributesDialog';
import RelationshipsDialog from '../game-dialogs/RelationshipsDialog';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface GameActionsToolbarProps {
  players: PlayerData[];
}

const GameActionsToolbar: React.FC<GameActionsToolbarProps> = ({ players }) => {
  return (
    <div className="fixed top-16 right-4 z-10 flex flex-col gap-2 md:flex-row">
      <PlayerAttributesDialog players={players} />
      <RelationshipsDialog players={players} />
      <AllianceManagementDialog players={players} />
      <PowerupsDialog players={players} />
    </div>
  );
};

export default GameActionsToolbar;
