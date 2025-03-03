
import { PlayerData } from '@/components/PlayerProfileTypes';
import { PoVPhaseProps } from './types';

export function usePoVPhase({
  players,
  setPlayers,
  selectedPlayers,
  setVeto,
  setStatusMessage,
  setPhase,
  setSelectedPlayers,
  hoh,
  nominees,
  setVetoUsed,
  toast
}: PoVPhaseProps) {
  
  const selectVetoPlayers = () => {
    // In Big Brother, PoV competitions involve 6 players:
    // - The HoH
    // - The two nominees
    // - Three randomly selected houseguests
    
    const eligiblePlayers = players.filter(p => 
      p.status !== 'evicted' && 
      p.id !== hoh && 
      !nominees.includes(p.id)
    );
    
    // Randomly select 3 additional players if enough are available
    const additionalCount = Math.min(3, eligiblePlayers.length);
    const additionalPlayers: string[] = [];
    
    // Random selection without replacement
    const shuffled = [...eligiblePlayers].sort(() => 0.5 - Math.random());
    for (let i = 0; i < additionalCount; i++) {
      additionalPlayers.push(shuffled[i].id);
    }
    
    // Combine all veto players: HoH, nominees, and random selections
    const vetoPlayers = [
      ...(hoh ? [hoh] : []),
      ...nominees,
      ...additionalPlayers
    ];
    
    return vetoPlayers;
  };
  
  const handleSelectVeto = () => {
    if (selectedPlayers.length === 1) {
      const vetoId = selectedPlayers[0];
      setVeto(vetoId);
      setVetoUsed(false); // Reset veto usage status for the new week
      
      // Update player status
      setPlayers(players.map(player => ({
        ...player,
        status: player.id === vetoId 
          ? 'veto' 
          : (player.status === 'veto' ? undefined : player.status)
      })));
      
      // Update player stats
      setPlayers(players.map(player => {
        if (player.id === vetoId) {
          const currentStats = player.stats || {};
          return {
            ...player,
            stats: {
              ...currentStats,
              povWins: (currentStats.povWins || 0) + 1
            }
          };
        }
        return player;
      }));
      
      setStatusMessage(`${players.find(p => p.id === vetoId)?.name} has won the Power of Veto!`);
      
      toast({
        title: "Power of Veto",
        description: `${players.find(p => p.id === vetoId)?.name} has won the PoV!`,
      });
      
      setTimeout(() => {
        setPhase('Veto Ceremony');
        setSelectedPlayers([]);
        setStatusMessage('');
      }, 1500);
    }
  };

  return {
    handleSelectVeto,
    selectVetoPlayers
  };
}
