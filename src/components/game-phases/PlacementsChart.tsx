import React from 'react';
import { Trophy, Award, Medal } from 'lucide-react';
import PlayerProfile from '@/components/PlayerProfile';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface PlacementsChartProps {
  players: PlayerData[];
  finalists: string[];
  jurors: string[];
  votes: Record<string, string>;
  onAction: (action: string) => void;
}

const PlacementsChart: React.FC<PlacementsChartProps> = ({
  players,
  finalists,
  jurors,
  votes,
  onAction
}) => {
  // Sort players by placement
  // Prepare players with placements
  const winner = players.find(p => p.status === 'winner');
  const runnerUp = players.find(p => p.status === 'runner-up');
  
  const allPlayers = [...players].map(player => {
    // Determine placement based on status
    let placement = 0;
    if (player.status === 'winner') {
      placement = 1;
    } else if (player.status === 'runner-up') {
      placement = 2;
    } else if (jurors.includes(player.id)) {
      // Jurors are placed 3 through 9 (or however many)
      placement = 3 + jurors.indexOf(player.id);
    } else if (player.status === 'evicted') {
      // Early evictees
      placement = jurors.length + 3 + Math.floor(Math.random() * 5);
    }
    
    return {
      ...player,
      stats: {
        ...(player.stats || {}),
        placement
      }
    };
  });
  
  // Sort by placement
  const sortedPlayers = [...allPlayers].sort((a, b) => 
    (a.stats?.placement || 999) - (b.stats?.placement || 999)
  );
  
  return (
    <div className="glass-panel p-6 w-full max-w-5xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-6">Final Placements</h2>
      
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Winner - 1st Place */}
          {winner && (
            <div className="col-span-1 md:col-span-3 flex flex-col items-center">
              <div className="relative">
                <PlayerProfile player={winner} size="lg" />
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-white animate-pulse-gold">
                  <Trophy size={28} />
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-3xl font-bold">{winner.name}</div>
                <div className="text-xl text-yellow-500 font-semibold">WINNER</div>
                <div className="text-gray-300 mt-2">
                  {Object.values(votes).filter(v => v === winner.id).length} Jury Votes
                </div>
              </div>
            </div>
          )}
          
          {/* Runner Up - 2nd Place */}
          {runnerUp && (
            <div className="col-span-1 md:col-start-2 md:col-span-1 flex flex-col items-center">
              <div className="relative">
                <PlayerProfile player={runnerUp} size="lg" />
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white">
                  <Medal size={22} />
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-2xl font-bold">{runnerUp.name}</div>
                <div className="text-lg text-gray-400 font-semibold">RUNNER-UP</div>
                <div className="text-gray-300 mt-2">
                  {Object.values(votes).filter(v => v === runnerUp.id).length} Jury Votes
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Jury Members - 3rd through 9th */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Award className="text-purple-500 mr-2" size={20} />
          Jury Members
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {sortedPlayers
            .filter(p => jurors.includes(p.id))
            .map((player, index) => (
              <div key={player.id} className="flex flex-col items-center">
                <PlayerProfile player={player} size="md" />
                <div className="mt-2 text-center">
                  <div className="text-sm font-semibold">{player.name}</div>
                  <div className="text-xs text-gray-400">
                    {index + 3}rd Place
                    {player.stats?.juryVotes !== undefined && 
                      <span> • Voted for {
                        votes[player.id] ? players.find(p => p.id === votes[player.id])?.name : "Unknown"
                      }</span>
                    }
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      
      {/* Pre-Jury - 10+ */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Pre-Jury Evictees</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {sortedPlayers
            .filter(p => p.status === 'evicted' && !jurors.includes(p.id))
            .map((player, index) => (
              <div key={player.id} className="flex flex-col items-center">
                <PlayerProfile player={player} size="sm" />
                <div className="mt-2 text-center">
                  <div className="text-sm font-semibold">{player.name}</div>
                  <div className="text-xs text-gray-400">
                    {index + jurors.length + 3}th Place
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PlacementsChart;
