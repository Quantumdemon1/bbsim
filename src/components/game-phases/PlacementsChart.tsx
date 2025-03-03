import React from 'react';
import { Button } from "@/components/ui/button";
import PlayerProfile, { PlayerData } from '@/components/PlayerProfile';

interface PlacementsChartProps {
  players: PlayerData[];
  onAction: (action: string) => void;
}

const PlacementsChart: React.FC<PlacementsChartProps> = ({
  players,
  onAction
}) => {
  // Sort players by their placements (or status)
  const sortedPlayers = [...players].sort((a, b) => {
    // Winner first
    if (a.status === 'winner') return -1;
    if (b.status === 'winner') return 1;
    
    // Runner-up second
    if (a.status === 'runner-up') return -1;
    if (b.status === 'runner-up') return 1;
    
    // Jurors by their placement
    if (a.status === 'juror' && b.status === 'juror') {
      return (a.placement || 99) - (b.placement || 99);
    }
    
    // Jurors come before evicted
    if (a.status === 'juror') return -1;
    if (b.status === 'juror') return 1;
    
    // Sort by eviction order (placement)
    return (a.placement || 99) - (b.placement || 99);
  });
  
  const winner = sortedPlayers.find(p => p.status === 'winner');
  const runnerUp = sortedPlayers.find(p => p.status === 'runner-up');
  const others = sortedPlayers.filter(p => p.status !== 'winner' && p.status !== 'runner-up');
  
  return (
    <div className="glass-panel p-6 w-full max-w-5xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-6">Final Placements</h2>
      
      {/* Winner and Runner-up Section */}
      <div className="flex flex-col sm:flex-row justify-center gap-8 mb-8">
        {winner && (
          <div className="flex flex-col items-center">
            <div className="relative">
              <PlayerProfile player={winner} size="xl" showDetails={true} />
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold border-2 border-white">
                1st
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-xl font-bold text-yellow-500">{winner.name}</div>
              <div className="text-lg font-semibold">Winner</div>
              <div className="text-sm text-gray-300">5 Jury Votes</div>
            </div>
          </div>
        )}
        
        {runnerUp && (
          <div className="flex flex-col items-center">
            <div className="relative">
              <PlayerProfile player={runnerUp} size="xl" showDetails={true} />
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-black font-bold border-2 border-white">
                2nd
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-xl font-bold text-gray-400">{runnerUp.name}</div>
              <div className="text-lg font-semibold">Runner-Up</div>
              <div className="text-sm text-gray-300">2 Jury Votes</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Other Players Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
        {others.map((player, index) => (
          <div key={player.id} className="flex flex-col items-center">
            <div className="relative">
              <PlayerProfile player={player} size="md" />
              <div className={`absolute -top-2 -right-2 w-8 h-8 ${index === 0 ? 'bg-orange-500' : 'bg-gray-600'} rounded-full flex items-center justify-center text-white text-sm font-bold border border-white`}>
                {(index + 3)}
              </div>
            </div>
            <div className="mt-2 text-center">
              <div className="text-sm font-semibold">{player.name}</div>
              <div className="text-xs text-gray-400">
                {player.status === 'juror' ? 'Juror' : 'Pre-Jury'}
                {player.status === 'juror' && player.juryVotes && 
                  <span> • {player.juryVotes} {player.juryVotes === 1 ? 'Vote' : 'Votes'}</span>
                }
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button 
          className="bg-game-accent hover:bg-game-highlight text-black px-8 py-6 text-lg rounded-md button-glow"
          onClick={() => onAction('showFinaleStats')}
        >
          Show Final Statistics
        </Button>
      </div>
    </div>
  );
};

export default PlacementsChart;
