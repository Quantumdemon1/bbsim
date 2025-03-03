
import React from 'react';
import { PlayerData } from '@/components/PlayerProfile';

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
          <div className="flex flex-col items-center text-center">
            <img 
              src={player.image} 
              alt={player.name} 
              className="w-20 h-20 object-cover rounded-md mb-2" 
            />
            <h3 className="font-medium">{player.name}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayerSelectionGrid;
