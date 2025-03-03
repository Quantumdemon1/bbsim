
import React from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import PlayerProfile from '@/components/PlayerProfile';

interface PlayerSelectionGridProps {
  players: PlayerData[];
  selectedPlayer: string | null;
  setSelectedPlayer: (id: string) => void;
}

const PlayerSelectionGrid: React.FC<PlayerSelectionGridProps> = ({ 
  players, 
  selectedPlayer, 
  setSelectedPlayer 
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {players.filter(p => p.status !== 'evicted').map(player => (
        <div 
          key={player.id} 
          className={`bg-game-medium p-4 rounded-lg cursor-pointer transition-all ${
            selectedPlayer === player.id ? 'ring-2 ring-game-accent' : 'hover:bg-game-light/20'
          }`}
          onClick={() => setSelectedPlayer(player.id)}
        >
          <PlayerProfile 
            player={player} 
            size="sm"
            selected={selectedPlayer === player.id}
          />
        </div>
      ))}
    </div>
  );
};

export default PlayerSelectionGrid;
