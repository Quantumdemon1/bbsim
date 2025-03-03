
import React from 'react';
import { useGameContext } from '@/contexts/GameContext';
import ProfileCard from '@/components/profile/ProfileCard';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface PlayersTabProps {
  onPlayerSelect: (player: PlayerData) => void;
}

const PlayersTab = ({ onPlayerSelect }: PlayersTabProps) => {
  const { players } = useGameContext();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {players.map(player => (
        <ProfileCard 
          key={player.id} 
          player={player} 
          onClick={() => onPlayerSelect(player)}
        />
      ))}
    </div>
  );
};

export default PlayersTab;
