import React, { createContext, useContext, ReactNode } from 'react';
import { usePlayerManagerContext } from '../PlayerManagerContext';
import { useGameStateHooks } from './useGameStateHooks';
import { useGameHandlers } from './useGameHandlers';
import { GameStateContextType } from './types';
import { SinglePhaseProgressInfo } from '@/hooks/gameState/types/phaseProgressTypes';

const GameStateContext = createContext<GameStateContextType>({} as GameStateContextType);

export const GameStateProviderCore = ({ children }: { children: ReactNode }) => {
  const { players, setPlayers } = usePlayerManagerContext();
  
  const {
    gameCore,
    chatState,
    gameModes,
    phaseProgressTracker,
    adminControl,
    persistenceManager
  } = useGameStateHooks({ players, setPlayers });
  
  const { handleGameStart, handleGameReset } = useGameHandlers({
    players,
    setPlayers,
    saveCurrentGame: persistenceManager.saveCurrentGame,
    setShowChat: chatState.setShowChat,
    clearPhaseProgress: phaseProgressTracker.clearPhaseProgress
  });

  const startGame = () => {
    gameCore.startGame(handleGameStart);
  };

  const resetGame = () => {
    gameCore.resetGame(handleGameReset);
  };

  const loadGame = async (gameId: string): Promise<boolean> => {
    const loadSuccess = await persistenceManager.loadGame(gameId);
    
    if (loadSuccess) {
      const savedGame = persistenceManager.savedGames.find(game => game.game_id === gameId);
      
      if (savedGame) {
        gameCore.joinGame(gameId, gameCore.playerName || 'Player');
        gameCore.setCurrentWeek(savedGame.week);
        gameCore.startGame(() => {
          setPlayers(savedGame.players);
          chatState.setShowChat(true);
          
          phaseProgressTracker.clearPhaseProgress('*');
        });
        
        return true;
      }
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

export const useGameStateContextCore = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameStateContext must be used within a GameStateProvider');
  }
  return context;
};
