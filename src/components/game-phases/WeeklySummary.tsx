
import React from 'react';
import { Button } from "@/components/ui/button";
import PlayerProfile, { PlayerData } from '@/components/PlayerProfile';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WeekSummary } from '@/hooks/game-phases/types';

interface WeeklySummaryProps {
  players: PlayerData[];
  weekSummaries: WeekSummary[];
  currentWeekIndex?: number;
  onAction: (action: string) => void;
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({
  players,
  weekSummaries,
  currentWeekIndex = 0,
  onAction
}) => {
  const weekSummary = weekSummaries[currentWeekIndex] || weekSummaries[weekSummaries.length - 1];
  
  if (!weekSummary) {
    return (
      <div className="glass-panel p-6 w-full max-w-5xl mx-auto animate-scale-in">
        <h2 className="text-2xl font-bold text-center mb-6">No Week Summary Available</h2>
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
  }
  
  const hohPlayer = players.find(p => p.id === weekSummary.hoh);
  const vetoPlayer = players.find(p => p.id === weekSummary.vetoWinner);
  const nomineePlayers = players.filter(p => weekSummary.nominees.includes(p.id));
  const vetoPlayers = players.filter(p => weekSummary.vetoPlayers.includes(p.id));
  const evictedPlayer = players.find(p => p.id === weekSummary.evicted);
  
  return (
    <div className="glass-panel p-6 w-full max-w-5xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-6">Week {weekSummary.weekNumber} Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-game-medium/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Week Overview</h3>
          <ul className="space-y-2">
            <li><span className="font-semibold">Head of Household:</span> {hohPlayer?.name}</li>
            <li>
              <span className="font-semibold">Nominees:</span> {nomineePlayers.map(p => p.name).join(', ')}
            </li>
            <li>
              <span className="font-semibold">Veto Players:</span> {vetoPlayers.map(p => p.name).join(', ')}
            </li>
            <li><span className="font-semibold">Veto Winner:</span> {vetoPlayer?.name}</li>
            <li>
              <span className="font-semibold">Veto Used:</span> {weekSummary.vetoUsed ? 'Yes' : 'No'}
              {weekSummary.vetoUsed && weekSummary.saved && (
                <span> on {players.find(p => p.id === weekSummary.saved)?.name}</span>
              )}
            </li>
            {weekSummary.replacement && (
              <li>
                <span className="font-semibold">Replacement:</span> {players.find(p => p.id === weekSummary.replacement)?.name}
              </li>
            )}
            <li>
              <span className="font-semibold">Final Nominees:</span> {weekSummary.finalNominees.map(id => 
                players.find(p => p.id === id)?.name
              ).join(', ')}
            </li>
            <li>
              <span className="font-semibold">Evicted:</span> {evictedPlayer?.name} 
              {weekSummary.evictionVotes && (
                <span> ({weekSummary.evictionVotes})</span>
              )}
            </li>
          </ul>
        </div>
        
        <div className="bg-game-medium/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Key Players</h3>
          <div className="grid grid-cols-2 gap-4">
            {hohPlayer && (
              <div className="flex flex-col items-center">
                <PlayerProfile player={hohPlayer} size="md" />
                <div className="mt-2 text-center">
                  <div className="text-sm font-semibold">Head of Household</div>
                </div>
              </div>
            )}
            
            {vetoPlayer && (
              <div className="flex flex-col items-center">
                <PlayerProfile player={vetoPlayer} size="md" />
                <div className="mt-2 text-center">
                  <div className="text-sm font-semibold">Veto Winner</div>
                </div>
              </div>
            )}
            
            {evictedPlayer && (
              <div className="flex flex-col items-center">
                <PlayerProfile player={evictedPlayer} size="md" />
                <div className="mt-2 text-center">
                  <div className="text-sm font-semibold text-red-500">Evicted</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table className="min-w-full bg-game-dark/60 rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Player</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Competition Wins</TableHead>
              <TableHead className="text-center">Times Nominated</TableHead>
              <TableHead className="text-center">Saved with Veto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players
              .filter(p => p.status !== 'evicted' || p.id === weekSummary.evicted)
              .map(player => {
                const isHoh = player.id === weekSummary.hoh;
                const isNominated = weekSummary.nominees.includes(player.id);
                const isVetoWinner = player.id === weekSummary.vetoWinner;
                const isEvicted = player.id === weekSummary.evicted;
                
                return (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <PlayerProfile player={player} size="sm" />
                        {player.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {isEvicted ? (
                        <span className="text-red-500 font-semibold">Evicted</span>
                      ) : isHoh ? (
                        <span className="text-yellow-500 font-semibold">HoH</span>
                      ) : isNominated ? (
                        <span className="text-blue-500 font-semibold">Nominated</span>
                      ) : isVetoWinner ? (
                        <span className="text-purple-500 font-semibold">Veto</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {(player.stats?.hohWins || 0) + (player.stats?.povWins || 0)}
                    </TableCell>
                    <TableCell className="text-center">
                      {player.stats?.timesNominated || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      {player.stats?.timesSaved || 0}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-center mt-6">
        <Button 
          className="bg-game-accent hover:bg-game-highlight text-black px-8 py-6 text-lg rounded-md button-glow"
          onClick={() => onAction('nextWeek')}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default WeeklySummary;
