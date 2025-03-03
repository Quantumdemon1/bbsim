
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { PlayerData } from '@/components/PlayerProfileTypes';

export function useGameCore() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [gameState, setGameState] = useState<'idle' | 'lobby' | 'playing' | 'ended'>('idle');
  const [currentWeek, setCurrentWeek] = useState(1);
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

  const startGame = (onGameStart: () => void) => {
    setGameState('playing');
    setCurrentWeek(1);
    
    // Call the onGameStart callback to perform any additional setup
    onGameStart();
    
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

  const resetGame = (onReset: () => void) => {
    setGameId(null);
    setIsHost(false);
    setPlayerName('');
    setGameState('idle');
    setCurrentWeek(1);
    
    // Call the onReset callback to perform any additional reset actions
    onReset();
  };

  return {
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
    toast
  };
}
