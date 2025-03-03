
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { PlayerData } from '@/components/PlayerProfileTypes';

export function useGameCore() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [gameState, setGameState] = useState<'idle' | 'lobby' | 'playing' | 'ended'>('idle');
  const [currentWeek, setCurrentWeek] = useState(1);
  const [phaseProgress, setPhaseProgress] = useState<Record<string, boolean>>({});
  const [phaseCountdown, setPhaseCountdown] = useState<number | null>(null);
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
    setPhaseProgress({});
    setPhaseCountdown(null);
    
    // Call the onReset callback to perform any additional reset actions
    onReset();
  };

  // Progress tracking for phases
  const markPhaseProgress = (phaseId: string, playerId: string) => {
    const phaseKey = `${phaseId}-${playerId}`;
    setPhaseProgress(prev => ({
      ...prev,
      [phaseKey]: true
    }));
    
    return true;
  };
  
  const getPhaseProgress = (phase: string, playerIds: string[]) => {
    const playerProgress = playerIds.map(playerId => {
      const phaseKey = `${phase}-${playerId}`;
      return !!phaseProgress[phaseKey];
    });
    
    const completedCount = playerProgress.filter(Boolean).length;
    const totalCount = playerProgress.length;
    
    return {
      completedCount,
      totalCount,
      percentage: totalCount > 0 ? (completedCount / totalCount) * 100 : 0,
      isComplete: completedCount === totalCount,
      hasStartedCountdown: completedCount >= Math.ceil(totalCount / 2)
    };
  };
  
  const startPhaseCountdown = (seconds: number = 30) => {
    setPhaseCountdown(seconds);
    
    const interval = setInterval(() => {
      setPhaseCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  };
  
  const clearPhaseProgress = (phase: string) => {
    const newProgress = { ...phaseProgress };
    
    // Remove all entries for this phase
    Object.keys(newProgress).forEach(key => {
      if (key.startsWith(`${phase}-`)) {
        delete newProgress[key];
      }
    });
    
    setPhaseProgress(newProgress);
    setPhaseCountdown(null);
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
    toast,
    // Phase progress tracking
    phaseProgress,
    phaseCountdown,
    markPhaseProgress,
    getPhaseProgress,
    startPhaseCountdown,
    clearPhaseProgress
  };
}
