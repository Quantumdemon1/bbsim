
import { PlayerData } from '@/components/PlayerProfile';
import { Toast } from '@/components/ui/use-toast';

interface HoHPhaseProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  setHoH: (hohId: string | null) => void;
  setStatusMessage: (message: string) => void;
  setPhase: (phase: string) => void;
  setSelectedPlayers: (players: string[]) => void;
  toast: Toast;
}

export function useHoHPhase({
  players,
  setPlayers,
  selectedPlayers,
  setHoH,
  setStatusMessage,
  setPhase,
  setSelectedPlayers,
  toast
}: HoHPhaseProps) {
  
  const handleSelectHoH = () => {
    if (selectedPlayers.length === 1) {
      const hohId = selectedPlayers[0];
      setHoH(hohId);
      
      // Update player status
      setPlayers(players.map(player => ({
        ...player,
        status: player.id === hohId ? 'hoh' : (player.status === 'hoh' ? undefined : player.status)
      })));
      
      setStatusMessage(`${players.find(p => p.id === hohId)?.name} is the new Head of Household!`);
      
      // Move to next phase
      toast({
        title: "New Head of Household",
        description: `${players.find(p => p.id === hohId)?.name} is the new HoH!`,
      });
      
      setTimeout(() => {
        setPhase('Nomination Ceremony');
        setSelectedPlayers([]);
        setStatusMessage('');
      }, 1500);
    }
  };

  return {
    handleSelectHoH
  };
}
