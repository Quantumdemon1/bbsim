
import { useState } from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useToast } from "@/components/ui/use-toast";

interface GameModesProps {
  createGame: (hostName: string) => void;
  joinGame: (gameId: string, playerName: string) => void;
  startGame: (onGameStart: () => void) => void;
}

export function useGameModes({ createGame, joinGame, startGame }: GameModesProps) {
  const [gameMode, setGameMode] = useState<'singleplayer' | 'multiplayer' | null>(null);
  const [humanPlayers, setHumanPlayers] = useState<PlayerData[]>([]);
  const [countdownTimer, setCountdownTimer] = useState<number | null>(null);
  const { toast } = useToast();

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
        isAdmin: true,
        stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
      };
      setHumanPlayers([tempPlayer]);
    }
    
    // Start game immediately since it's just one player
    const handleGameStart = () => {
      // Setup would happen here
    };
    
    startGame(handleGameStart);
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
            const handleGameStart = () => {
              // Setup would happen here
            };
            startGame(handleGameStart);
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
  const joinMultiplayerGame = (gameId: string, playerName: string) => {
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
    
    joinGame(gameId, playerName);
    return true;
  };

  return {
    gameMode,
    humanPlayers,
    countdownTimer,
    createSinglePlayerGame,
    createMultiplayerGame,
    joinMultiplayerGame
  };
}
