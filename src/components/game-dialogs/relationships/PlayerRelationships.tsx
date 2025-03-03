
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlayerData } from '@/components/PlayerProfileTypes';
import { RelationshipType } from '@/hooks/game-phases/types';
import RelationshipRow from './RelationshipRow';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

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
  const [resetConfirmOpen, setResetConfirmOpen] = useState<boolean>(false);
  
  const selectedPlayerData = players.find(p => p.id === selectedPlayer);
  const otherPlayers = players.filter(p => p.id !== selectedPlayer && p.status !== 'evicted');
  
  const handleConfirmedReset = () => {
    handleResetPlayer();
    setResetConfirmOpen(false);
    toast({
      title: "Player Relationships Reset",
      description: `${selectedPlayerData?.name}'s relationships have been reset to neutral.`,
    });
  };

  if (!selectedPlayer) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a player to see their relationships
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">
          {selectedPlayerData?.name}'s Relationships
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-game-dark/50 hover:bg-game-dark"
          onClick={() => setResetConfirmOpen(true)}
        >
          Reset
        </Button>
        
        <AlertDialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
          <AlertDialogContent className="bg-game-dark border-game-accent text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Player Relationships?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                This will reset all of {selectedPlayerData?.name}'s relationships to Neutral. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-none">Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-game-accent hover:bg-game-highlight text-black" onClick={handleConfirmedReset}>
                Reset Relationships
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {otherPlayers.map(player => (
          <RelationshipRow
            key={`relationship-${selectedPlayer}-${player.id}`}
            targetId={player.id}
            targetName={player.name}
            targetImage={player.image}
            relationshipType={getRelationshipValue(player.id, 'type') as RelationshipType}
            extraPoints={getRelationshipValue(player.id, 'extraPoints') as number}
            isMutual={getRelationshipValue(player.id, 'isMutual') as boolean}
            isPermanent={getRelationshipValue(player.id, 'isPermanent') as boolean}
            extraOptions={extraOptions}
            onUpdateRelationship={handleUpdateRelationship}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerRelationships;
