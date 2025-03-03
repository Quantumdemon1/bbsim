
import React from 'react';
import { Button } from "@/components/ui/button";
import PlayerProfile, { PlayerData } from '@/components/PlayerProfile';

interface VetoCeremonyProps {
  players: PlayerData[];
  veto: string | null;
  nominees: string[];
  onAction: (action: string, data: string) => void;
}

const VetoCeremony: React.FC<VetoCeremonyProps> = ({
  players,
  veto,
  nominees,
  onAction
}) => {
  return (
    <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-6">Veto Ceremony</h2>
      
      {veto && (
        <div className="mb-8">
          <p className="text-center text-gray-300 mb-4">Current Veto Holder:</p>
          <div className="flex justify-center">
            {players.filter(p => p.id === veto).map(player => (
              <PlayerProfile key={player.id} player={player} size="lg" showDetails={true} />
            ))}
          </div>
        </div>
      )}
      
      <div className="flex flex-col items-center mb-8">
        <p className="text-center text-gray-300 mb-4">Current Nominees:</p>
        <div className="flex gap-8">
          {players
            .filter(p => nominees.includes(p.id))
            .map(player => (
              <PlayerProfile key={player.id} player={player} showDetails={true} />
            ))}
        </div>
      </div>
      
      <p className="text-center mb-8 text-gray-300">
        Choose an action for the Power of Veto:
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          className="bg-game-accent hover:bg-game-highlight text-black px-8 py-6 text-lg rounded-md button-glow"
          onClick={() => onAction('vetoAction', 'use')}
        >
          Use Veto
        </Button>
        
        <Button 
          className="bg-game-medium hover:bg-game-light border border-white/20 text-white px-8 py-6 text-lg rounded-md button-glow"
          onClick={() => onAction('vetoAction', 'dontUse')}
        >
          Don't Use Veto
        </Button>
      </div>
    </div>
  );
};

export default VetoCeremony;
