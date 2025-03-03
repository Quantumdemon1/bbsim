
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlayerData } from '@/components/PlayerProfileTypes';
import { User } from 'lucide-react';

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
    <div className="glass-panel p-6 w-full max-w-6xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-4">Power of Veto Competition</h2>
      
      <p className="text-center mb-8 text-gray-300">
        Select a player to win the Power of Veto:
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        {eligiblePlayers.map(player => (
          <div
            key={player.id}
            className={`bg-game-dark p-4 rounded-lg cursor-pointer transition-all ${
              selectedPlayers.includes(player.id) ? 'ring-2 ring-purple-500' : 'hover:bg-game-medium/50'
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
                {player.id === hoh && (
                  <div className="absolute top-1 right-1 bg-yellow-500 text-black text-xs font-bold px-1 rounded">HoH</div>
                )}
                {nominees.includes(player.id) && (
                  <div className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-1 rounded">NOM</div>
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
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg rounded-md"
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
