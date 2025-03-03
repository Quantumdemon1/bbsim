
import React from 'react';
import { Button } from "@/components/ui/button";
import PlayerProfile from '@/components/PlayerProfile';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { Trophy } from 'lucide-react';

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
    <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-6">Special Competition</h2>
      
      <div className="flex items-center justify-center mb-6">
        <Trophy className="text-yellow-400 h-14 w-14 mr-3" />
        <p className="text-xl text-yellow-300">Winner gets a special power!</p>
      </div>
      
      <p className="text-center mb-8 text-gray-300">Select a player to win the special competition:</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
        {players
          .filter(p => p.status !== 'evicted')
          .map(player => (
            <PlayerProfile
              key={player.id}
              player={player}
              onClick={() => onPlayerSelect(player.id)}
              selected={selectedPlayers.includes(player.id)}
              showDetails={true}
            />
          ))}
      </div>
      
      <div className="flex justify-center mt-4">
        <Button 
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-6 text-lg rounded-md button-glow"
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
