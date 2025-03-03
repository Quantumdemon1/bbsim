
import { PlayerData } from '@/components/PlayerProfile';
import { Toast } from '@/components/ui/use-toast';

interface SpecialCompetitionPhaseProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  selectedPlayers: string[];
  week: number;
  setWeek: (week: number) => void;
  setPhase: (phase: string) => void;
  setSelectedPlayers: (players: string[]) => void;
  setStatusMessage: (message: string) => void;
  toast: Toast;
}

export function useSpecialCompetitionPhase({
  players,
  setPlayers,
  selectedPlayers,
  week,
  setWeek,
  setPhase,
  setSelectedPlayers,
  setStatusMessage,
  toast
}: SpecialCompetitionPhaseProps) {
  
  const handleSpecialCompetition = () => {
    // Award a random power-up to the winner
    if (selectedPlayers.length === 1) {
      const winnerId = selectedPlayers[0];
      const powerupTypes: PlayerData['powerup'][] = ['immunity', 'coup', 'replay', 'nullify'];
      const randomPowerup = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
      
      // Update the player with the new power-up
      setPlayers(players.map(player => {
        if (player.id === winnerId) {
          return {
            ...player,
            powerup: randomPowerup
          };
        }
        return player;
      }));
      
      const winnerName = players.find(p => p.id === winnerId)?.name;
      setStatusMessage(`${winnerName} has won the special competition and earned a power-up!`);
      
      toast({
        title: "Special Competition",
        description: `${winnerName} has won a special power!`,
      });
      
      // Move to next week
      setTimeout(() => {
        setWeek(week + 1);
        setPhase('HoH Competition');
        setSelectedPlayers([]);
        setStatusMessage('');
      }, 1500);
    }
  };

  return {
    handleSpecialCompetition
  };
}
