
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlayerData } from '@/components/PlayerProfileTypes';
import { User } from 'lucide-react';

interface HoHCompetitionProps {
  players: PlayerData[];
  selectedPlayers: string[];
  onPlayerSelect: (playerId: string) => void;
  onAction: (action: string) => void;
}

const HoHCompetition: React.FC<HoHCompetitionProps> = ({
  players,
  selectedPlayers,
  onPlayerSelect,
  onAction
}) => {
  return (
    <div className="glass-panel p-6 w-full max-w-6xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-4">Head of Household Competition</h2>
      <p className="text-center mb-8 text-gray-300">Select a player to be the new Head of Household:</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {players
          .filter(p => p.status !== 'evicted')
          .map(player => (
            <div
              key={player.id}
              className={`bg-game-dark p-4 rounded-lg cursor-pointer transition-all ${
                selectedPlayers.includes(player.id) ? 'ring-2 ring-red-500' : 'hover:bg-game-medium/50'
              }`}
              onClick={() => onPlayerSelect(player.id)}
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
      
      <div className="flex justify-center mt-6">
        <Button 
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg rounded-md"
          onClick={() => onAction('selectHOH')}
          disabled={selectedPlayers.length !== 1}
        >
          Confirm Selection
        </Button>
      </div>
    </div>
  );
};

export default HoHCompetition;
