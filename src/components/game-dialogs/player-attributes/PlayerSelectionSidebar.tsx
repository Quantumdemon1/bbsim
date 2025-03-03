
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface PlayerSelectionSidebarProps {
  players: PlayerData[];
  selectedPlayer: string | null;
  setSelectedPlayer: (playerId: string) => void;
  onRandomizeSelected: () => void;
  onRandomizeAll: () => void;
}

const PlayerSelectionSidebar: React.FC<PlayerSelectionSidebarProps> = ({
  players,
  selectedPlayer,
  setSelectedPlayer,
  onRandomizeSelected,
  onRandomizeAll
}) => {
  return (
    <div className="bg-game-medium p-4 rounded-lg col-span-1">
      <h3 className="font-medium mb-2">Select Player</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {players.map(player => (
            <div 
              key={player.id}
              className={`flex items-center p-2 cursor-pointer rounded ${
                selectedPlayer === player.id ? 'bg-red-500/20 border border-red-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setSelectedPlayer(player.id)}
            >
              <img 
                src={player.image} 
                alt={player.name} 
                className="w-10 h-10 rounded-full mr-2 object-cover" 
              />
              <div>
                <div className="font-medium">{player.name}</div>
                <div className="text-xs text-gray-400">
                  {player.status === 'evicted' ? 'Evicted' : player.status || 'Active'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="mt-4 space-y-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={onRandomizeSelected}
          disabled={!selectedPlayer}
        >
          Randomize Selected
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={onRandomizeAll}
        >
          Randomize All Players
        </Button>
      </div>
    </div>
  );
};

export default PlayerSelectionSidebar;
