
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart } from 'lucide-react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useRelationshipManager } from '@/hooks/useRelationshipManager';
import PlayerSelectionGrid from './relationships/PlayerSelectionGrid';
import PlayerRelationships from './relationships/PlayerRelationships';
import RelationshipControls from './relationships/RelationshipControls';
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

interface RelationshipsDialogProps {
  players: PlayerData[];
  onClose?: () => void;
}

const RelationshipsDialog: React.FC<RelationshipsDialogProps> = ({ players, onClose }) => {
  const [open, setOpen] = useState<boolean>(onClose ? true : false);
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState<boolean>(false);
  
  const {
    selectedPlayer,
    setSelectedPlayer,
    extraOptions,
    handleRandomizeAll,
    handleResetPlayer,
    handleResetAll,
    handleMakeAllPermanent,
    handleMakeNonePermanent,
    handleUpdateRelationship,
    getRelationshipValue
  } = useRelationshipManager({ players });
  
  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && onClose) {
      onClose();
    }
  };
  
  const handleSubmit = () => {
    setSubmitConfirmOpen(false);
    setOpen(false);
    if (onClose) {
      onClose();
    }
    toast({
      title: "Relationships Saved",
      description: "Your relationship changes have been applied.",
    });
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
          <Button 
            className="w-full bg-game-accent hover:bg-game-highlight text-black"
            onClick={() => setSubmitConfirmOpen(true)}
          >
            Submit
          </Button>
        </div>
        
        <AlertDialog open={submitConfirmOpen} onOpenChange={setSubmitConfirmOpen}>
          <AlertDialogContent className="bg-game-dark border-game-accent text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Relationship Changes</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                Are you sure you want to apply all relationship changes? This will affect how players interact in the game.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-none">Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-game-accent hover:bg-game-highlight text-black" onClick={handleSubmit}>
                Confirm Changes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
};

export default RelationshipsDialog;
