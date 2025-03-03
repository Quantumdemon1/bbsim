
import { PlayerData } from '@/components/PlayerProfileTypes';
import { VetoPhaseProps } from './types';

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
  setVetoUsed,
  toast
}: VetoPhaseProps) {
  
  const handleVetoAction = (action: string) => {
    // Check if any player has a veto nullifier
    const nullifier = players.find(p => p.powerup === 'nullify');
    
    if (nullifier && action === 'use') {
      // Use the nullifier
      usePowerup(nullifier.id);
      
      const statusMsg = `${nullifier.name} used the Veto Nullifier! The Power of Veto has been nullified this week.`;
      setStatusMessage(statusMsg);
      
      toast({
        title: "Veto Nullified",
        description: statusMsg,
      });
      
      setTimeout(() => {
        setPhase('Eviction Voting');
        setSelectedPlayers([]);
      }, 1500);
      
      return;
    }
    
    let statusMsg = ''; // Create a local variable to store the status message
    
    if (action === 'use') {
      // Mark that veto was used this week
      setVetoUsed(true);
      
      // If using veto, go to replacement nominee selection
      const savedNomineeId = nominees[0]; // For simplicity, we'll save the first nominee
      const remainingNomineeId = nominees[1];
      
      // For replacement, choose eligible players (not HoH, not veto holder, not already nominated)
      const availablePlayers = players.filter(p => 
        !nominees.includes(p.id) && 
        p.id !== hoh && 
        p.id !== veto &&
        p.status !== 'evicted'
      );
      
      if (availablePlayers.length > 0) {
        // Randomly select a replacement nominee
        const replacementIndex = Math.floor(Math.random() * availablePlayers.length);
        const replacementId = availablePlayers[replacementIndex].id;
        
        // If we have a remaining nominee and a replacement, update the nominees list
        if (remainingNomineeId && replacementId) {
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
          
          statusMsg = `${players.find(p => p.id === veto)?.name} used the Power of Veto on ${savedName}! ${replacementName} has been named as the replacement nominee.`;
        } else {
          statusMsg = `${players.find(p => p.id === veto)?.name} decided not to use the Power of Veto.`;
        }
      } else {
        statusMsg = `${players.find(p => p.id === veto)?.name} decided not to use the Power of Veto.`;
      }
    } else {
      // Not using veto
      setVetoUsed(false);
      statusMsg = `${players.find(p => p.id === veto)?.name} decided not to use the Power of Veto.`;
    }
    
    // Set the status message
    setStatusMessage(statusMsg);
    
    toast({
      title: "Veto Ceremony",
      description: statusMsg,
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
