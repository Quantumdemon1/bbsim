
import React from 'react';
import AllianceManagementDialog from '../game-dialogs/AllianceManagementDialog';
import PowerupsDialog from '../game-dialogs/PowerupsDialog';
import PlayerAttributesDialog from '../game-dialogs/PlayerAttributesDialog';
import RelationshipsDialog from '../game-dialogs/RelationshipsDialog';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { SaveGameManager } from './SaveGameManager';

interface GameActionsToolbarProps {
  players: PlayerData[];
}

const GameActionsToolbar: React.FC<GameActionsToolbarProps> = ({ players }) => {
  return (
    <div className="fixed top-16 right-4 z-10 flex flex-wrap justify-end gap-2">
      <div className="flex flex-wrap gap-2 items-center">
        <PlayerAttributesDialog players={players} />
        <RelationshipsDialog players={players} />
        <AllianceManagementDialog players={players} />
        <PowerupsDialog players={players} />
        <SaveGameManager />
      </div>
    </div>
  );
};

export default GameActionsToolbar;
