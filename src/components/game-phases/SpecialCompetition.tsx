
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlayerData } from '@/components/PlayerProfileTypes';
import { User, Trophy } from 'lucide-react';

interface SpecialCompetitionProps {
  players: PlayerData[];
  selectedPlayers: string[];
  onPlayerSelect: (playerId: string) => void;
  onAction: (action: string) => void;
}

const SpecialCompetition: React.FC<SpecialCompetitionProps> = ({
  players,
  selectedPlayers,
  onPlayerSelect,
  onAction
}) => {
  return (
    <div className="glass-panel p-6 w-full max-w-6xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-4">Special Competition</h2>
      
      <div className="flex items-center justify-center mb-6">
        <Trophy className="text-yellow-400 h-12 w-12 mr-3" />
        <p className="text-xl text-yellow-300">Winner gets a special power!</p>
      </div>
      
      <p className="text-center mb-8 text-gray-300">Select a player to win the special competition:</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {players
          .filter(p => p.status !== 'evicted')
          .map(player => (
            <div
              key={player.id}
              className={`bg-game-dark p-4 rounded-lg cursor-pointer transition-all ${
                selectedPlayers.includes(player.id) ? 'ring-2 ring-yellow-500' : 'hover:bg-game-medium/50'
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
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 text-lg rounded-md"
          onClick={() => onAction('specialCompetition')}
          disabled={selectedPlayers.length !== 1}
        >
          Award Power-Up
        </Button>
      </div>
    </div>
  );
};

export default SpecialCompetition;
