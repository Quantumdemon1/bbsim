import { GameActionsProps, GamePhaseState } from './types';
import { PlayerData } from '@/components/PlayerProfile';

export function useGameActions({
  state,
  setPlayers,
  setWeek,
  setPhase,
  setHoH,
  setVeto,
  setNominees,
  setSelectedPlayers,
  setStatusMessage,
  usePowerup,
  toast
}: GameActionsProps) {
  
  const handleNextWeek = () => {
    const { players, week } = state;
    
    // Check if we should have a special competition
    const hasSpecialComp = week % 3 === 0 || Math.random() < 0.2; // Every 3rd week or 20% chance
    
    if (hasSpecialComp) {
      // Reset player statuses except for evicted players
      setPlayers(players.map(player => ({
        ...player,
        status: player.status === 'evicted' ? 'evicted' : undefined
      })));
      
      setHoH(null);
      setVeto(null);
      setNominees([]);
      setSelectedPlayers([]);
      setPhase('Special Competition');
      
      toast({
        title: "Special Competition",
        description: "A special competition is taking place!",
      });
    } else {
      // Reset game state for next week
      setWeek(week + 1);
      setPhase('HoH Competition');
      setHoH(null);
      setVeto(null);
      setNominees([]);
      setSelectedPlayers([]);
      setStatusMessage('');
      
      // Reset player statuses except for evicted players
      setPlayers(players.map(player => ({
        ...player,
        status: player.status === 'evicted' ? 'evicted' : undefined
      })));
      
      toast({
        title: `Week ${week + 1}`,
        description: `Starting week ${week + 1}`,
      });
    }
  };

  return {
    handleNextWeek
  };
}
