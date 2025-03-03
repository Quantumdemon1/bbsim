
import React, { createContext, useContext, ReactNode } from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { usePlayerManagerContext } from '../PlayerManagerContext';
import { useGameCore } from '@/hooks/gameState/useGameCore';
import { useGameModes } from '@/hooks/gameState/useGameModes';
import { useAdminControl } from '@/hooks/gameState/useAdminControl';
import { useChatState } from '@/hooks/gameState/useChatState';
import { usePhaseProgress } from '@/hooks/gameState/usePhaseProgress';
import { usePersistenceManager } from './usePersistenceManager';
import { GameStateContextType } from './types';

const GameStateContext = createContext<GameStateContextType>({} as GameStateContextType);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const { players, setPlayers } = usePlayerManagerContext();
  
  const gameCore = useGameCore();
  const chatState = useChatState();
  const gameModes = useGameModes({
    createGame: gameCore.createGame,
    joinGame: gameCore.joinGame,
    startGame: gameCore.startGame
  });
  
  const phaseProgressTracker = usePhaseProgress({
    gameMode: gameModes.gameMode,
    humanPlayerCount: players.filter(p => p.isAdmin || p.isHuman).length
  });
  
  const adminControl = useAdminControl({ 
    gameState: gameCore.gameState,
    clearPhaseProgress: phaseProgressTracker.clearPhaseProgress
  });
  
  const persistenceManager = usePersistenceManager({
    gameId: gameCore.gameId,
    gameState: gameCore.gameState,
    currentWeek: gameCore.currentWeek,
    players,
    phaseProgress: phaseProgressTracker.phaseProgress
  });

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
    
    persistenceManager.saveCurrentGame();
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
    phaseProgressTracker.clearPhaseProgress('*');
  };

  const startGame = () => {
    gameCore.startGame(handleGameStart);
  };

  const resetGame = () => {
    gameCore.resetGame(handleGameReset);
  };

  const loadGame = async (gameId: string) => {
    const loadedState = await persistenceManager.loadGame(gameId);
    
    if (loadedState) {
      gameCore.joinGame(loadedState.gameId, gameCore.playerName || 'Player');
      gameCore.setCurrentWeek(loadedState.week);
      gameCore.startGame(() => {
        setPlayers(loadedState.players);
        chatState.setShowChat(true);
        
        phaseProgressTracker.clearPhaseProgress('*');
      });
      
      return true;
    }
    
    return false;
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
        
        phaseProgress: phaseProgressTracker.phaseProgress,
        phaseCountdown: phaseProgressTracker.phaseCountdown,
        markPhaseProgress: phaseProgressTracker.markPhaseProgress,
        getPhaseProgress: phaseProgressTracker.getPhaseProgress,
        startPhaseCountdown: phaseProgressTracker.startPhaseCountdown,
        clearPhaseProgress: phaseProgressTracker.clearPhaseProgress,
        
        saveCurrentGame: persistenceManager.saveCurrentGame,
        loadGame,
        savedGames: persistenceManager.savedGames,
        deleteSavedGame: persistenceManager.deleteSavedGame,
        isLoadingSave: persistenceManager.isLoadingSave
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
