
import React from 'react';
import { Card } from "@/components/ui/card";

const HouseTab = () => {
  return (
    <div className="space-y-4">
      <Card className="bg-game-dark border-game-accent p-4">
        <h3 className="text-xl font-semibold text-game-accent mb-2">The Big Brother House</h3>
        <p className="text-gray-300">
          Welcome to the Big Brother house, where 12 houseguests will compete in challenges, 
          form alliances, and vote each other out until only one remains to claim the grand prize.
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-game-medium/50 p-3 rounded-lg">
            <h4 className="font-medium mb-1">Weekly Schedule</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Head of Household Competition</li>
              <li>• Nomination Ceremony</li>
              <li>• Power of Veto Competition</li>
              <li>• Veto Ceremony</li>
              <li>• Eviction Voting</li>
            </ul>
          </div>
          <div className="bg-game-medium/50 p-3 rounded-lg">
            <h4 className="font-medium mb-1">House Rules</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Form alliances to strengthen your position</li>
              <li>• Win competitions to secure your safety</li>
              <li>• Build relationships with other houseguests</li>
              <li>• Vote strategically at evictions</li>
              <li>• Watch out for unexpected twists!</li>
            </ul>
          </div>
        </div>
      </Card>
      
      <div className="bg-game-dark border border-game-accent/50 rounded-lg p-4">
        <h3 className="text-xl font-semibold text-game-accent mb-2">Game Progress</h3>
        <div className="h-10 bg-game-medium/30 rounded-full overflow-hidden">
          <div className="h-full bg-game-accent" style={{ width: '0%' }}></div>
        </div>
        <div className="mt-2 text-sm text-gray-400">
          Game has not started yet
        </div>
      </div>
    </div>
  );
};

export default HouseTab;
