import { JuryVotingProps } from './types';
import { PlayerData } from '@/components/PlayerProfileTypes';

export function useJuryVotingPhase({
  players,
  setPlayers,
  finalists,
  votes,
  setVotes,
  setStatusMessage,
  setPhase,
  setSelectedPlayers,
  toast
}: JuryVotingProps) {
  
  const handleJuryVote = (jurorId: string, finalistId: string) => {
    setVotes({
      ...votes,
      [jurorId]: finalistId
    });
    
    toast({
      title: "Vote Cast",
      description: `${players.find(p => p.id === jurorId)?.name} has cast a vote`
    });
  };

  const handleShowResults = () => {
    // Count votes for each finalist
    const voteCounts: Record<string, number> = {};
    Object.values(votes).forEach(finalistId => {
      voteCounts[finalistId] = (voteCounts[finalistId] || 0) + 1;
    });
    
    // Determine winner (finalist with most votes)
    let winnerId = finalists[0];
    let maxVotes = 0;
    
    finalists.forEach(finalistId => {
      const finalistVotes = voteCounts[finalistId] || 0;
      if (finalistVotes > maxVotes) {
        winnerId = finalistId;
        maxVotes = finalistVotes;
      }
    });
    
    // Update player status for the winner
    setPlayers(players.map(player => ({
      ...player,
      status: player.id === winnerId ? 'winner' : player.status
    })));
    
    setPhase('The Winner');
    setStatusMessage(`${players.find(p => p.id === winnerId)?.name} is the winner of Big Brother!`);
    
    toast({
      title: "Winner Revealed",
      description: `${players.find(p => p.id === winnerId)?.name} has won Big Brother!`
    });
  };

  return {
    handleJuryVote,
    handleShowResults
  };
}
