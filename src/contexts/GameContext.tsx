
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
}

const GameContext = createContext<GameContextType | undefined>(undefined);

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
    setGameState('playing');
    setCurrentWeek(1);
    
    toast({
      title: "Game Started",
      description: "The Big Brother season has begun!",
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
      status: undefined
    })));
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
        setCurrentWeek
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
