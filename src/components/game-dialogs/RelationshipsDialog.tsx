import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart } from 'lucide-react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useGameContext } from '@/hooks/useGameContext';
import { relationshipTypes } from '@/hooks/game-phases/types';
import PlayerSelectionGrid from './relationships/PlayerSelectionGrid';
import PlayerRelationships from './relationships/PlayerRelationships';
import RelationshipControls from './relationships/RelationshipControls';

interface RelationshipsDialogProps {
  players: PlayerData[];
  onClose?: () => void;
}

const RelationshipsDialog: React.FC<RelationshipsDialogProps> = ({ players, onClose }) => {
  const { updatePlayerRelationships } = useGameContext();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(onClose ? true : false);
  
  const extraOptions = Array.from({ length: 21 }, (_, i) => i - 10); // -10 to +10

  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && onClose) {
      onClose();
    }
  };

  const handleRandomizeAll = () => {
    // For each player, generate random relationships with all other players
    players.forEach(player => {
      const relationships = players
        .filter(p => p.id !== player.id && p.status !== 'evicted')
        .map(target => {
          const relationshipTypeIndex = Math.floor(Math.random() * relationshipTypes.length);
          return {
            playerId: player.id,
            targetId: target.id,
            type: relationshipTypes[relationshipTypeIndex] as any,
            extraPoints: Math.floor(Math.random() * 21) - 10, // -10 to +10
            isMutual: Math.random() > 0.7, // 30% chance of being mutual
            isPermanent: Math.random() > 0.85 // 15% chance of being permanent
          };
        });
      
      updatePlayerRelationships(player.id, relationships);
    });
  };
  
  const handleResetPlayer = () => {
    if (!selectedPlayer) return;
    
    const defaultRelationships = players
      .filter(p => p.id !== selectedPlayer && p.status !== 'evicted')
      .map(target => ({
        playerId: selectedPlayer,
        targetId: target.id,
        type: 'Neutral' as const,
        extraPoints: 0,
        isMutual: false,
        isPermanent: false
      }));
    
    updatePlayerRelationships(selectedPlayer, defaultRelationships);
  };
  
  const handleResetAll = () => {
    players.forEach(player => {
      const defaultRelationships = players
        .filter(p => p.id !== player.id && p.status !== 'evicted')
        .map(target => ({
          playerId: player.id,
          targetId: target.id,
          type: 'Neutral' as const,
          extraPoints: 0,
          isMutual: false,
          isPermanent: false
        }));
      
      updatePlayerRelationships(player.id, defaultRelationships);
    });
  };
  
  const handleMakeAllPermanent = () => {
    players.forEach(player => {
      if (!player.relationships) return;
      
      const updatedRelationships = player.relationships.map(rel => ({
        ...rel,
        isPermanent: true
      }));
      
      updatePlayerRelationships(player.id, updatedRelationships);
    });
  };
  
  const handleMakeNonePermanent = () => {
    players.forEach(player => {
      if (!player.relationships) return;
      
      const updatedRelationships = player.relationships.map(rel => ({
        ...rel,
        isPermanent: false
      }));
      
      updatePlayerRelationships(player.id, updatedRelationships);
    });
  };
  
  const handleUpdateRelationship = (targetId: string, field: string, value: any) => {
    if (!selectedPlayer) return;
    
    const player = players.find(p => p.id === selectedPlayer);
    if (!player || !player.relationships) return;
    
    const updatedRelationships = [...player.relationships];
    const relationshipIndex = updatedRelationships.findIndex(r => r.targetId === targetId);
    
    if (relationshipIndex === -1) {
      // Create new relationship
      const newRelationship = {
        playerId: selectedPlayer,
        targetId,
        type: field === 'type' ? value : 'Neutral',
        extraPoints: field === 'extraPoints' ? value : 0,
        isMutual: field === 'isMutual' ? value : false,
        isPermanent: field === 'isPermanent' ? value : false
      };
      updatedRelationships.push(newRelationship);
    } else {
      // Update existing relationship
      updatedRelationships[relationshipIndex] = {
        ...updatedRelationships[relationshipIndex],
        [field]: value
      };
    }
    
    updatePlayerRelationships(selectedPlayer, updatedRelationships);
  };
  
  const getRelationshipValue = (targetId: string, field: string) => {
    if (!selectedPlayer) return null;
    
    const player = players.find(p => p.id === selectedPlayer);
    if (!player || !player.relationships) return null;
    
    const relationship = player.relationships.find(r => r.targetId === targetId);
    if (!relationship) return null;
    
    return relationship[field as keyof typeof relationship];
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      {!onClose && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="bg-game-dark/80 border-game-accent text-game-accent">
            <Heart className="mr-1" size={16} />
            Relationships
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="bg-game-dark text-white border-game-accent max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Relationships</DialogTitle>
          <DialogDescription className="text-gray-300">
            Set relationships between houseguests
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PlayerSelectionGrid 
            players={players} 
            selectedPlayer={selectedPlayer} 
            setSelectedPlayer={setSelectedPlayer} 
          />
          
          <div className="bg-game-medium p-4 rounded-lg">
            <PlayerRelationships
              selectedPlayer={selectedPlayer}
              players={players}
              extraOptions={extraOptions}
              handleUpdateRelationship={handleUpdateRelationship}
              getRelationshipValue={getRelationshipValue}
              handleResetPlayer={handleResetPlayer}
            />
          </div>
        </div>
        
        <RelationshipControls
          handleRandomizeAll={handleRandomizeAll}
          handleResetAll={handleResetAll}
          handleMakeAllPermanent={handleMakeAllPermanent}
          handleMakeNonePermanent={handleMakeNonePermanent}
        />
        
        <div className="mt-4">
          <Button className="w-full bg-game-accent hover:bg-game-highlight text-black">
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RelationshipsDialog;
