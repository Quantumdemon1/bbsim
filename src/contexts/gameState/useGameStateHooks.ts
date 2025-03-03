
import { useGameCore } from '@/hooks/gameState/useGameCore';
import { useGameModes } from '@/hooks/gameState/useGameModes';
import { useAdminControl } from '@/hooks/gameState/useAdminControl';
import { useChatState } from '@/hooks/gameState/useChatState';
import { usePhaseProgress } from '@/hooks/gameState/usePhaseProgress';
import { usePersistenceManager } from './usePersistenceManager';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface GameStateHooksProps {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
}

export function useGameStateHooks({ players, setPlayers }: GameStateHooksProps) {
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

  return {
    gameCore,
    chatState,
    gameModes,
    phaseProgressTracker,
    adminControl,
    persistenceManager
  };
}
