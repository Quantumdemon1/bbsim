
import { FinaleManagerProps } from './types';
import { PlayerData } from '@/components/PlayerProfileTypes';

export function useFinaleManager({
  players,
  setFinalists,
  setJurors,
  toast
}: FinaleManagerProps) {
  const setupFinale = () => {
    const activePlayers = players.filter(p => p.status !== 'evicted');
    const finalist1 = activePlayers[0]?.id;
    const finalist2 = activePlayers[1]?.id;
    
    if (finalist1 && finalist2) {
      setFinalists([finalist1, finalist2]);
      
      // In Big Brother, the jury typically consists of the last 7-9 evicted houseguests
      const evictedPlayers = players.filter(p => p.status === 'evicted');
      // Take the last 7 evicted players to form the jury
      let juryMembers = evictedPlayers.slice(-7).map(p => p.id);
      
      // If we don't have enough jury members, add some of the remaining active players
      if (juryMembers.length < 7) {
        const remainingPlayers = activePlayers.slice(2).map(p => p.id);
        juryMembers = [...juryMembers, ...remainingPlayers.slice(0, 7 - juryMembers.length)];
      }
      
      // Update player statuses to show they're jurors
      const updatedPlayers = players.map(player => ({
        ...player,
        status: juryMembers.includes(player.id) ? 'juror' : 
                finalists.includes(player.id) ? player.status : player.status
      }));
      
      setJurors(juryMembers);
    }
    
    toast({
      title: "Finale Setup",
      description: "The final 2 houseguests will now face the jury!"
    });
  };

  return {
    setupFinale
  };
}
