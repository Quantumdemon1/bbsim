
import { useGameContext } from '@/contexts/GameContext';
import { HoHPhaseProps } from './types';
import { PlayerData } from '@/components/PlayerProfileTypes';

/**
 * Hook to manage the Head of Household competition phase
 */
export function useHoHPhase({
  players,
  setPlayers,
  selectedPlayers,
  setHoH,
  setStatusMessage,
  setPhase,
  setSelectedPlayers,
  lastHoH,
  setLastHoH,
  toast
}: HoHPhaseProps) {
  
  const handleSelectHoH = async () => {
    if (!selectedPlayers || selectedPlayers.length !== 1) {
      toast({
        description: "You must select exactly one player to be HoH",
        variant: "destructive"
      });
      return;
    }
    
    const newHoH = selectedPlayers[0];
    
    // Get the selected player
    const hohPlayer = players.find(p => p.id === newHoH);
    if (!hohPlayer) return;
    
    // Set the new HoH
    setHoH(newHoH);
    if (setLastHoH) {
      setLastHoH(newHoH);
    }
    
    // Update player statuses
    const updatedPlayers = players.map(player => {
      if (player.id === newHoH) {
        return { ...player, status: 'hoh' as const };
      } else if (player.status === 'hoh') {
        return { ...player, status: 'safe' as const };
      }
      return player;
    });
    
    setPlayers(updatedPlayers);
    
    // Move to the next phase
    setStatusMessage(`${hohPlayer?.name} is the new Head of Household!`);
    setPhase('Nomination Ceremony');
    setSelectedPlayers([]);
    
    toast({
      description: `${hohPlayer?.name} is the new Head of Household!`
    });
  };
  
  return {
    handleSelectHoH
  };
}
