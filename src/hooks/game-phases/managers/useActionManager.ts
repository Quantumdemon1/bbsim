import { GameActionsProps } from '../types';

/**
 * Hook that handles common game actions for all phases
 */
export function useActionManager({
  state,
  setters,
  usePowerup,
  toast
}: {
  state: GameActionsProps['state'],
  setters: {
    setPlayers: GameActionsProps['setPlayers'],
    setWeek: GameActionsProps['setWeek'],
    setPhase: GameActionsProps['setPhase'],
    setHoH: GameActionsProps['setHoH'],
    setVeto: GameActionsProps['setVeto'],
    setNominees: GameActionsProps['setNominees'],
    setSelectedPlayers: GameActionsProps['setSelectedPlayers'],
    setStatusMessage: GameActionsProps['setStatusMessage'],
    setWeekSummaries: (summaries: any[]) => void
  },
  usePowerup: GameActionsProps['usePowerup'],
  toast: GameActionsProps['toast']
}) {
  const handleNextWeek = () => {
    // Reset phase-specific selections
    setters.setSelectedPlayers([]);
    setters.setHoH(null);
    setters.setVeto(null);
    setters.setNominees([]);
    
    // Increment week
    const newWeek = state.week + 1;
    setters.setWeek(newWeek);
    
    // Update UI
    setters.setStatusMessage(`Week ${newWeek} has begun!`);
    
    // If we've reached a certain week, start jury phase
    if (newWeek > 7) {
      toast({
        title: "Finale Time!",
        description: "The game has reached the finale!",
      });
      setters.setPhase('Jury Questions');
    } else {
      // Otherwise continue to next week's HoH competition
      setters.setPhase('HoH Competition');
      
      // For testing, we can add a special competition occasionally
      if (newWeek % 3 === 0) {
        toast({
          title: "Special Week!",
          description: "This week features a special competition!",
        });
        setters.setPhase('Special Competition');
      }
    }
    
    // Update player stats
    const updatedPlayers = state.players.map(player => {
      // Initialize stats object if it doesn't exist
      const stats = player.stats || {};
      
      // If they were HoH this week, increment their HoH wins
      if (player.id === state.hoh) {
        return {
          ...player,
          stats: {
            ...stats,
            hohWins: (stats.hohWins || 0) + 1,
          }
        };
      }
      
      // If they won veto this week, increment their PoV wins
      if (player.id === state.veto) {
        return {
          ...player,
          stats: {
            ...stats,
            povWins: (stats.povWins || 0) + 1,
          }
        };
      }
      
      // If they were nominated, increment times nominated
      if (state.nominees.includes(player.id)) {
        return {
          ...player,
          stats: {
            ...stats,
            timesNominated: (stats.timesNominated || 0) + 1,
          }
        };
      }
      
      return player;
    });
    
    setters.setPlayers(updatedPlayers);
    
    // After eviction, if we're down to 2 players, go to finale
    const remainingPlayers = updatedPlayers.filter(p => p.status !== 'evicted');
    if (remainingPlayers.length <= 3) {
      toast({
        title: "Finale!",
        description: "We've reached the final players! Time for the finale!",
      });
      setters.setPhase('Jury Questions');
    }
  };
  
  return {
    handleNextWeek
  };
}
