
import React, { createContext, useContext, ReactNode, useState } from 'react';
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
  const [showChat, setShowChat] = useState(false);
  const [gameMode, setGameMode] = useState<'singleplayer' | 'multiplayer' | null>(null);
  const [humanPlayers, setHumanPlayers] = useState<PlayerData[]>([]);
  const [countdownTimer, setCountdownTimer] = useState<number | null>(null);
  
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
    setShowChat(true); // Auto-show chat when game starts
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
    setShowChat(false);
    setGameMode(null);
    setHumanPlayers([]);
    setCountdownTimer(null);
  };

  // Create single player game
  const createSinglePlayerGame = () => {
    if (!playerAuth.authState.isAuthenticated || playerAuth.authState.isGuest) {
      playerAuth.addNotification({
        type: 'system_message',
        message: 'You need to be registered to play single player mode.'
      });
      return false;
    }
    
    setGameMode('singleplayer');
    if (playerAuth.authState.currentPlayer) {
      const humanPlayer = playerAuth.authState.currentPlayer;
      setHumanPlayers([humanPlayer]);
    }
    
    // Start game immediately since it's just one player
    gameStateManager.startGame(handleGameStart);
    return true;
  };
  
  // Create multiplayer game
  const createMultiplayerGame = (hostName: string) => {
    setGameMode('multiplayer');
    
    // Initialize with host player
    let hostPlayer: PlayerData;
    
    if (playerAuth.authState.isAuthenticated && playerAuth.authState.currentPlayer) {
      hostPlayer = playerAuth.authState.currentPlayer;
    } else {
      hostPlayer = {
        id: `host-${Date.now()}`,
        name: hostName,
        stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
      };
      playerAuth.loginAsGuest(hostName);
    }
    
    setHumanPlayers([hostPlayer]);
    
    // Start 30 second countdown to launch game
    setCountdownTimer(30);
    const countdownInterval = setInterval(() => {
      setCountdownTimer(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          if (humanPlayers.length >= 2) {
            // Launch game automatically if we have at least 2 human players
            gameStateManager.startGame(handleGameStart);
          } else {
            // Reset if not enough players joined
            playerAuth.addNotification({
              type: 'system_message',
              message: 'Not enough players joined. Please try again.'
            });
            setGameMode(null);
            setHumanPlayers([]);
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    gameStateManager.createGame(hostName);
    return true;
  };
  
  // Join multiplayer game
  const joinMultiplayerGame = (joinGameId: string, playerName: string) => {
    // Add the player to human players
    let joiningPlayer: PlayerData;
    
    if (playerAuth.authState.isAuthenticated && playerAuth.authState.currentPlayer) {
      joiningPlayer = playerAuth.authState.currentPlayer;
    } else {
      joiningPlayer = {
        id: `player-${Date.now()}`,
        name: playerName,
        stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
      };
      playerAuth.loginAsGuest(playerName);
    }
    
    setHumanPlayers(prev => [...prev, joiningPlayer]);
    
    // If we now have 2+ players and timer is still running, we're ready
    if (humanPlayers.length >= 2 && countdownTimer && countdownTimer > 0) {
      // Notify all players that the game will start soon
      playerAuth.addNotification({
        type: 'system_message',
        message: `Game will launch in ${countdownTimer} seconds.`
      });
    }
    
    gameStateManager.joinGame(joinGameId, playerName);
    return true;
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
        isGuest: playerAuth.authState.isGuest,
        login: playerAuth.login,
        register: playerAuth.register,
        loginAsGuest: playerAuth.loginAsGuest,
        logout: playerAuth.logout,
        updateProfile: playerAuth.updateProfile,
        updateSettings: playerAuth.updateSettings,
        addFriend: playerAuth.addFriend,
        removeFriend: playerAuth.removeFriend,
        addNotification: playerAuth.addNotification,
        markNotificationAsRead: playerAuth.markNotificationAsRead,
        clearNotifications: playerAuth.clearNotifications,
        friends: playerAuth.authState.friends,
        notifications: playerAuth.authState.notifications,
        settings: playerAuth.authState.settings,
        showChat,
        setShowChat,
        gameMode,
        humanPlayers,
        countdownTimer,
        createSinglePlayerGame,
        createMultiplayerGame,
        joinMultiplayerGame
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
