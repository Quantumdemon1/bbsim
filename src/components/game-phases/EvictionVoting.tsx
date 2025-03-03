
import React from 'react';
import { Button } from "@/components/ui/button";
import PlayerProfile, { PlayerData } from '@/components/PlayerProfile';
import { Users } from 'lucide-react';
import { Alliance } from '@/contexts/types';

interface EvictionVotingProps {
  players: PlayerData[];
  nominees: string[];
  alliances: Alliance[];
  onAction: (action: string, data: string) => void;
}

const EvictionVoting: React.FC<EvictionVotingProps> = ({
  players,
  nominees,
  alliances,
  onAction
}) => {
  return (
    <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-6">Eviction Voting</h2>
      
      <div className="flex flex-col items-center mb-8">
        <p className="text-center text-gray-300 mb-4">Final Nominees:</p>
        <div className="flex gap-8">
          {players
            .filter(p => nominees.includes(p.id))
            .map(player => (
              <PlayerProfile key={player.id} player={player} size="lg" showDetails={true} />
            ))}
        </div>
      </div>
      
      {alliances && alliances.length > 0 && (
        <div className="mb-8">
          <p className="text-center text-gray-300 mb-2">Current Alliances:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {alliances.map(alliance => (
              <div key={alliance.id} className="bg-game-dark/50 rounded px-3 py-1 text-sm flex items-center">
                <Users size={14} className="mr-1" />
                {alliance.name}
                <span className="ml-1 text-xs text-gray-400">({alliance.members.length})</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <p className="text-center mb-8 text-gray-300">
        Select a nominee to evict from the Big Brother house:
      </p>
      
      <div className="flex flex-col sm:flex-row gap-8 justify-center">
        {players
          .filter(p => nominees.includes(p.id))
          .map(player => (
            <div key={player.id} className="flex flex-col items-center">
              <PlayerProfile player={player} showDetails={true} />
              <Button 
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-md button-glow"
                onClick={() => onAction('evict', player.id)}
              >
                Evict {player.name}
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default EvictionVoting;
