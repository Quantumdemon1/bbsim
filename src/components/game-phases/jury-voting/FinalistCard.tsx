
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PlayerProfile from '@/components/PlayerProfile';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface FinalistCardProps {
  finalist: PlayerData;
  selectedJuror: string | null;
  onVote: (finalistId: string) => void;
}

const FinalistCard: React.FC<FinalistCardProps> = ({
  finalist,
  selectedJuror,
  onVote
}) => {
  return (
    <div className="flex flex-col items-center w-full">
      <PlayerProfile player={finalist} size="lg" showDetails={true} />
      {selectedJuror && (
        <Button 
          className="mt-4 bg-game-accent hover:bg-game-highlight text-black px-6 py-2"
          onClick={() => onVote(finalist.id)}
        >
          Vote for {finalist.name}
        </Button>
      )}
    </div>
  );
};

export default FinalistCard;
