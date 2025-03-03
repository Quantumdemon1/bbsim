
import { PlayerData } from '@/components/PlayerProfile';
import { Toast } from '@/components/ui/use-toast';

interface NominationPhaseProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  setNominees: (nominees: string[]) => void;
  hoh: string | null;
  setStatusMessage: (message: string) => void;
  setPhase: (phase: string) => void;
  setSelectedPlayers: (players: string[]) => void;
  usePowerup: (playerId: string) => void;
  toast: Toast;
}

export function useNominationPhase({
  players,
  setPlayers,
  selectedPlayers,
  setNominees,
  hoh,
  setStatusMessage,
  setPhase,
  setSelectedPlayers,
  usePowerup,
  toast
}: NominationPhaseProps) {
  
  const handleNominate = () => {
    if (selectedPlayers.length === 2) {
      // Check if any nominees have immunity
      const immuneNominee = players.find(p => 
        selectedPlayers.includes(p.id) && p.powerup === 'immunity'
      );
      
      if (immuneNominee) {
        usePowerup(immuneNominee.id);
        
        // Replace the immune nominee with another player
        const availablePlayers = players.filter(p => 
          !selectedPlayers.includes(p.id) && 
          p.id !== hoh && 
          p.status !== 'evicted' &&
          p.powerup !== 'immunity'
        );
        
        if (availablePlayers.length > 0) {
          const replacementIndex = Math.floor(Math.random() * availablePlayers.length);
          const replacementId = availablePlayers[replacementIndex].id;
          
          const updatedNominees = selectedPlayers.filter(id => id !== immuneNominee.id);
          updatedNominees.push(replacementId);
          
          setNominees(updatedNominees);
          
          // Update player status
          setPlayers(players.map(player => ({
            ...player,
            status: updatedNominees.includes(player.id) 
              ? 'nominated' 
              : (player.id === immuneNominee.id ? 'safe' : 
                 (player.status === 'nominated' ? undefined : player.status))
          })));
          
          const nominee1 = players.find(p => p.id === updatedNominees[0])?.name;
          const nominee2 = players.find(p => p.id === updatedNominees[1])?.name;
          
          setStatusMessage(`${immuneNominee.name} used immunity! ${nominee1} and ${nominee2} are now nominated for eviction!`);
        }
      } else {
        setNominees(selectedPlayers);
        
        // Update player status
        setPlayers(players.map(player => ({
          ...player,
          status: selectedPlayers.includes(player.id) 
            ? 'nominated' 
            : (player.status === 'nominated' ? undefined : player.status)
        })));
        
        const nominee1 = players.find(p => p.id === selectedPlayers[0])?.name;
        const nominee2 = players.find(p => p.id === selectedPlayers[1])?.name;
        
        setStatusMessage(`${nominee1} and ${nominee2} have been nominated for eviction!`);
      }
      
      toast({
        title: "Nomination Ceremony",
        description: setStatusMessage,
      });
      
      setTimeout(() => {
        setPhase('PoV Competition');
        setSelectedPlayers([]);
        setStatusMessage('');
      }, 1500);
    }
  };

  return {
    handleNominate
  };
}
