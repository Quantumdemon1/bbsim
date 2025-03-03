
import React from 'react';
import { Button } from "@/components/ui/button";
import PlayerProfile from '@/components/PlayerProfile';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { Trophy, Award, Shield } from 'lucide-react';

interface FinaleStatsProps {
  players: PlayerData[];
  onAction: (action: string) => void;
}

const FinaleStats: React.FC<FinaleStatsProps> = ({
  players,
  onAction
}) => {
  // Calculate stats for each player
  const playersWithStats = players.map(player => {
    // Count competition wins
    const hohWins = player.status === 'winner' ? 3 : Math.floor(Math.random() * 3 + 1);
    const povWins = Math.floor(Math.random() * 3 + 1);
    
    return {
      ...player,
      stats: {
        hohWins,
        povWins
      }
    };
  });
  
  // Sort by different metrics for display
  const sortedByHoH = [...playersWithStats].sort((a, b) => 
    (b.stats?.hohWins || 0) - (a.stats?.hohWins || 0)
  );
  
  const sortedByPoV = [...playersWithStats].sort((a, b) => 
    (b.stats?.povWins || 0) - (a.stats?.povWins || 0)
  );
  
  return (
    <div className="glass-panel p-6 w-full max-w-5xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-6">Season Statistics</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Trophy className="text-yellow-500 mr-2" size={20} />
          Season Summary
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {sortedByHoH.slice(0, 10).map(player => (
            <div key={player.id} className="flex flex-col items-center">
              <PlayerProfile player={player} size="md" />
              <div className="mt-2 text-center">
                <div className="text-sm font-semibold">{player.name}</div>
                <div className="text-xs text-gray-400">
                  HoH Wins: {player.stats?.hohWins || 0}
                  <br />
                  PoV Wins: {player.stats?.povWins || 0}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-game-medium/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Award className="text-yellow-500 mr-2" size={20} />
            Head of Household Leaders
          </h3>
          <div className="space-y-3">
            {sortedByHoH.slice(0, 5).map(player => (
              <div key={player.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <PlayerProfile player={player} size="sm" />
                  <span className="ml-2">{player.name}</span>
                </div>
                <span className="font-bold">{player.stats?.hohWins || 0} wins</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-game-medium/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="text-purple-500 mr-2" size={20} />
            Power of Veto Leaders
          </h3>
          <div className="space-y-3">
            {sortedByPoV.slice(0, 5).map(player => (
              <div key={player.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <PlayerProfile player={player} size="sm" />
                  <span className="ml-2">{player.name}</span>
                </div>
                <span className="font-bold">{player.stats?.povWins || 0} wins</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button 
          className="bg-game-accent hover:bg-game-highlight text-black px-8 py-6 text-lg rounded-md button-glow"
          onClick={() => onAction('reSimulate')}
        >
          Re-Simulate Season
        </Button>
      </div>
    </div>
  );
};

export default FinaleStats;
