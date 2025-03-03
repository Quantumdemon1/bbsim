
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlayerData } from '@/components/PlayerProfileTypes';
import { WeekSummary } from '@/hooks/game-phases/types';
import { Alliance } from '@/contexts/types';
import { 
  Crown, 
  Target, 
  Shield, 
  UserX, 
  ArrowRight, 
  Hourglass,
} from 'lucide-react';

// Import the new components
import SummarySection from './summary/SummarySection';
import PlayerStatsTable from './summary/PlayerStatsTable';
import AllianceSection from './summary/AllianceSection';

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
  const currentSummary = weekSummaries.find(summary => summary.week === currentWeek) || weekSummaries[weekSummaries.length - 1];
  
  if (!currentSummary) {
    return <div className="text-center p-8">No summary available for this week</div>;
  }
  
  // Get player objects from IDs in the summary
  const hohPlayer = players.find(p => p.id === currentSummary.hoh);
  const vetoWinner = players.find(p => p.id === currentSummary.vetoWinner);
  const initialNominees = currentSummary.nominees.map(id => players.find(p => p.id === id)).filter(Boolean) as PlayerData[];
  const finalNominees = (currentSummary.finalNominees || currentSummary.nominees).map(id => players.find(p => p.id === id)).filter(Boolean) as PlayerData[];
  const evictedPlayer = players.find(p => p.id === currentSummary.evicted);
  
  const vetoUsed = currentSummary.vetoUsed || initialNominees.some(nominee => 
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
      <h2 className="text-2xl font-bold text-center mb-6">Week {currentSummary.week} Summary</h2>
      
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
        <AllianceSection alliances={alliances} />
        
        {/* Player Stats Table */}
        <PlayerStatsTable 
          players={players} 
          currentSummary={currentSummary}
        />
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

export default WeeklySummary;
