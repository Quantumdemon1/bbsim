
import React, { createContext, useContext, ReactNode } from 'react';
import { GameContextType, mockPlayers } from './types';
import { useAllianceManager } from './allianceManager';
import { usePowerupManager } from './powerupManager';
import { usePlayerManager } from '@/hooks/usePlayerManager';
import { useGameStateManager } from '@/hooks/useGameStateManager';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { PlayerAttributes, PlayerRelationship, RelationshipType } from '@/hooks/game-phases/types';
import { usePlayerAuth } from '@/hooks/usePlayerAuth';

// Create the context with a default empty object
const GameContext = createContext<GameContextType>({} as GameContextType);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  // Use our new hooks for player and game state management
  const playerManager = usePlayerManager(mockPlayers);
  const gameStateManager = useGameStateManager(mockPlayers);
  const playerAuth = usePlayerAuth();
  
  // Import our modular managers
  const allianceManager = useAllianceManager(playerManager.players, playerManager.setPlayers);
  const powerupManager = usePowerupManager(playerManager.players, playerManager.setPlayers);

  // Handle game start setup
  const handleGameStart = () => {
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
          type: 'Neutral' as RelationshipType,
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
    
    playerManager.setPlayers(updatedPlayers);
  };

  // Handle game reset to initial state
  const handleGameReset = () => {
    playerManager.setPlayers(mockPlayers.map(player => ({
      ...player,
      status: undefined,
      alliances: undefined,
      powerup: undefined,
      attributes: undefined,
      relationships: undefined
    })));
    allianceManager.setAlliances([]);
  };

  // Wrapper functions to connect the hooks
  const startGame = () => {
    gameStateManager.startGame(handleGameStart);
  };

  const resetGame = () => {
    gameStateManager.resetGame(handleGameReset);
  };

  return (
    <GameContext.Provider
      value={{
        ...playerManager,
        ...gameStateManager,
        startGame,
        resetGame,
        ...allianceManager,
        ...powerupManager,
        isAuthenticated: playerAuth.authState.isAuthenticated,
        currentPlayer: playerAuth.authState.currentPlayer,
        isGuest: playerAuth.authState.isGuest
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
