
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import PlayerProfile from '@/components/PlayerProfile';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { usePoVPhase } from '@/hooks/game-phases/usePoVPhase';

interface PoVCompetitionProps {
  players: PlayerData[];
  selectedPlayers: string[];
  onPlayerSelect: (playerId: string) => void;
  onAction: (action: string) => void;
  hoh: string | null;
  nominees: string[];
}

const PoVCompetition: React.FC<PoVCompetitionProps> = ({
  players,
  selectedPlayers,
  onPlayerSelect,
  onAction,
  hoh,
  nominees
}) => {
  const [vetoPlayers, setVetoPlayers] = useState<string[]>([]);
  
  // Use the usePoVPhase hook to select veto players
  const povPhase = usePoVPhase({
    players,
    setPlayers: () => {}, // We don't need this functionality here
    selectedPlayers: [],
    setVeto: () => {}, 
    setStatusMessage: () => {},
    setPhase: () => {},
    setSelectedPlayers: () => {},
    hoh,
    nominees,
    setVetoUsed: () => {},
    toast: { toast: () => {} }
  });
  
  useEffect(() => {
    // Select 6 players for the veto competition
    if (povPhase.selectVetoPlayers) {
      const selected = povPhase.selectVetoPlayers();
      setVetoPlayers(selected);
    }
  }, [hoh, nominees]);
  
  return (
    <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-6">Power of Veto Competition</h2>
      <p className="text-center mb-4 text-gray-300">Select a player to win the Power of Veto:</p>
      
      <div className="bg-game-dark/50 p-4 rounded-md mb-6">
        <h3 className="text-center text-lg font-semibold mb-2 text-game-accent">Veto Players</h3>
        <p className="text-center text-sm mb-4 text-gray-400">
          In Big Brother, 6 players compete in the Power of Veto competition: the HoH, the two nominees, and three randomly selected houseguests.
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-2">
          {vetoPlayers.map(playerId => {
            const player = players.find(p => p.id === playerId);
            if (!player) return null;
            
            let roleLabel = '';
            if (player.id === hoh) roleLabel = 'HoH';
            else if (nominees.includes(player.id)) roleLabel = 'Nominee';
            else roleLabel = 'Random';
            
            return (
              <div key={player.id} className="text-center">
                <div className="relative">
                  <div className="w-16 h-16">
                    <img 
                      src={player.image || '/placeholder.svg'} 
                      alt={player.name} 
                      className="w-full h-full rounded-full object-cover border-2 border-gray-700" 
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-game-accent text-black text-xs px-1 rounded-full">
                    {roleLabel}
                  </div>
                </div>
                <div className="text-xs mt-1 font-medium text-white/80">{player.name}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
        {players
          .filter(p => p.status !== 'evicted' && vetoPlayers.includes(p.id))
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
          onClick={() => onAction('selectVeto')}
          disabled={selectedPlayers.length !== 1}
        >
          Confirm Selection
        </Button>
      </div>
    </div>
  );
};

export default PoVCompetition;
