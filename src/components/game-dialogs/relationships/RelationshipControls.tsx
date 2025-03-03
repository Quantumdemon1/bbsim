
import React from 'react';
import { Button } from "@/components/ui/button";

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
  return (
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
  );
};

export default RelationshipControls;
