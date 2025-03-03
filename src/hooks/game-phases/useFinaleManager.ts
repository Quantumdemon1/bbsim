
import { PlayerData } from '@/components/PlayerProfile';

interface FinaleManagerProps {
  players: PlayerData[];
  setFinalists: (finalists: string[]) => void;
  setJurors: (jurors: string[]) => void;
  toast: (props: { title: string; description: string; variant?: "default" | "destructive" }) => void;
}

export function useFinaleManager({
  players,
  setFinalists,
  setJurors,
  toast
}: FinaleManagerProps) {
  // Set up finalists and jury for finale
  const setupFinale = () => {
    // For demo purposes, let's just select the first 2 players as finalists and the next 7 as jury
    const activePlayers = players.filter(p => p.status !== 'evicted');
    const finalist1 = activePlayers[0]?.id;
    const finalist2 = activePlayers[1]?.id;
    
    if (finalist1 && finalist2) {
      setFinalists([finalist1, finalist2]);
      
      // Set jury members as evicted players, or random active players if not enough evicted
      const evictedPlayers = players.filter(p => p.status === 'evicted');
      let juryMembers = evictedPlayers.slice(0, 7).map(p => p.id);
      
      // If we don't have enough evicted players, add some active players
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
