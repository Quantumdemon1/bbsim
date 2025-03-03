
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlayerData } from '@/components/PlayerProfile';
import RelationshipRow from './RelationshipRow';

interface PlayerRelationshipsProps {
  selectedPlayer: string | null;
  players: PlayerData[];
  extraOptions: number[];
  handleUpdateRelationship: (targetId: string, field: string, value: any) => void;
  getRelationshipValue: (targetId: string, field: string) => any;
  handleResetPlayer: () => void;
}

const PlayerRelationships: React.FC<PlayerRelationshipsProps> = ({
  selectedPlayer,
  players,
  extraOptions,
  handleUpdateRelationship,
  getRelationshipValue,
  handleResetPlayer
}) => {
  if (!selectedPlayer) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <p>Select a player to manage their relationships</p>
      </div>
    );
  }

  const selectedPlayerName = players.find(p => p.id === selectedPlayer)?.name;

  return (
    <>
      <h3 className="font-medium text-lg mb-4 border-b border-gray-700 pb-2">
        {selectedPlayerName}'s Relationships
      </h3>
      
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {players
          .filter(p => p.id !== selectedPlayer && p.status !== 'evicted')
          .map(target => (
            <RelationshipRow
              key={target.id}
              targetId={target.id}
              targetName={target.name}
              targetImage={target.image}
              relationshipType={getRelationshipValue(target.id, 'type')}
              extraPoints={getRelationshipValue(target.id, 'extraPoints')}
              isMutual={getRelationshipValue(target.id, 'isMutual')}
              isPermanent={getRelationshipValue(target.id, 'isPermanent')}
              extraOptions={extraOptions}
              onUpdateRelationship={handleUpdateRelationship}
            />
          ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-sm text-gray-400 mb-2">Set Relationships For: {selectedPlayerName}</p>
        <div className="flex gap-2 mb-3">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-game-light/20"
            onClick={handleResetPlayer}
          >
            Reset Player
          </Button>
        </div>
      </div>
    </>
  );
};

export default PlayerRelationships;
