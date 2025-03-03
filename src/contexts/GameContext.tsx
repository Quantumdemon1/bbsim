
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PlayerData } from '@/components/PlayerProfile';
import { toast } from "@/components/ui/use-toast";

export interface GameContextType {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  gameId: string | null;
  createGame: (hostName: string) => void;
  joinGame: (gameId: string, playerName: string) => void;
  isHost: boolean;
  playerName: string;
  setPlayerName: (name: string) => void;
  gameState: 'idle' | 'lobby' | 'playing' | 'ended';
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  currentWeek: number;
  setCurrentWeek: (week: number) => void;
  alliances: Alliance[];
  createAlliance: (name: string, members: string[]) => void;
  addToAlliance: (allianceId: string, playerId: string) => void;
  removeFromAlliance: (allianceId: string, playerId: string) => void;
  awardPowerup: (playerId: string, powerup: PlayerData['powerup']) => void;
  usePowerup: (playerId: string) => void;
}

interface Alliance {
  id: string;
  name: string;
  members: string[];
}

// Mock player data
const mockPlayers: PlayerData[] = [
  { id: '1', name: 'Alison Irwin', image: '/lovable-uploads/cec1a3bf-b0b6-4618-9c68-1585b9e53db4.png' },
  { id: '2', name: 'Amanda Craig', image: '/lovable-uploads/91a67156-682e-4ddb-a5dd-5865bb9e6039.png' },
  { id: '3', name: 'Dana Varela', image: '/lovable-uploads/62e1b219-b620-4564-afbf-ee01822b7c62.png' },
  { id: '4', name: 'David Lane', image: '/lovable-uploads/23bf364e-3dd8-45f7-be75-bce577622671.png' },
  { id: '5', name: 'Erika Landin', image: '/lovable-uploads/b8053ed2-cc2a-4313-9be2-3d9645df4658.png' },
  { id: '6', name: 'Jack Owens', image: '/lovable-uploads/217fbf50-5a84-4ce2-adff-3dafacb78567.png' },
  { id: '7', name: 'Jee Choe', image: '/placeholder.svg' },
  { id: '8', name: 'Jun Song', image: '/placeholder.svg' },
  { id: '9', name: 'Justin Giovinco', image: '/placeholder.svg' },
  { id: '10', name: 'Michelle Maradie', image: '/placeholder.svg' },
  { id: '11', name: 'Nathan Marlow', image: '/placeholder.svg' },
  { id: '12', name: 'Robert Roman', image: '/placeholder.svg' },
  { id: '13', name: 'Scott Weintraub', image: '/placeholder.svg' },
];

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [players, setPlayers] = useState<PlayerData[]>(mockPlayers);
  const [gameId, setGameId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [gameState, setGameState] = useState<'idle' | 'lobby' | 'playing' | 'ended'>('idle');
  const [currentWeek, setCurrentWeek] = useState(1);
  const [alliances, setAlliances] = useState<Alliance[]>([]);

  const createGame = (hostName: string) => {
    // In a real app, we would make an API call to create a game
    const newGameId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGameId(newGameId);
    setIsHost(true);
    setPlayerName(hostName);
    setGameState('lobby');
    
    toast({
      title: "Game Created",
      description: `Game room ${newGameId} created. Share this code with your friends!`,
    });
  };

  const joinGame = (joinGameId: string, name: string) => {
    // In a real app, we would make an API call to join a game
    setGameId(joinGameId);
    setIsHost(false);
    setPlayerName(name);
    setGameState('lobby');
    
    toast({
      title: "Game Joined",
      description: `You have joined game room ${joinGameId}`,
    });
  };

  const startGame = () => {
    // Setup some starting alliances randomly for more interesting gameplay
    const newAlliances: Alliance[] = [
      {
        id: 'alliance1',
        name: 'The Outsiders',
        members: [mockPlayers[0].id, mockPlayers[1].id, mockPlayers[2].id]
      },
      {
        id: 'alliance2',
        name: 'The Strategists',
        members: [mockPlayers[3].id, mockPlayers[4].id, mockPlayers[5].id]
      }
    ];
    
    setAlliances(newAlliances);
    
    // Assign alliances to players
    const updatedPlayers = [...mockPlayers].map(player => {
      const playerAlliances: string[] = [];
      newAlliances.forEach(alliance => {
        if (alliance.members.includes(player.id)) {
          playerAlliances.push(alliance.name);
        }
      });
      
      // Random powerup for 2 players to start (10% chance for each remaining player)
      const hasPowerup = Math.random() < 0.1;
      const powerupTypes: PlayerData['powerup'][] = ['immunity', 'coup', 'replay', 'nullify'];
      const randomPowerup = hasPowerup ? powerupTypes[Math.floor(Math.random() * powerupTypes.length)] : undefined;
      
      return {
        ...player,
        alliances: playerAlliances.length > 0 ? playerAlliances : undefined,
        powerup: randomPowerup
      };
    });
    
    setPlayers(updatedPlayers);
    setGameState('playing');
    setCurrentWeek(1);
    
    toast({
      title: "Game Started",
      description: "The Big Brother season has begun! Alliances have been formed.",
    });
  };

  const endGame = () => {
    setGameState('ended');
    
    toast({
      title: "Game Ended",
      description: "The Big Brother season has concluded!",
    });
  };

  const resetGame = () => {
    setGameId(null);
    setIsHost(false);
    setPlayerName('');
    setGameState('idle');
    setCurrentWeek(1);
    setPlayers(mockPlayers.map(player => ({
      ...player,
      status: undefined,
      alliances: undefined,
      powerup: undefined
    })));
    setAlliances([]);
  };
  
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

  return (
    <GameContext.Provider
      value={{
        players,
        setPlayers,
        gameId,
        createGame,
        joinGame,
        isHost,
        playerName,
        setPlayerName,
        gameState,
        startGame,
        endGame,
        resetGame,
        currentWeek,
        setCurrentWeek,
        alliances,
        createAlliance,
        addToAlliance,
        removeFromAlliance,
        awardPowerup,
        usePowerup
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
