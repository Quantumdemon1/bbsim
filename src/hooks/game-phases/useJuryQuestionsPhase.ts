
import { toast } from "@/components/ui/use-toast";
import { PlayerData } from "@/components/PlayerProfile";

interface JuryQuestionsProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  finalists: string[];
  setFinalists: (finalists: string[]) => void;
  jurors: string[];
  setJurors: (jurors: string[]) => void;
  setStatusMessage: (message: string) => void;
  setPhase: (phase: string) => void;
  setSelectedPlayers: (players: string[]) => void;
}

export function useJuryQuestionsPhase({
  players,
  setPlayers,
  finalists,
  jurors,
  setStatusMessage,
  setPhase,
  setSelectedPlayers
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
