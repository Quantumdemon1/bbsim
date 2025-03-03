
import React from 'react';
import { Button } from "@/components/ui/button";
import PlayerProfile from '@/components/PlayerProfile';
import { PlayerData } from '@/components/PlayerProfile';
import { WeekSummary } from '@/hooks/game-phases/types';
import { Alliance } from '@/contexts/types';
import { 
  Crown, 
  Target, 
  Shield, 
  UserX, 
  ArrowRight, 
  Hourglass,
  Users
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
} from "@/components/ui/table";

interface WeeklySummaryProps {
  players: PlayerData[];
  weekSummaries: WeekSummary[];
  currentWeek: number;
  onAction: (action: string) => void;
  alliances?: Alliance[];
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({
  players,
  weekSummaries,
  currentWeek,
  onAction,
  alliances = []
}) => {
  const currentSummary = weekSummaries.find(summary => summary.weekNumber === currentWeek) || weekSummaries[weekSummaries.length - 1];
  
  if (!currentSummary) {
    return <div className="text-center p-8">No summary available for this week</div>;
  }
  
  // Get player objects from IDs in the summary
  const hohPlayer = players.find(p => p.id === currentSummary.hoh);
  const vetoWinner = players.find(p => p.id === currentSummary.vetoWinner);
  const initialNominees = currentSummary.nominees.map(id => players.find(p => p.id === id)).filter(Boolean) as PlayerData[];
  const finalNominees = currentSummary.finalNominees.map(id => players.find(p => p.id === id)).filter(Boolean) as PlayerData[];
  const evictedPlayer = players.find(p => p.id === currentSummary.evicted);
  
  const vetoUsed = initialNominees.some(nominee => 
    !finalNominees.some(finalNom => finalNom.id === nominee.id)
  );
  
  // Find the replacement nominee if veto was used
  const replacementNominee = finalNominees.find(nominee => 
    !initialNominees.some(initialNom => initialNom.id === nominee.id)
  );
  
  // Find the saved nominee if veto was used
  const savedNominee = initialNominees.find(nominee => 
    !finalNominees.some(finalNom => finalNom.id === nominee.id)
  );
  
  return (
    <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-6">Week {currentSummary.weekNumber} Summary</h2>
      
      <div className="space-y-8">
        {/* Head of Household */}
        <SummarySection 
          title="Head of Household" 
          icon={<Crown className="text-yellow-500" />}
          players={hohPlayer ? [hohPlayer] : []}
        />
        
        {/* Initial Nominations */}
        <SummarySection 
          title="Initial Nominations" 
          icon={<Target className="text-red-500" />}
          players={initialNominees}
        />
        
        {/* Veto Competition */}
        <SummarySection 
          title="Power of Veto Winner" 
          icon={<Shield className="text-purple-500" />}
          players={vetoWinner ? [vetoWinner] : []}
          details={vetoUsed ? 
            `${vetoWinner?.name} used the Veto on ${savedNominee?.name}` : 
            vetoWinner ? `${vetoWinner.name} did not use the Veto` : undefined
          }
        />
        
        {/* Replacement Nominee (if veto was used) */}
        {vetoUsed && replacementNominee && (
          <SummarySection 
            title="Replacement Nominee" 
            icon={<ArrowRight className="text-amber-500" />}
            players={[replacementNominee]}
            details={`${hohPlayer?.name} nominated ${replacementNominee.name} as the replacement`}
          />
        )}
        
        {/* Final Nominees */}
        <SummarySection 
          title="Final Nominees" 
          icon={<Hourglass className="text-blue-500" />}
          players={finalNominees}
        />
        
        {/* Eviction */}
        <SummarySection 
          title="Evicted Houseguest" 
          icon={<UserX className="text-red-600" />}
          players={evictedPlayer ? [evictedPlayer] : []}
          details={evictedPlayer && currentSummary.evictionVotes ? 
            `Evicted by a vote of ${currentSummary.evictionVotes}` : undefined
          }
        />
        
        {/* Current Alliances */}
        {alliances && alliances.length > 0 && (
          <div className="bg-game-dark/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Users className="text-teal-500 mr-2" size={20} />
              Current Alliances
            </h3>
            <div className="flex flex-wrap gap-2">
              {alliances.map(alliance => (
                <div key={alliance.id} className="bg-game-dark/50 rounded-full px-3 py-1 text-sm">
                  {alliance.name} 
                  <span className="ml-1 text-xs text-gray-400">
                    ({alliance.members.length})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Player Stats Table */}
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
                       finalNominees.some(n => n.id === player.id) ? 'Nominated' :
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
      </div>
      
      <div className="flex justify-center mt-8">
        <Button 
          className="bg-game-accent hover:bg-game-highlight text-black px-8 py-6 text-lg rounded-md button-glow"
          onClick={() => {
            if (currentWeek === weekSummaries.length) {
              onAction('nextWeek'); // Go to next week if we're at the current week
            } else {
              onAction('showPlacements'); // Otherwise show placements
            }
          }}
        >
          {currentWeek === weekSummaries.length ? "Continue to Next Week" : "View Final Placements"}
        </Button>
      </div>
    </div>
  );
};

interface SummarySectionProps {
  title: string;
  icon: React.ReactNode;
  players: PlayerData[];
  details?: string;
}

const SummarySection: React.FC<SummarySectionProps> = ({
  title,
  icon,
  players,
  details
}) => {
  return (
    <div className="bg-game-dark/30 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <span className="mr-2">{icon}</span>
        {title}
      </h3>
      
      <div className="flex flex-wrap gap-6 justify-center">
        {players.map(player => (
          <div key={player.id} className="flex flex-col items-center">
            <PlayerProfile player={player} size="md" />
            <div className="mt-2 text-center">
              <div className="text-sm font-semibold">{player.name}</div>
            </div>
          </div>
        ))}
      </div>
      
      {details && (
        <p className="text-center text-sm text-gray-400 mt-3">{details}</p>
      )}
    </div>
  );
};

export default WeeklySummary;
