
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
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

interface RelationshipControlsProps {
  handleRandomizeAll: () => void;
  handleResetAll: () => void;
  handleMakeAllPermanent: () => void;
  handleMakeNonePermanent: () => void;
}

const RelationshipControls: React.FC<RelationshipControlsProps> = ({
  handleRandomizeAll,
  handleResetAll,
  handleMakeAllPermanent,
  handleMakeNonePermanent
}) => {
  const [dialogOpen, setDialogOpen] = useState<{
    randomize: boolean;
    reset: boolean;
    makeAllPermanent: boolean;
    makeNonePermanent: boolean;
  }>({
    randomize: false,
    reset: false,
    makeAllPermanent: false,
    makeNonePermanent: false,
  });

  const closeAllDialogs = () => {
    setDialogOpen({
      randomize: false,
      reset: false,
      makeAllPermanent: false,
      makeNonePermanent: false,
    });
  };

  const handleConfirmedRandomizeAll = () => {
    handleRandomizeAll();
    closeAllDialogs();
    toast({
      title: "Relationships Randomized",
      description: "All player relationships have been randomized.",
    });
  };

  const handleConfirmedResetAll = () => {
    handleResetAll();
    closeAllDialogs();
    toast({
      title: "Relationships Reset",
      description: "All player relationships have been reset to neutral.",
    });
  };

  const handleConfirmedMakeAllPermanent = () => {
    handleMakeAllPermanent();
    closeAllDialogs();
    toast({
      title: "All Relationships Made Permanent",
      description: "All relationships have been set to permanent.",
    });
  };

  const handleConfirmedMakeNonePermanent = () => {
    handleMakeNonePermanent();
    closeAllDialogs();
    toast({
      title: "All Relationships Made Non-Permanent",
      description: "All relationships have been set to non-permanent.",
    });
  };

  return (
    <div className="mt-6 flex flex-wrap gap-3 justify-center">
      <Button 
        variant="outline" 
        className="bg-game-medium hover:bg-game-light/30"
        onClick={() => setDialogOpen({ ...dialogOpen, randomize: true })}
      >
        Randomize All
      </Button>
      <Button 
        variant="outline" 
        className="bg-game-medium hover:bg-game-light/30"
        onClick={() => setDialogOpen({ ...dialogOpen, reset: true })}
      >
        Reset All
      </Button>
      <Button 
        variant="outline" 
        className="bg-game-medium hover:bg-game-light/30"
        onClick={() => setDialogOpen({ ...dialogOpen, makeAllPermanent: true })}
      >
        Make All Permanent
      </Button>
      <Button 
        variant="outline" 
        className="bg-game-medium hover:bg-game-light/30"
        onClick={() => setDialogOpen({ ...dialogOpen, makeNonePermanent: true })}
      >
        Make None Permanent
      </Button>

      {/* Randomize All Confirmation Dialog */}
      <AlertDialog open={dialogOpen.randomize} onOpenChange={(open) => setDialogOpen({ ...dialogOpen, randomize: open })}>
        <AlertDialogContent className="bg-game-dark border-game-accent text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Randomize All Relationships?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This will randomize all relationships between players. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-none">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-game-accent hover:bg-game-highlight text-black" onClick={handleConfirmedRandomizeAll}>
              Randomize All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset All Confirmation Dialog */}
      <AlertDialog open={dialogOpen.reset} onOpenChange={(open) => setDialogOpen({ ...dialogOpen, reset: open })}>
        <AlertDialogContent className="bg-game-dark border-game-accent text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset All Relationships?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This will reset all relationships to Neutral. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-none">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-game-accent hover:bg-game-highlight text-black" onClick={handleConfirmedResetAll}>
              Reset All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Make All Permanent Confirmation Dialog */}
      <AlertDialog open={dialogOpen.makeAllPermanent} onOpenChange={(open) => setDialogOpen({ ...dialogOpen, makeAllPermanent: open })}>
        <AlertDialogContent className="bg-game-dark border-game-accent text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Make All Relationships Permanent?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This will make all relationships permanent, preventing them from changing naturally during the game.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-none">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-game-accent hover:bg-game-highlight text-black" onClick={handleConfirmedMakeAllPermanent}>
              Make All Permanent
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Make None Permanent Confirmation Dialog */}
      <AlertDialog open={dialogOpen.makeNonePermanent} onOpenChange={(open) => setDialogOpen({ ...dialogOpen, makeNonePermanent: open })}>
        <AlertDialogContent className="bg-game-dark border-game-accent text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Make All Relationships Non-Permanent?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This will make all relationships non-permanent, allowing them to change naturally during the game.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-none">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-game-accent hover:bg-game-highlight text-black" onClick={handleConfirmedMakeNonePermanent}>
              Make None Permanent
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RelationshipControls;
