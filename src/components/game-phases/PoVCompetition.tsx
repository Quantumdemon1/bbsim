
import React from 'react';
import { Button } from "@/components/ui/button";
import PlayerProfile from '@/components/PlayerProfile';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface PoVCompetitionProps {
  players: PlayerData[];
  selectedPlayers: string[];
  onPlayerSelect: (playerId: string) => void;
  onAction: (action: string) => void;
  hoh?: string | null;
  nominees?: string[];
}

const PoVCompetition: React.FC<PoVCompetitionProps> = ({
  players,
  selectedPlayers,
  onPlayerSelect,
  onAction,
  hoh = null,
  nominees = []
}) => {
  // Get eligible players for POV competition (HoH, nominees, and randomly selected others)
  const getEligiblePlayers = () => {
    // Start with HoH and nominees
    const eligibleIds = new Set<string>();
    
    // Add HoH
    if (hoh) eligibleIds.add(hoh);
    
    // Add nominees
    nominees.forEach(id => eligibleIds.add(id));
    
    // Get remaining active players who aren't already eligible
    const remainingPlayers = players
      .filter(p => p.status !== 'evicted' && !eligibleIds.has(p.id));
    
    // Randomly select players to get to 6 total
    const neededPlayers = 6 - eligibleIds.size;
    for (let i = 0; i < neededPlayers && i < remainingPlayers.length; i++) {
      const randomIndex = Math.floor(Math.random() * remainingPlayers.length);
      const selectedPlayer = remainingPlayers.splice(randomIndex, 1)[0];
      eligibleIds.add(selectedPlayer.id);
    }
    
    return players.filter(p => eligibleIds.has(p.id));
  };
  
  const eligiblePlayers = getEligiblePlayers();
  
  return (
    <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-6">Power of Veto Competition</h2>
      
      <p className="text-center mb-8 text-gray-300">
        Select a player to win the Power of Veto:
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
        {eligiblePlayers.map(player => (
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
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-md button-glow"
          onClick={() => onAction('selectVeto')}
          disabled={selectedPlayers.length !== 1}
        >
          Confirm Winner
        </Button>
      </div>
    </div>
  );
};

export default PoVCompetition;
