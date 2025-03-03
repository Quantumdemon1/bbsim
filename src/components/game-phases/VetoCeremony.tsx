
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import PlayerProfile, { PlayerData } from '@/components/PlayerProfile';
import { Card, CardContent } from "@/components/ui/card";

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
  const [selectedNominee, setSelectedNominee] = useState<string | null>(null);
  const vetoHolder = players.find(p => p.id === veto);
  const nomineeProfiles = players.filter(p => nominees.includes(p.id));
  
  return (
    <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-6">Veto Ceremony</h2>
      
      {veto && (
        <div className="mb-8">
          <p className="text-center text-gray-300 mb-4">Current Veto Holder:</p>
          <div className="flex justify-center">
            {vetoHolder && (
              <PlayerProfile key={vetoHolder.id} player={vetoHolder} size="lg" showDetails={true} />
            )}
          </div>
        </div>
      )}
      
      <div className="flex flex-col items-center mb-8">
        <p className="text-center text-gray-300 mb-4">Current Nominees:</p>
        <div className="flex gap-8">
          {nomineeProfiles.map(player => (
            <div 
              key={player.id} 
              className={`cursor-pointer ${selectedNominee === player.id ? 'ring-2 ring-game-accent' : ''}`}
              onClick={() => setSelectedNominee(player.id)}
            >
              <PlayerProfile player={player} showDetails={true} />
              {selectedNominee === player.id && (
                <div className="text-center mt-2 text-game-accent font-semibold">
                  Selected to save
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          className="bg-game-accent hover:bg-game-highlight text-black px-8 py-6 text-lg rounded-md button-glow"
          onClick={() => onAction('vetoAction', selectedNominee ? 'use' : 'dontUse')}
          disabled={selectedNominee === null && vetoHolder}
        >
          {selectedNominee ? `Use Veto on ${players.find(p => p.id === selectedNominee)?.name}` : "Don't Use Veto"}
        </Button>
      </div>
    </div>
  );
};

export default VetoCeremony;
