
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
  lastHoH,
  setLastHoH,
  toast
}: HoHPhaseProps) {
  
  const handleSelectHoH = () => {
    if (selectedPlayers.length === 1) {
      const hohId = selectedPlayers[0];
      
      // Check if this player was HoH last week (except for Final 3 HoH)
      if (lastHoH === hohId && players.filter(p => p.status !== 'evicted').length > 3) {
        toast({
          title: "Invalid Selection",
          description: "A player cannot be HoH two weeks in a row!",
          variant: "destructive"
        });
        return;
      }
      
      setHoH(hohId);
      setLastHoH(hohId); // Track who was HoH this week
      
      // Update player status
      setPlayers(players.map(player => ({
        ...player,
        status: player.id === hohId ? 'hoh' : (player.status === 'hoh' ? undefined : player.status)
      })));
      
      // Update player stats
      setPlayers(players.map(player => {
        if (player.id === hohId) {
          const currentStats = player.stats || {};
          return {
            ...player,
            stats: {
              ...currentStats,
              hohWins: (currentStats.hohWins || 0) + 1
            }
          };
        }
        return player;
      }));
      
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
