import React from 'react';
import { Button } from "@/components/ui/button";
import PlayerProfile from '@/components/PlayerProfile';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface JuryQuestionsProps {
  players: PlayerData[];
  finalists: string[];
  jurors: string[];
  statusMessage: string;
  onAction: (action: string) => void;
}

const JuryQuestions: React.FC<JuryQuestionsProps> = ({
  players,
  finalists,
  jurors,
  statusMessage,
  onAction
}) => {
  const finalistProfiles = players.filter(p => finalists.includes(p.id));
  const jurorProfiles = players.filter(p => jurors.includes(p.id));
  
  return (
    <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-6">Jury Questions</h2>
      
      <p className="text-center mb-8 text-xl">
        {statusMessage || "The jury questions the finalists"}
      </p>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-center mb-4">Finalists</h3>
        <div className="flex justify-center gap-8">
          {finalistProfiles.map(player => (
            <PlayerProfile key={player.id} player={player} size="lg" showDetails={true} />
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-center mb-4">Jury Members</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {jurorProfiles.map(player => (
            <PlayerProfile key={player.id} player={player} size="md" showDetails={false} />
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button 
          className="bg-game-accent hover:bg-game-highlight text-black px-8 py-6 text-lg rounded-md button-glow"
          onClick={() => onAction('proceedToVoting')}
        >
          Proceed to Jury Voting
        </Button>
      </div>
    </div>
  );
};

export default JuryQuestions;
