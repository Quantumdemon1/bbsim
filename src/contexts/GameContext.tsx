
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";
import { GameContextType, mockPlayers } from './types';
import { useAllianceManager } from './allianceManager';
import { usePowerupManager } from './powerupManager';
import { PlayerData } from '@/components/PlayerProfile';
import { PlayerAttributes, PlayerRelationship } from '@/hooks/game-phases/types';

// Create the context with a default empty object
const GameContext = createContext<GameContextType>({} as GameContextType);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [players, setPlayers] = useState<PlayerData[]>(mockPlayers);
  const [gameId, setGameId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [gameState, setGameState] = useState<'idle' | 'lobby' | 'playing' | 'ended'>('idle');
  const [currentWeek, setCurrentWeek] = useState(1);
  
  // Import our modular managers
  const allianceManager = useAllianceManager(players, setPlayers);
  const powerupManager = usePowerupManager(players, setPlayers);

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
    const newAlliances = [
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
    
    allianceManager.setAlliances(newAlliances);
    
    // Initialize default attributes for all players
    const defaultAttributes: PlayerAttributes = {
      general: 3,
      physical: 3,
      endurance: 3,
      mentalQuiz: 3,
      strategic: 3,
      loyalty: 3,
      social: 3,
      temperament: 3
    };
    
    // Assign alliances and default attributes to players
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
      
      // Create default relationships
      const relationships: PlayerRelationship[] = mockPlayers
        .filter(p => p.id !== player.id)
        .map(target => ({
          playerId: player.id,
          targetId: target.id,
          type: 'Neutral',
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
      powerup: undefined,
      attributes: undefined,
      relationships: undefined
    })));
    allianceManager.setAlliances([]);
  };
  
  const updatePlayerAttributes = (playerId: string, attributes: PlayerAttributes) => {
    setPlayers(prevPlayers => prevPlayers.map(player => 
      player.id === playerId ? { ...player, attributes } : player
    ));
  };
  
  const updatePlayerRelationships = (playerId: string, relationships: PlayerRelationship[]) => {
    setPlayers(prevPlayers => prevPlayers.map(player => 
      player.id === playerId ? { ...player, relationships } : player
    ));
    
    // If any relationships are mutual, update the target player as well
    relationships.forEach(relationship => {
      if (relationship.isMutual) {
        setPlayers(prevPlayers => prevPlayers.map(player => {
          if (player.id === relationship.targetId) {
            const existingRelationships = player.relationships || [];
            const existingRelIndex = existingRelationships.findIndex(r => r.targetId === playerId);
            
            if (existingRelIndex >= 0) {
              // Update existing relationship
              const updatedRelationships = [...existingRelationships];
              updatedRelationships[existingRelIndex] = {
                ...updatedRelationships[existingRelIndex],
                type: relationship.type,
                extraPoints: relationship.extraPoints,
                isMutual: true,
                isPermanent: relationship.isPermanent
              };
              return { ...player, relationships: updatedRelationships };
            } else {
              // Create new relationship
              return {
                ...player,
                relationships: [
                  ...existingRelationships,
                  {
                    playerId: relationship.targetId,
                    targetId: relationship.playerId,
                    type: relationship.type,
                    extraPoints: relationship.extraPoints,
                    isMutual: true,
                    isPermanent: relationship.isPermanent
                  }
                ]
              };
            }
          }
          return player;
        }));
      }
    });
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
        updatePlayerAttributes,
        updatePlayerRelationships,
        ...allianceManager,
        ...powerupManager
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
