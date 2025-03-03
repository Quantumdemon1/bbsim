
import { toast } from "@/components/ui/use-toast";
import { PlayerData } from '@/components/PlayerProfile';

export function usePowerupManager(
  players: PlayerData[],
  setPlayers: (players: PlayerData[]) => void
) {
  const awardPowerup = (playerId: string, powerup: PlayerData['powerup']) => {
    const updatedPlayers = players.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          powerup
        };
      }
      return player;
    });
    
    setPlayers(updatedPlayers);
    
    const playerName = players.find(p => p.id === playerId)?.name;
    toast({
      title: "Power-Up Awarded",
      description: `${playerName} has received a special power!`
    });
  };
  
  const usePowerup = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player || !player.powerup) return;
    
    // Apply powerup effect based on type
    switch (player.powerup) {
      case 'immunity':
        toast({
          title: "Immunity Used",
          description: `${player.name} is now safe from eviction this week!`,
        });
        break;
      case 'coup':
        toast({
          title: "Coup d'État Used",
          description: `${player.name} has used the Coup d'État power to overthrow the HOH!`,
        });
        break;
      case 'replay':
        toast({
          title: "Competition Replay Used",
          description: `${player.name} has forced a replay of the competition!`,
        });
        break;
      case 'nullify':
        toast({
          title: "Veto Nullifier Used",
          description: `${player.name} has nullified the Power of Veto this week!`,
        });
        break;
    }
    
    // Remove the powerup after use
    const updatedPlayers = players.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          powerup: undefined,
          status: p.status === 'nominated' && player.powerup === 'immunity' ? 'safe' : p.status
        };
      }
      return p;
    });
    
    setPlayers(updatedPlayers);
  };

  return {
    awardPowerup,
    usePowerup
  };
}
