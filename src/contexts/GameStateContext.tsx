import React, { createContext, useContext, ReactNode, useState } from 'react';
import { usePlayerManagerContext } from './PlayerManagerContext';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useGameCore } from '@/hooks/gameState/useGameCore';
import { useGameModes } from '@/hooks/gameState/useGameModes';
import { useAdminControl } from '@/hooks/gameState/useAdminControl';
import { useChatState } from '@/hooks/gameState/useChatState';

type PhaseProgress = {
  [phase: string]: {
    playersReady: string[];
    completed: boolean;
  }
};

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
  adminTakeControl: (phaseToSkipTo?: string) => void;
  isAdminControl: boolean;
  loginAsAdmin: () => void;
  
  phaseProgress: PhaseProgress;
  phaseCountdown: number | null;
  markPhaseProgress: (phase: string, playerId: string) => void;
  getPhaseProgress: (phase: string) => { playersReady: string[], completed: boolean } | null;
  startPhaseCountdown: (seconds: number) => void;
  clearPhaseProgress: (phase: string) => void;
}

const GameStateContext = createContext<GameStateContextType>({} as GameStateContextType);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const { players, setPlayers } = usePlayerManagerContext();
  
  const [phaseProgress, setPhaseProgress] = useState<PhaseProgress>({});
  const [phaseCountdown, setPhaseCountdown] = useState<number | null>(null);
  const [countdownInterval, setCountdownInterval] = useState<number | null>(null);
  
  const gameCore = useGameCore();
  const chatState = useChatState();
  const adminControl = useAdminControl({ 
    gameState: gameCore.gameState,
    clearPhaseProgress: (phase: string) => clearPhaseProgress(phase)
  });
  
  const markPhaseProgress = (phase: string, playerId: string) => {
    setPhaseProgress(prev => {
      const phaseObj = prev[phase] || { playersReady: [], completed: false };
      
      if (!phaseObj.playersReady.includes(playerId)) {
        const updatedPlayersReady = [...phaseObj.playersReady, playerId];
        
        const isCompleted = gameCore.gameMode === 'singleplayer' || 
                           (updatedPlayersReady.length >= Math.ceil(players.filter(p => p.isHuman).length / 2));
        
        if (isCompleted && gameCore.gameMode === 'multiplayer' && !phaseObj.completed) {
          startPhaseCountdown(30);
        }
        
        return {
          ...prev,
          [phase]: {
            playersReady: updatedPlayersReady,
            completed: isCompleted
          }
        };
      }
      
      return prev;
    });
  };
  
  const getPhaseProgress = (phase: string) => {
    return phaseProgress[phase] || null;
  };
  
  const clearPhaseProgress = (phase: string) => {
    if (countdownInterval) {
      window.clearInterval(countdownInterval);
      setCountdownInterval(null);
    }
    setPhaseCountdown(null);
    
    if (phase === '*') {
      setPhaseProgress({});
      return;
    }
    
    setPhaseProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[phase];
      return newProgress;
    });
  };
  
  const startPhaseCountdown = (seconds: number) => {
    if (countdownInterval) {
      window.clearInterval(countdownInterval);
    }
    
    setPhaseCountdown(seconds);
    
    const interval = window.setInterval(() => {
      setPhaseCountdown(prev => {
        if (prev === null || prev <= 1) {
          window.clearInterval(interval);
          setCountdownInterval(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    setCountdownInterval(interval);
  };

  const handleGameStart = () => {
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
    
    const updatedPlayers = [...players].map(player => {
      const playerAlliances: string[] = [];
      newAlliances.forEach(alliance => {
        if (alliance.members.includes(player.id)) {
          playerAlliances.push(alliance.name);
        }
      });
      
      const hasPowerup = Math.random() < 0.1;
      const powerupTypes: PlayerData['powerup'][] = ['immunity', 'coup', 'replay', 'nullify'];
      const randomPowerup = hasPowerup ? powerupTypes[Math.floor(Math.random() * powerupTypes.length)] : undefined;
      
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
    chatState.setShowChat(true);
  };

  const handleGameReset = () => {
    setPlayers(players.map(player => ({
      ...player,
      status: undefined,
      alliances: undefined,
      powerup: undefined,
      attributes: undefined,
      relationships: undefined
    })));
    chatState.setShowChat(false);
    clearPhaseProgress('*');
  };

  const gameModes = useGameModes({
    createGame: gameCore.createGame,
    joinGame: gameCore.joinGame,
    startGame: gameCore.startGame
  });

  const startGame = () => {
    gameCore.startGame(handleGameStart);
  };

  const resetGame = () => {
    gameCore.resetGame(handleGameReset);
  };

  return (
    <GameStateContext.Provider
      value={{
        gameId: gameCore.gameId,
        isHost: gameCore.isHost,
        playerName: gameCore.playerName,
        setPlayerName: gameCore.setPlayerName,
        gameState: gameCore.gameState,
        currentWeek: gameCore.currentWeek,
        setCurrentWeek: gameCore.setCurrentWeek,
        createGame: gameCore.createGame,
        joinGame: gameCore.joinGame,
        startGame,
        endGame: gameCore.endGame,
        resetGame,
        
        showChat: chatState.showChat,
        setShowChat: chatState.setShowChat,
        
        gameMode: gameModes.gameMode,
        humanPlayers: gameModes.humanPlayers,
        countdownTimer: gameModes.countdownTimer,
        createSinglePlayerGame: gameModes.createSinglePlayerGame,
        createMultiplayerGame: gameModes.createMultiplayerGame,
        joinMultiplayerGame: gameModes.joinMultiplayerGame,
        
        adminTakeControl: adminControl.adminTakeControl,
        isAdminControl: adminControl.isAdminControl,
        loginAsAdmin: adminControl.loginAsAdmin,
        
        phaseProgress,
        phaseCountdown,
        markPhaseProgress,
        getPhaseProgress,
        startPhaseCountdown,
        clearPhaseProgress
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
