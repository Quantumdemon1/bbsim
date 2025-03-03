
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wand2, RotateCcw, Lock, Unlock } from 'lucide-react';
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

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
  const [randomizeConfirmOpen, setRandomizeConfirmOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [permanentConfirmOpen, setPermanentConfirmOpen] = useState(false);
  const [nonePermanentConfirmOpen, setNonePermanentConfirmOpen] = useState(false);
  
  return (
    <div className="mt-4 space-x-2 flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        onClick={() => setRandomizeConfirmOpen(true)}
        className="flex-1 bg-game-dark/80 text-game-accent border-game-accent hover:bg-game-dark"
      >
        <Wand2 className="mr-2 h-4 w-4" />
        Randomize All
      </Button>
      
      <Button 
        variant="outline" 
        onClick={() => setResetConfirmOpen(true)}
        className="flex-1 bg-game-dark/80 text-game-accent border-game-accent hover:bg-game-dark"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset All
      </Button>
      
      <Button 
        variant="outline" 
        onClick={() => setPermanentConfirmOpen(true)}
        className="flex-1 bg-game-dark/80 text-game-accent border-game-accent hover:bg-game-dark"
      >
        <Lock className="mr-2 h-4 w-4" />
        Make All Permanent
      </Button>
      
      <Button 
        variant="outline" 
        onClick={() => setNonePermanentConfirmOpen(true)}
        className="flex-1 bg-game-dark/80 text-game-accent border-game-accent hover:bg-game-dark"
      >
        <Unlock className="mr-2 h-4 w-4" />
        Make None Permanent
      </Button>
      
      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        open={randomizeConfirmOpen}
        onOpenChange={setRandomizeConfirmOpen}
        title="Randomize All Relationships"
        description="This will randomize all relationships between players. This action cannot be undone. Are you sure you want to continue?"
        confirmLabel="Randomize All"
        onConfirm={handleRandomizeAll}
      />
      
      <ConfirmationDialog
        open={resetConfirmOpen}
        onOpenChange={setResetConfirmOpen}
        title="Reset All Relationships"
        description="This will reset all relationships to Neutral. This action cannot be undone. Are you sure you want to continue?"
        confirmLabel="Reset All"
        onConfirm={handleResetAll}
      />
      
      <ConfirmationDialog
        open={permanentConfirmOpen}
        onOpenChange={setPermanentConfirmOpen}
        title="Make All Relationships Permanent"
        description="This will make all relationships permanent, which means they won't change during gameplay events. Are you sure?"
        confirmLabel="Make All Permanent"
        onConfirm={handleMakeAllPermanent}
      />
      
      <ConfirmationDialog
        open={nonePermanentConfirmOpen}
        onOpenChange={setNonePermanentConfirmOpen}
        title="Make No Relationships Permanent"
        description="This will make all relationships non-permanent, allowing them to change during gameplay events. Are you sure?"
        confirmLabel="Make None Permanent"
        onConfirm={handleMakeNonePermanent}
      />
    </div>
  );
};

export default RelationshipControls;
