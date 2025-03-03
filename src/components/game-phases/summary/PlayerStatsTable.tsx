
import React from 'react';
import PlayerProfile from '@/components/PlayerProfile';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
} from "@/components/ui/table";

interface PlayerStatsTableProps {
  players: PlayerData[];
  currentSummary: {
    hoh: string | null;
    evicted: string | null;
    finalNominees?: string[];
    nominees: string[];
    vetoWinner?: string | null;
  };
}

const PlayerStatsTable: React.FC<PlayerStatsTableProps> = ({
  players,
  currentSummary
}) => {
  const finalNominees = currentSummary.finalNominees || currentSummary.nominees;
  
  return (
    <div className="bg-game-dark/30 rounded-lg p-4 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-3">Player Statistics</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>HoH Wins</TableHead>
            <TableHead>Veto Wins</TableHead>
            <TableHead>Times Nominated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players
            .filter(p => p.status !== 'evicted' || p.id === currentSummary.evicted)
            .map(player => (
              <TableRow key={player.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <PlayerProfile player={player} size="sm" />
                    <span className="ml-2">{player.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {player.id === currentSummary.hoh ? 'HoH' : 
                   player.id === currentSummary.evicted ? 'Evicted' :
                   finalNominees.some(id => id === player.id) ? 'Nominated' :
                   player.id === currentSummary.vetoWinner ? 'Veto' : 'Safe'}
                </TableCell>
                <TableCell>{player.stats?.hohWins || 0}</TableCell>
                <TableCell>{player.stats?.povWins || 0}</TableCell>
                <TableCell>{player.stats?.timesNominated || 0}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PlayerStatsTable;
