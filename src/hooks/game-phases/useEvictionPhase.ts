
import { PlayerData } from '@/components/PlayerProfile';
import { Toast } from '@/components/ui/use-toast';

interface EvictionPhaseProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  nominees: string[];
  setSelectedPlayers: (players: string[]) => void;
  setStatusMessage: (message: string) => void;
  setPhase: (phase: string) => void;
  usePowerup: (playerId: string) => void;
  toast: Toast;
}

export function useEvictionPhase({
  players,
  setPlayers,
  nominees,
  setSelectedPlayers,
  setStatusMessage,
  setPhase,
  usePowerup,
  toast
}: EvictionPhaseProps) {
  
  const handleEvict = (evictedId: string) => {
    if (evictedId) {
      // Check for coup d'état
      const coupPlayer = players.find(p => p.powerup === 'coup');
      if (coupPlayer) {
        usePowerup(coupPlayer.id);
        
        // Prevent eviction and force a new HoH competition
        setStatusMessage(`${coupPlayer.name} used the Coup d'État power! The eviction has been canceled and a new HoH will be selected!`);
        
        toast({
          title: "Coup d'État",
          description: setStatusMessage,
          variant: "destructive"
        });
        
        setTimeout(() => {
          setPhase('HoH Competition');
          setSelectedPlayers([]);
          setStatusMessage('');
        }, 1500);
        
        return;
      }
      
      // Update player status
      setPlayers(players.map(player => ({
        ...player,
        status: player.id === evictedId ? 'evicted' : player.status
      })));
      
      setSelectedPlayers([evictedId]);
      
      const evictedName = players.find(p => p.id === evictedId)?.name;
      const voteCount = Math.floor(Math.random() * 5) + 3; // Random vote count between 3-7
      
      setStatusMessage(`${evictedName} has been evicted by a vote of ${voteCount}-${Math.floor(Math.random() * 3)}.`);
      
      toast({
        title: "Eviction",
        description: `${evictedName} has been evicted from the Big Brother house`,
        variant: "destructive"
      });
      
      setTimeout(() => {
        setPhase('Eviction');
      }, 1500);
    }
  };

  return {
    handleEvict
  };
}
