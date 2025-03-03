
import React from 'react';
import { Button } from "@/components/ui/button";
import PlayerProfile, { PlayerData } from '@/components/PlayerProfile';
import { Trophy } from 'lucide-react';

interface WinnerRevealProps {
  players: PlayerData[];
  votes: Record<string, string>;
  finalists: string[];
  onAction: (action: string) => void;
}

const WinnerReveal: React.FC<WinnerRevealProps> = ({
  players,
  votes,
  finalists,
  onAction
}) => {
  // Count votes
  const voteCounts: Record<string, number> = {};
  Object.values(votes).forEach(finalistId => {
    voteCounts[finalistId] = (voteCounts[finalistId] || 0) + 1;
  });
  
  // Find winner (most votes)
  let winnerId = '';
  let maxVotes = 0;
  
  finalists.forEach(finalistId => {
    const finalistVotes = voteCounts[finalistId] || 0;
    if (finalistVotes > maxVotes) {
      winnerId = finalistId;
      maxVotes = finalistVotes;
    }
  });
  
  const winner = players.find(p => p.id === winnerId);
  
  return (
    <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-2">The Winner</h2>
      
      {winner && (
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <PlayerProfile player={winner} size="lg" />
            <div className="absolute -top-4 -right-4 bg-yellow-500 text-black rounded-full p-2">
              <Trophy size={24} />
            </div>
          </div>
          
          <h3 className="text-3xl font-bold mt-4">{winner.name}</h3>
          <p className="text-xl mt-2">
            Winner of Big Brother with {voteCounts[winnerId] || 0} Jury Votes
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-8 mt-8">
        {finalists.map(finalistId => {
          const finalist = players.find(p => p.id === finalistId);
          if (!finalist) return null;
          
          return (
            <div key={finalistId} className="bg-game-medium p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <PlayerProfile player={finalist} size="sm" />
                  <div className="ml-4">
                    <h4 className="font-bold">{finalist.name}</h4>
                    <p className="text-sm text-gray-400">Finalist</p>
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  {voteCounts[finalistId] || 0} votes
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-center mt-8">
        <Button 
          className="bg-game-accent hover:bg-game-highlight text-black px-8 py-6 text-lg rounded-md button-glow"
          onClick={() => onAction('showFinaleStats')}
        >
          View Season Statistics
        </Button>
      </div>
    </div>
  );
};

export default WinnerReveal;
