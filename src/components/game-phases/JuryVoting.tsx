
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import PlayerProfile, { PlayerData } from '@/components/PlayerProfile';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  
  const hasVoted = (jurorId: string) => {
    return votes && votes[jurorId] !== undefined;
  };
  
  const allVotesCast = jurors.every(jurorId => hasVoted(jurorId));
  
  return (
    <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-6">Jury Voting</h2>
      
      <p className="text-center mb-8 text-xl">
        {statusMessage || "The jury votes for the winner"}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="bg-game-medium border-game-light/30">
          <CardHeader>
            <CardTitle className="text-center">Finalists</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {finalistProfiles.map(player => (
              <div key={player.id} className="flex flex-col items-center w-full">
                <PlayerProfile player={player} size="lg" showDetails={true} />
                {selectedJuror && (
                  <Button 
                    className="mt-4 bg-game-accent hover:bg-game-highlight text-black px-6 py-2"
                    onClick={() => handleVote(player.id)}
                  >
                    Vote for {player.name}
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="bg-game-medium border-game-light/30">
          <CardHeader>
            <CardTitle className="text-center">Jury Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {jurorProfiles.map(player => (
                <div 
                  key={player.id} 
                  className={`relative cursor-pointer ${hasVoted(player.id) ? 'opacity-50' : ''}`}
                  onClick={() => !hasVoted(player.id) ? setSelectedJuror(player.id) : null}
                >
                  <PlayerProfile 
                    player={player} 
                    size="md"
                    selected={selectedJuror === player.id}
                  />
                  {hasVoted(player.id) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md">
                      <span className="text-white font-bold">VOTED</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center mt-4 text-sm text-gray-400">
              {selectedJuror ? 
                `Select a finalist for ${players.find(p => p.id === selectedJuror)?.name} to vote for` : 
                "Select a jury member to cast their vote"}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {allVotesCast && (
        <div className="flex justify-center mt-8">
          <Button 
            className="bg-game-accent hover:bg-game-highlight text-black px-8 py-6 text-lg rounded-md button-glow"
            onClick={() => onAction('showResults')}
          >
            Show the Results
          </Button>
        </div>
      )}
    </div>
  );
};

export default JuryVoting;
