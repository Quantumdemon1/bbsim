
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
  toast
}: PoVPhaseProps) {
  
  const handleSelectVeto = () => {
    if (selectedPlayers.length === 1) {
      const vetoId = selectedPlayers[0];
      setVeto(vetoId);
      
      // Update player status
      setPlayers(players.map(player => ({
        ...player,
        status: player.id === vetoId 
          ? 'veto' 
          : (player.status === 'veto' ? undefined : player.status)
      })));
      
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
    handleSelectVeto
  };
}
