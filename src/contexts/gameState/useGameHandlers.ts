
import { PlayerData } from '@/components/PlayerProfileTypes';

interface GameHandlersProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  saveCurrentGame: () => Promise<void>;
  setShowChat: (show: boolean) => void;
  clearPhaseProgress: (phase: string) => void;
}

export function useGameHandlers({
  players,
  setPlayers,
  saveCurrentGame,
  setShowChat,
  clearPhaseProgress
}: GameHandlersProps) {
  
  const handleGameStart = () => {
    const newAlliances = [
      {
        id: 'alliance1',
        name: 'The Outsiders',
        members: [players[0].id, players[1].id, players[2].id]
      },
      {
        id: 'alliance2',
        name: 'The Strategists',
        members: [players[3].id, players[4].id, players[5].id]
      }
    ];
    
    const defaultAttributes = {
      general: 3,
      physical: 3,
      endurance: 3,
      mentalQuiz: 3,
      strategic: 3,
      loyalty: 3,
      social: 3,
      temperament: 3
    };
    
    const updatedPlayers = [...players].map(player => {
      const playerAlliances: string[] = [];
      newAlliances.forEach(alliance => {
        if (alliance.members.includes(player.id)) {
          playerAlliances.push(alliance.name);
        }
      });
      
      const hasPowerup = Math.random() < 0.1;
      const powerupTypes: PlayerData['powerup'][] = ['immunity', 'coup', 'replay', 'nullify'];
      const randomPowerup = hasPowerup ? powerupTypes[Math.floor(Math.random() * powerupTypes.length)] : undefined;
      
      const relationships = players
        .filter(p => p.id !== player.id)
        .map(target => ({
          playerId: player.id,
          targetId: target.id,
          type: 'Neutral' as any,
          extraPoints: 0,
          isMutual: false,
          isPermanent: false
        }));
      
      return {
        ...player,
        alliances: playerAlliances.length > 0 ? playerAlliances : undefined,
        powerup: randomPowerup,
        attributes: defaultAttributes,
        relationships
      };
    });
    
    setPlayers(updatedPlayers);
    setShowChat(true);
    
    saveCurrentGame();
  };

  const handleGameReset = () => {
    setPlayers(players.map(player => ({
      ...player,
      status: undefined,
      alliances: undefined,
      powerup: undefined,
      attributes: undefined,
      relationships: undefined
    })));
    setShowChat(false);
    clearPhaseProgress('*');
  };

  return {
    handleGameStart,
    handleGameReset
  };
}
