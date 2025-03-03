
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Users } from 'lucide-react';
import { PlayerData } from '@/components/PlayerProfile';
import { useGameContext } from '@/contexts/GameContext';
import { relationshipTypes } from '@/hooks/game-phases/types';

interface RelationshipsDialogProps {
  players: PlayerData[];
}

const RelationshipsDialog: React.FC<RelationshipsDialogProps> = ({ players }) => {
  const { updatePlayerRelationships } = useGameContext();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  
  const extraOptions = Array.from({ length: 21 }, (_, i) => i - 10); // -10 to +10

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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-game-dark/80 border-game-accent text-game-accent">
          <Heart className="mr-1" size={16} />
          Relationships
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-game-dark text-white border-game-accent max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Relationships</DialogTitle>
          <DialogDescription className="text-gray-300">
            Set relationships between houseguests
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-4">
            {players.filter(p => p.status !== 'evicted').map(player => (
              <div 
                key={player.id} 
                className={`bg-game-medium p-4 rounded-lg cursor-pointer transition-all ${
                  selectedPlayer === player.id ? 'ring-2 ring-game-accent' : 'hover:bg-game-light/20'
                }`}
                onClick={() => setSelectedPlayer(player.id)}
              >
                <div className="flex flex-col items-center text-center">
                  <img 
                    src={player.image} 
                    alt={player.name} 
                    className="w-20 h-20 object-cover rounded-md mb-2" 
                  />
                  <h3 className="font-medium">{player.name}</h3>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-game-medium p-4 rounded-lg">
            {selectedPlayer ? (
              <>
                <h3 className="font-medium text-lg mb-4 border-b border-gray-700 pb-2">
                  {players.find(p => p.id === selectedPlayer)?.name}'s Relationships
                </h3>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {players
                    .filter(p => p.id !== selectedPlayer && p.status !== 'evicted')
                    .map(target => (
                      <div key={target.id} className="bg-game-dark p-3 rounded">
                        <div className="flex items-center mb-2">
                          <img 
                            src={target.image} 
                            alt={target.name} 
                            className="w-10 h-10 object-cover rounded-full mr-2" 
                          />
                          <span className="font-medium">{target.name}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">Relationship</label>
                            <select 
                              className="w-full bg-game-light/20 border border-gray-700 rounded p-1 text-sm"
                              value={getRelationshipValue(target.id, 'type') as string || 'Neutral'}
                              onChange={(e) => handleUpdateRelationship(target.id, 'type', e.target.value)}
                            >
                              {relationshipTypes.map(type => (
                                <option key={`type-${target.id}-${type}`} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">Extra Points</label>
                            <select 
                              className="w-full bg-game-light/20 border border-gray-700 rounded p-1 text-sm"
                              value={getRelationshipValue(target.id, 'extraPoints') as number || 0}
                              onChange={(e) => handleUpdateRelationship(target.id, 'extraPoints', parseInt(e.target.value))}
                            >
                              {extraOptions.map(value => (
                                <option key={`extra-${target.id}-${value}`} value={value}>
                                  {value > 0 ? `+${value}` : value}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <Checkbox 
                              id={`mutual-${target.id}`}
                              checked={getRelationshipValue(target.id, 'isMutual') as boolean || false}
                              onCheckedChange={(checked) => 
                                handleUpdateRelationship(target.id, 'isMutual', checked)
                              }
                              className="border-gray-500"
                            />
                            <label htmlFor={`mutual-${target.id}`} className="ml-2 text-sm">
                              Mutual?
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <Checkbox 
                              id={`permanent-${target.id}`}
                              checked={getRelationshipValue(target.id, 'isPermanent') as boolean || false}
                              onCheckedChange={(checked) => 
                                handleUpdateRelationship(target.id, 'isPermanent', checked)
                              }
                              className="border-gray-500"
                            />
                            <label htmlFor={`permanent-${target.id}`} className="ml-2 text-sm">
                              Permanent?
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">Set Relationships For: {players.find(p => p.id === selectedPlayer)?.name}</p>
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
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>Select a player to manage their relationships</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Button 
            variant="outline" 
            className="bg-game-medium hover:bg-game-light/30"
            onClick={handleRandomizeAll}
          >
            Randomize All
          </Button>
          <Button 
            variant="outline" 
            className="bg-game-medium hover:bg-game-light/30"
            onClick={handleResetAll}
          >
            Reset All
          </Button>
          <Button 
            variant="outline" 
            className="bg-game-medium hover:bg-game-light/30"
            onClick={handleMakeAllPermanent}
          >
            Make All Permanent
          </Button>
          <Button 
            variant="outline" 
            className="bg-game-medium hover:bg-game-light/30"
            onClick={handleMakeNonePermanent}
          >
            Make None Permanent
          </Button>
        </div>
        
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
