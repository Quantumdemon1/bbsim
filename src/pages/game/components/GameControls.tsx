
import React from 'react';
import GameActionsToolbar from '@/components/game-ui/GameActionsToolbar';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface GameControlsProps {
  players: PlayerData[];
}

const GameControls: React.FC<GameControlsProps> = ({ players }) => {
  return (
    <GameActionsToolbar players={players} />
  );
};

export default GameControls;
