
import React, { useState } from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import FinalistsSection from './jury-voting/FinalistsSection';
import JurorsSection from './jury-voting/JurorsSection';
import ResultsButton from './jury-voting/ResultsButton';

interface JuryVotingProps {
  players: PlayerData[];
  finalists: string[];
  jurors: string[];
  votes: Record<string, string>;
  statusMessage: string;
  onAction: (action: string, data?: any) => void;
}

const JuryVoting: React.FC<JuryVotingProps> = ({
  players,
  finalists,
  jurors,
  votes,
  statusMessage,
  onAction
}) => {
  const [selectedJuror, setSelectedJuror] = useState<string | null>(null);
  const finalistProfiles = players.filter(p => finalists.includes(p.id));
  const jurorProfiles = players.filter(p => jurors.includes(p.id));
  
  const handleVote = (finalistId: string) => {
    if (selectedJuror) {
      onAction('juryVote', { jurorId: selectedJuror, finalistId });
      setSelectedJuror(null);
    }
  };
  
  const allVotesCast = jurors.every(jurorId => 
    votes && votes[jurorId] !== undefined
  );
  
  const selectedJurorName = players.find(p => p.id === selectedJuror)?.name;
  
  return (
    <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-6">Jury Voting</h2>
      
      <p className="text-center mb-8 text-xl">
        {statusMessage || "The jury votes for the winner"}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <FinalistsSection 
          finalists={finalistProfiles}
          selectedJuror={selectedJuror}
          onVote={handleVote}
        />
        
        <JurorsSection 
          jurors={jurorProfiles}
          selectedJuror={selectedJuror}
          votes={votes}
          onJurorSelect={setSelectedJuror}
          selectedJurorName={selectedJurorName}
        />
      </div>
      
      <ResultsButton 
        allVotesCast={allVotesCast}
        onShowResults={() => onAction('showResults')}
      />
    </div>
  );
};

export default JuryVoting;
