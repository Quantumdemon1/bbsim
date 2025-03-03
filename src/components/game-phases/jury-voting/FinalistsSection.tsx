
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerData } from '@/components/PlayerProfileTypes';
import FinalistCard from './FinalistCard';

interface FinalistsSectionProps {
  finalists: PlayerData[];
  selectedJuror: string | null;
  onVote: (finalistId: string) => void;
}

const FinalistsSection: React.FC<FinalistsSectionProps> = ({
  finalists,
  selectedJuror,
  onVote
}) => {
  return (
    <Card className="bg-game-medium border-game-light/30">
      <CardHeader>
        <CardTitle className="text-center">Finalists</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {finalists.map(finalist => (
          <FinalistCard 
            key={finalist.id} 
            finalist={finalist}
            selectedJuror={selectedJuror}
            onVote={onVote}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default FinalistsSection;
