
import { GamePhaseProps } from '../types';
import { useGameState } from '../useGameState';
import { usePhaseHooks } from './usePhaseHooks';
import { usePhaseActionHandler } from '../handlers/usePhaseActionHandler';
import { usePowerupContext } from '@/hooks/gameContext/usePowerupContext';

export function useGamePhaseManagerCore(props: GamePhaseProps) {
  // Get the core state and utilities
  const {
    state,
    setters,
    toast,
    handlePlayerSelect,
    usePowerup,
    handleNextWeek
  } = useGameState(props);

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
    handleNextWeek
  );

  return {
    state,
    setters,
    handleAction,
    handlePlayerSelect,
    usePowerup,
    phaseHooks
  };
}
