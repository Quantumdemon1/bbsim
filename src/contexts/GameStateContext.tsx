
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useGameStateManager } from '@/hooks/useGameStateManager';
import { usePlayerManagerContext } from './PlayerManagerContext';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface GameStateContextType {
  gameId: string | null;
  isHost: boolean;
  playerName: string;
  setPlayerName: (name: string) => void;
  gameState: 'idle' | 'lobby' | 'playing' | 'ended';
  currentWeek: number;
  setCurrentWeek: (week: number) => void;
  createGame: (hostName: string) => void;
  joinGame: (gameId: string, playerName: string) => void;
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  gameMode: 'singleplayer' | 'multiplayer' | null;
  humanPlayers: PlayerData[];
  countdownTimer: number | null;
  createSinglePlayerGame: (bypassAuth?: boolean) => boolean;
  createMultiplayerGame: (hostName: string) => boolean;
  joinMultiplayerGame: (gameId: string, playerName: string) => boolean;
}

const GameStateContext = createContext<GameStateContextType>({} as GameStateContextType);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const { players, setPlayers } = usePlayerManagerContext();
  const gameStateManager = useGameStateManager(players);
  const [showChat, setShowChat] = useState(false);
  const [gameMode, setGameMode] = useState<'singleplayer' | 'multiplayer' | null>(null);
  const [humanPlayers, setHumanPlayers] = useState<PlayerData[]>([]);
  const [countdownTimer, setCountdownTimer] = useState<number | null>(null);
  
  // Import hooks from other contexts
  const { 
    gameId,
    isHost,
    playerName,
    setPlayerName,
    gameState,
    currentWeek,
    setCurrentWeek,
    createGame,
    joinGame,
    startGame: gameStateStart,
    endGame,
    resetGame: gameStateReset
  } = gameStateManager;
  
  // Use the PlayerManagerContext
  const handleGameStart = () => {
    // Setup some starting alliances randomly for more interesting gameplay
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
    
    // This will be handled by the Alliance context, but we need to reference it here
    // Will be integrated with useAllianceContext() later in the component tree
    
    // Initialize default attributes for all players
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
    
    // Assign alliances and default attributes to players
    const updatedPlayers = [...players].map(player => {
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
    setShowChat(true); // Auto-show chat when game starts
  };

  // Handle game reset to initial state
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
    setGameMode(null);
    setHumanPlayers([]);
    setCountdownTimer(null);
  };

  // Wrapped game state functions
  const startGame = () => {
    gameStateStart(handleGameStart);
  };

  const resetGame = () => {
    gameStateReset(handleGameReset);
  };

  // Create single player game
  const createSinglePlayerGame = (bypassAuth = false) => {
    // We'll use useAuthContext in the component tree to get auth state
    // but for now this is just a placeholder. This will be integrated later.
    const authState = { isAuthenticated: true, currentPlayer: null };

    // If bypassAuth is true, skip the authentication check
    if (!bypassAuth && !authState.isAuthenticated) {
      return false;
    }
    
    setGameMode('singleplayer');
    
    // If player is authenticated, use their profile
    if (authState.currentPlayer) {
      const humanPlayer = authState.currentPlayer;
      setHumanPlayers([humanPlayer]);
    } else {
      // For admin bypass, create a temporary player
      const tempPlayer: PlayerData = {
        id: `admin-${Date.now()}`,
        name: 'Admin',
        stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
      };
      setHumanPlayers([tempPlayer]);
    }
    
    // Start game immediately since it's just one player
    gameStateStart(handleGameStart);
    return true;
  };
  
  // Create multiplayer game
  const createMultiplayerGame = (hostName: string) => {
    setGameMode('multiplayer');
    
    // Initialize with host player
    const hostPlayer: PlayerData = {
      id: `host-${Date.now()}`,
      name: hostName,
      stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
    };
    
    setHumanPlayers([hostPlayer]);
    
    // Start 30 second countdown to launch game
    setCountdownTimer(30);
    const countdownInterval = setInterval(() => {
      setCountdownTimer(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          if (humanPlayers.length >= 2) {
            // Launch game automatically if we have at least 2 human players
            gameStateStart(handleGameStart);
          } else {
            // Reset if not enough players joined
            setGameMode(null);
            setHumanPlayers([]);
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    createGame(hostName);
    return true;
  };
  
  // Join multiplayer game
  const joinMultiplayerGame = (joinGameId: string, playerName: string) => {
    // Add the player to human players
    const joiningPlayer: PlayerData = {
      id: `player-${Date.now()}`,
      name: playerName,
      stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
    };
    
    setHumanPlayers(prev => [...prev, joiningPlayer]);
    
    // If we now have 2+ players and timer is still running, we're ready
    if (humanPlayers.length >= 2 && countdownTimer && countdownTimer > 0) {
      // Notify all players that the game will start soon
    }
    
    joinGame(joinGameId, playerName);
    return true;
  };

  return (
    <GameStateContext.Provider
      value={{
        gameId,
        isHost,
        playerName,
        setPlayerName,
        gameState,
        currentWeek,
        setCurrentWeek,
        createGame,
        joinGame,
        startGame,
        endGame,
        resetGame,
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
    </GameStateContext.Provider>
  );
};

export const useGameStateContext = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameStateContext must be used within a GameStateProvider');
  }
  return context;
};
