
import { PlayerData } from '@/components/PlayerProfileTypes';
import { HoHPhaseProps } from './types';

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
