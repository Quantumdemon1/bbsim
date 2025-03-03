
import React from 'react';
import { Button } from "@/components/ui/button";
import PlayerProfile, { PlayerData } from '@/components/PlayerProfile';

interface EvictionProps {
  players: PlayerData[];
  selectedPlayers: string[];
  statusMessage: string;
  week: number;
  onAction: (action: string) => void;
}

const Eviction: React.FC<EvictionProps> = ({
  players,
  selectedPlayers,
  statusMessage,
  week,
  onAction
}) => {
  return (
    <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-6">Eviction Results</h2>
      
      <p className="text-center mb-8 text-xl">
        {statusMessage}
      </p>
      
      <div className="flex justify-center mb-8">
        {players
          .filter(p => p.status === 'evicted' && p.id === selectedPlayers[0])
          .map(player => (
            <PlayerProfile key={player.id} player={player} size="lg" />
          ))}
      </div>
      
      <div className="flex justify-center">
        <Button 
          className="bg-game-accent hover:bg-game-highlight text-black px-8 py-6 text-lg rounded-md button-glow"
          onClick={() => onAction('nextWeek')}
        >
          Continue to Week {week + 1}
        </Button>
      </div>
    </div>
  );
};

export default Eviction;
