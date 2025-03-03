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
      
      const evictedPlayers = players.filter(p => p.status === 'evicted');
      let juryMembers = evictedPlayers.slice(0, 7).map(p => p.id);
      
      if (juryMembers.length < 3) {
        const remainingPlayers = activePlayers.slice(2).map(p => p.id);
        juryMembers = [...juryMembers, ...remainingPlayers.slice(0, 7 - juryMembers.length)];
      }
      
      setJurors(juryMembers);
    }
    
    toast({
      title: "Finale Setup",
      description: "Finalists and jury members have been selected"
    });
  };

  return {
    setupFinale
  };
}
