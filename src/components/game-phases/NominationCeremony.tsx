
import React from 'react';
import { Button } from "@/components/ui/button";
import PlayerProfile, { PlayerData } from '@/components/PlayerProfile';

interface NominationCeremonyProps {
  players: PlayerData[];
  hoh: string | null;
  selectedPlayers: string[];
  onPlayerSelect: (playerId: string) => void;
  onAction: (action: string) => void;
}

const NominationCeremony: React.FC<NominationCeremonyProps> = ({
  players,
  hoh,
  selectedPlayers,
  onPlayerSelect,
  onAction
}) => {
  return (
    <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-6">Nomination Ceremony</h2>
      
      {hoh && (
        <div className="mb-8">
          <p className="text-center text-gray-300 mb-4">Current Head of Household:</p>
          <div className="flex justify-center">
            {players.filter(p => p.id === hoh).map(player => (
              <PlayerProfile key={player.id} player={player} size="lg" showDetails={true} />
            ))}
          </div>
        </div>
      )}
      
      <p className="text-center mb-8 text-gray-300">Select two houseguests to nominate for eviction:</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
        {players
          .filter(p => p.id !== hoh && p.status !== 'evicted')
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
          className="bg-game-accent hover:bg-game-highlight text-black px-8 py-6 text-lg rounded-md button-glow"
          onClick={() => onAction('nominate')}
          disabled={selectedPlayers.length !== 2}
        >
          Confirm Nominations
        </Button>
      </div>
    </div>
  );
};

export default NominationCeremony;
