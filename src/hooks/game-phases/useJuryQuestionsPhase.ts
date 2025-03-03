import { JuryQuestionsProps } from './types';
import { PlayerData } from '@/components/PlayerProfileTypes';

export function useJuryQuestionsPhase({
  players,
  setPlayers,
  finalists,
  jurors,
  setStatusMessage,
  setPhase,
  setSelectedPlayers,
  toast
}: JuryQuestionsProps) {
  
  const handleJuryQuestions = () => {
    // Validate that we have finalists
    if (!finalists || finalists.length < 2) {
      toast({
        title: "Error",
        description: "Need at least two finalists for jury questions",
        variant: "destructive"
      });
      return;
    }

    // Validate that we have jurors
    if (!jurors || jurors.length < 3) {
      toast({
        title: "Error",
        description: "Need at least three jury members to ask questions",
        variant: "destructive"
      });
      return;
    }

    setStatusMessage("The jury questions the two finalists.");
    setSelectedPlayers([]);
    
    toast({
      title: "Jury Questions",
      description: "The jury is now asking questions to the finalists"
    });
  };

  const handleProceedToVoting = () => {
    setPhase('Jury Voting');
    setStatusMessage("The jurors vote for a winner.");
    
    toast({
      title: "Jury Voting",
      description: "The jury will now vote for the winner"
    });
  };

  return {
    handleJuryQuestions,
    handleProceedToVoting
  };
}
