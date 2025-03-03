import React from 'react';
import { Button } from "@/components/ui/button";
import PlayerProfile from '@/components/PlayerProfile';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface VetoCeremonyProps {
  players: PlayerData[];
  nominees: string[];
  veto: string | null;
  onAction: (action: string, data?: any) => void;
}

const VetoCeremony: React.FC<VetoCeremonyProps> = ({
  players,
  nominees,
  veto,
  onAction
}) => {
  const [selectedNominee, setSelectedNominee] = React.useState<string | null>(null);
  
  const vetoHolder = players.find(p => p.id === veto);
  const nomineeProfiles = players.filter(p => nominees.includes(p.id));
  
  const handleUseVeto = () => {
    if (selectedNominee) {
      onAction('vetoAction', 'use');
    }
  };
  
  const handleDoNotUseVeto = () => {
    onAction('vetoAction', 'noUse');
  };
  
  return (
    <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-6">Veto Ceremony</h2>
      
      {vetoHolder && (
        <div className="mb-8">
          <p className="text-center text-gray-300 mb-4">Power of Veto Holder:</p>
          <div className="flex justify-center">
            <PlayerProfile key={vetoHolder.id} player={vetoHolder} size="lg" showDetails={true} />
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <p className="text-center text-gray-300 mb-4">Current Nominees:</p>
        <div className="flex justify-center gap-8">
          {nomineeProfiles.map(player => (
            <div 
              key={player.id} 
              className={`cursor-pointer transition-transform transform ${selectedNominee === player.id ? 'scale-110 ring-4 ring-game-accent rounded-lg' : 'hover:scale-105'}`}
              onClick={() => setSelectedNominee(player.id)}
            >
              <PlayerProfile player={player} showDetails={true} />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          className="bg-game-accent hover:bg-game-highlight text-black px-8 py-4 rounded-md button-glow"
          onClick={handleUseVeto}
          disabled={selectedNominee === null}
        >
          Use Veto
        </Button>
        
        <Button 
          className="bg-gray-700 hover:bg-gray-800 text-white px-8 py-4 rounded-md"
          onClick={handleDoNotUseVeto}
        >
          Do Not Use Veto
        </Button>
      </div>
    </div>
  );
};

export default VetoCeremony;
