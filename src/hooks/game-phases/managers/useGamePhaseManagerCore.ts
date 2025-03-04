
import { GamePhaseProps } from '../types';
import { useGameContext } from '@/hooks/useGameContext';
import { usePhaseHooks } from './usePhaseHooks';
import { usePhaseActionHandler } from '../handlers/usePhaseActionHandler';
import { usePowerupContext } from '@/hooks/gameContext/usePowerupContext';
import { useGameState } from '../useGameState';

export function useGamePhaseManagerCore(props: GamePhaseProps) {
  const { state, setters, toast } = useGameState(props);
  const gameContext = useGameContext();
  
  // Get all phase-specific hooks
  const phaseHooks = usePhaseHooks(state, setters, toast);

  // Use the phase action handler to manage actions for different phases
  const handleAction = usePhaseActionHandler(
    state,
    setters,
    phaseHooks.nominationPhase.handleNominate,
    phaseHooks.hohPhase.handleSelectHoH,
    phaseHooks.povPhase.handleSelectVeto,
    phaseHooks.vetoPhase.handleVetoAction,
    phaseHooks.evictionPhase.handleEvict,
    phaseHooks.juryQuestionsPhase.handleJuryQuestions,
    phaseHooks.juryQuestionsPhase.handleProceedToVoting,
    // Create a fallback for handleNextWeek if it doesn't exist in gameContext
    () => {
      console.log("Advancing to next week");
      setters.setWeek(state.week + 1);
      setters.setPhase('HoH Competition');
    }
  );

  // Create a player select handler if not available in gameContext
  const handlePlayerSelect = (playerId: string) => {
    const currentSelected = [...state.selectedPlayers];
    const index = currentSelected.indexOf(playerId);
    
    if (index >= 0) {
      // Player is already selected, deselect them
      currentSelected.splice(index, 1);
    } else {
      // Player is not selected, select them
      currentSelected.push(playerId);
    }
    
    setters.setSelectedPlayers(currentSelected);
  };

  return {
    state,
    setters,
    handleAction,
    handlePlayerSelect: gameContext.handlePlayerSelect || handlePlayerSelect,
    usePowerup: gameContext.usePowerup || (() => console.warn("Powerup functionality not available")),
    phaseHooks
  };
}
