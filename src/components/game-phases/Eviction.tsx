
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
  const evictedPlayer = players.find(p => p.id === selectedPlayers[0]);
  
  return (
    <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-6">Eviction Results</h2>
      
      <p className="text-center mb-8 text-xl">
        {statusMessage || "The votes are in..."}
      </p>
      
      {evictedPlayer && (
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <PlayerProfile player={evictedPlayer} size="xl" />
            <div className="absolute -top-4 -right-4 w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white">
              OUT
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="text-2xl font-bold">{evictedPlayer.name}</div>
            <div className="text-lg text-red-500 font-semibold">EVICTED</div>
            <div className="text-gray-400 mt-2">By a vote of 5-2</div>
          </div>
        </div>
      )}
      
      <div className="flex justify-center">
        <Button 
          className="bg-game-accent hover:bg-game-highlight text-black px-8 py-6 text-lg rounded-md button-glow"
          onClick={() => onAction('nextWeek')}
        >
          View Week Summary
        </Button>
      </div>
    </div>
  );
};

export default Eviction;
