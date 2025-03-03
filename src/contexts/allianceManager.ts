
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { Alliance, mockPlayers } from './types';
import { PlayerData } from '@/components/PlayerProfile';

export function useAllianceManager(
  players: PlayerData[],
  setPlayers: (players: PlayerData[]) => void
) {
  const [alliances, setAlliances] = useState<Alliance[]>([]);

  const createAlliance = (name: string, members: string[]) => {
    const newAlliance: Alliance = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      members
    };
    
    setAlliances([...alliances, newAlliance]);
    
    // Update player alliances
    const updatedPlayers = players.map(player => {
      if (members.includes(player.id)) {
        const currentAlliances = player.alliances || [];
        return {
          ...player,
          alliances: [...currentAlliances, name]
        };
      }
      return player;
    });
    
    setPlayers(updatedPlayers);
    
    toast({
      title: "Alliance Formed",
      description: `"${name}" alliance has been created.`
    });
  };
  
  const addToAlliance = (allianceId: string, playerId: string) => {
    const updatedAlliances = alliances.map(alliance => {
      if (alliance.id === allianceId && !alliance.members.includes(playerId)) {
        return {
          ...alliance,
          members: [...alliance.members, playerId]
        };
      }
      return alliance;
    });
    
    setAlliances(updatedAlliances);
    
    // Update player's alliance list
    const updatedPlayers = players.map(player => {
      if (player.id === playerId) {
        const alliance = alliances.find(a => a.id === allianceId);
        if (alliance) {
          const currentAlliances = player.alliances || [];
          return {
            ...player,
            alliances: [...currentAlliances, alliance.name]
          };
        }
      }
      return player;
    });
    
    setPlayers(updatedPlayers);
  };
  
  const removeFromAlliance = (allianceId: string, playerId: string) => {
    const alliance = alliances.find(a => a.id === allianceId);
    if (!alliance) return;
    
    const updatedAlliances = alliances.map(a => {
      if (a.id === allianceId) {
        return {
          ...a,
          members: a.members.filter(id => id !== playerId)
        };
      }
      return a;
    });
    
    setAlliances(updatedAlliances);
    
    // Update player's alliance list
    const updatedPlayers = players.map(player => {
      if (player.id === playerId && player.alliances) {
        return {
          ...player,
          alliances: player.alliances.filter(name => name !== alliance.name)
        };
      }
      return player;
    });
    
    setPlayers(updatedPlayers);
  };

  return {
    alliances,
    setAlliances,
    createAlliance,
    addToAlliance,
    removeFromAlliance
  };
}
