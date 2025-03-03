
import { PlayerData } from '@/components/PlayerProfile';
import { Toast } from '@/components/ui/use-toast';

interface VetoPhaseProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  nominees: string[];
  setNominees: (nominees: string[]) => void;
  veto: string | null;
  hoh: string | null;
  setStatusMessage: (message: string) => void;
  setPhase: (phase: string) => void;
  setSelectedPlayers: (players: string[]) => void;
  usePowerup: (playerId: string) => void;
  toast: Toast;
}

export function useVetoPhase({
  players,
  setPlayers,
  nominees,
  setNominees,
  veto,
  hoh,
  setStatusMessage,
  setPhase,
  setSelectedPlayers,
  usePowerup,
  toast
}: VetoPhaseProps) {
  
  const handleVetoAction = (action: string) => {
    // Check if any player has a veto nullifier
    const nullifier = players.find(p => p.powerup === 'nullify');
    
    if (nullifier && action === 'use') {
      // Use the nullifier
      usePowerup(nullifier.id);
      
      setStatusMessage(`${nullifier.name} used the Veto Nullifier! The Power of Veto has been nullified this week.`);
      
      toast({
        title: "Veto Nullified",
        description: setStatusMessage,
      });
      
      setTimeout(() => {
        setPhase('Eviction Voting');
        setSelectedPlayers([]);
      }, 1500);
      
      return;
    }
    
    if (action === 'use') {
      // If using veto, go to replacement nominee selection
      // For simplicity, we'll just randomly select a replacement
      const availablePlayers = players.filter(p => 
        !nominees.includes(p.id) && 
        p.id !== hoh && 
        p.id !== veto &&
        p.status !== 'evicted'
      );
      
      if (availablePlayers.length > 0) {
        // Randomly select which nominee to save
        const savedNomineeIndex = Math.floor(Math.random() * nominees.length);
        const savedNomineeId = nominees[savedNomineeIndex];
        const remainingNomineeId = nominees.find(id => id !== savedNomineeId)!;
        
        // Randomly select a replacement nominee
        const replacementIndex = Math.floor(Math.random() * availablePlayers.length);
        const replacementId = availablePlayers[replacementIndex].id;
        
        const newNominees = [remainingNomineeId, replacementId];
        setNominees(newNominees);
        
        // Update player status
        setPlayers(players.map(player => ({
          ...player,
          status: newNominees.includes(player.id) 
            ? 'nominated' 
            : (player.id === savedNomineeId 
                ? undefined 
                : player.status)
        })));
        
        const savedName = players.find(p => p.id === savedNomineeId)?.name;
        const replacementName = players.find(p => p.id === replacementId)?.name;
        
        setStatusMessage(`${players.find(p => p.id === veto)?.name} used the Power of Veto on ${savedName}! ${replacementName} has been named as the replacement nominee.`);
      } else {
        setStatusMessage(`${players.find(p => p.id === veto)?.name} decided not to use the Power of Veto.`);
      }
    } else {
      // Not using veto
      setStatusMessage(`${players.find(p => p.id === veto)?.name} decided not to use the Power of Veto.`);
    }
    
    toast({
      title: "Veto Ceremony",
      description: setStatusMessage,
    });
    
    setTimeout(() => {
      setPhase('Eviction Voting');
      setSelectedPlayers([]);
    }, 1500);
  };

  return {
    handleVetoAction
  };
}
