
import React from 'react';
import { Button } from "@/components/ui/button";

interface ResultsButtonProps {
  allVotesCast: boolean;
  onShowResults: () => void;
}

const ResultsButton: React.FC<ResultsButtonProps> = ({
  allVotesCast,
  onShowResults
}) => {
  if (!allVotesCast) return null;
  
  return (
    <div className="flex justify-center mt-8">
      <Button 
        className="bg-game-accent hover:bg-game-highlight text-black px-8 py-6 text-lg rounded-md button-glow"
        onClick={onShowResults}
      >
        Show the Results
      </Button>
    </div>
  );
};

export default ResultsButton;
