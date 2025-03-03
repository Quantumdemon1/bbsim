
import React from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { User, Bot } from 'lucide-react';

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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {players.filter(p => p.status !== 'evicted').map(player => (
        <div 
          key={player.id} 
          className={`bg-game-dark p-4 rounded-lg cursor-pointer transition-all ${
            selectedPlayer === player.id ? 'ring-2 ring-red-500' : 'hover:bg-game-medium/50'
          }`}
          onClick={() => setSelectedPlayer(player.id)}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className={`relative w-full aspect-square rounded-md overflow-hidden ${player.status === 'evicted' ? 'grayscale' : ''}`}>
              {player.image ? (
                <img 
                  src={player.image} 
                  alt={player.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-game-medium">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
              {/* Show AI indicator */}
              {!player.isHuman && !player.isAdmin && (
                <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-1">
                  <Bot size={14} className="text-white" />
                </div>
              )}
            </div>
            
            <div className="text-center">
              <div className="font-semibold text-sm">{player.name}</div>
              <div className="text-xs text-gray-400">
                {player.age && <span>{player.age}, </span>}
                {player.hometown}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayerSelectionGrid;
