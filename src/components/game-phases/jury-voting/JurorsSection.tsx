
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerData } from '@/components/PlayerProfileTypes';
import JurorGrid from './JurorGrid';

interface JurorsSectionProps {
  jurors: PlayerData[];
  selectedJuror: string | null;
  votes: Record<string, string>;
  onJurorSelect: (jurorId: string) => void;
  selectedJurorName: string | undefined;
}

const JurorsSection: React.FC<JurorsSectionProps> = ({
  jurors,
  selectedJuror,
  votes,
  onJurorSelect,
  selectedJurorName
}) => {
  return (
    <Card className="bg-game-medium border-game-light/30">
      <CardHeader>
        <CardTitle className="text-center">Jury Members</CardTitle>
      </CardHeader>
      <CardContent>
        <JurorGrid 
          jurors={jurors}
          votes={votes}
          selectedJuror={selectedJuror}
          onJurorSelect={onJurorSelect}
        />
        
        <div className="text-center mt-4 text-sm text-gray-400">
          {selectedJuror ? 
            `Select a finalist for ${selectedJurorName} to vote for` : 
            "Select a jury member to cast their vote"}
        </div>
      </CardContent>
    </Card>
  );
};

export default JurorsSection;
