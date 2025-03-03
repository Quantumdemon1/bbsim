
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

export function useGameSession() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [gameState, setGameState] = useState<'idle' | 'lobby' | 'playing' | 'ended'>('idle');
  const { toast } = useToast();
  
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

  const joinGame = (gameId: string, name: string) => {
    // In a real app, we would make an API call to join a game
    setGameId(gameId);
    setIsHost(false);
    setPlayerName(name);
    setGameState('lobby');
    
    toast({
      title: "Game Joined",
      description: `You have joined game room ${gameId}`,
    });
  };

  const startGame = (onGameStart?: () => void) => {
    setGameState('playing');
    
    // Call the onGameStart callback to perform any additional setup
    if (onGameStart) {
      onGameStart();
    }
    
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

  const resetGame = (onReset?: () => void) => {
    setGameId(null);
    setIsHost(false);
    setPlayerName('');
    setGameState('idle');
    
    // Call the onReset callback to perform any additional reset actions
    if (onReset) {
      onReset();
    }
  };

  return {
    gameId,
    isHost,
    playerName,
    setPlayerName,
    gameState,
    createGame,
    joinGame,
    startGame,
    endGame,
    resetGame,
    toast,
  };
}
