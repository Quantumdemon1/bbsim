
import { GamePhaseProps } from './types';
import { useGamePhaseManagerCore } from './managers/useGamePhaseManagerCore';
import { usePhaseHooks } from './managers/usePhaseHooks';
import { usePhaseActionHandler } from './handlers/usePhaseActionHandler';

export function useGamePhaseManager(props: GamePhaseProps) {
  // Get the core state and utilities
  const {
    state,
    setters,
    toast,
    handlePlayerSelect,
    usePowerup,
    handleNextWeek
  } = useGamePhaseManagerCore(props);

  // Get all phase-specific hooks
  const {
    hohPhase,
    nominationPhase,
    povPhase,
    vetoPhase,
    evictionPhase,
    specialCompetitionPhase,
    juryQuestionsPhase,
    juryVotingPhase
  } = usePhaseHooks(state, setters, toast);

  // Inject the usePowerup function into phase hooks that need it
  const enhancedNominationPhase = {
    ...nominationPhase,
    handleNominate: () => {
      // Creating a version with the actual usePowerup function
      const enhancedNominationContext = {
        ...nominationPhase,
        usePowerup
      };
      return enhancedNominationContext.handleNominate();
    }
  };

  const enhancedVetoPhase = {
    ...vetoPhase,
    handleVetoAction: (action: string) => {
      const enhancedVetoContext = {
        ...vetoPhase,
        usePowerup
      };
      return enhancedVetoContext.handleVetoAction(action);
    }
  };

  const enhancedEvictionPhase = {
    ...evictionPhase,
    handleEvict: (evictedId: string) => {
      const enhancedEvictionContext = {
        ...evictionPhase,
        usePowerup
      };
      return enhancedEvictionContext.handleEvict(evictedId);
    }
  };

  // Use the phase action handler to manage actions for different phases
  const handleAction = usePhaseActionHandler(
    state,
    setters,
    enhancedNominationPhase.handleNominate,
    hohPhase.handleSelectHoH,
    povPhase.handleSelectVeto,
    enhancedVetoPhase.handleVetoAction,
    enhancedEvictionPhase.handleEvict,
    juryQuestionsPhase.handleJuryQuestions,
    juryQuestionsPhase.handleProceedToVoting,
    handleNextWeek
  );

  // Return the public API for the game phase manager - same structure as before
  return {
    // State
    week: state.week,
    phase: state.phase,
    players: state.players,
    nominees: state.nominees,
    hoh: state.hoh,
    veto: state.veto,
    vetoUsed: state.vetoUsed,
    lastHoH: state.lastHoH,
    statusMessage: state.statusMessage,
    selectedPlayers: state.selectedPlayers,
    finalists: state.finalists,
    jurors: state.jurors,
    votes: state.votes,
    weekSummaries: state.weekSummaries,
    
    // Setters
    setWeek: setters.setWeek,
    setPhase: setters.setPhase,
    setHoH: setters.setHoH,
    setVeto: setters.setVeto,
    setVetoUsed: setters.setVetoUsed,
    setLastHoH: setters.setLastHoH,
    setNominees: setters.setNominees,
    setPlayers: setters.setPlayers,
    setSelectedPlayers: setters.setSelectedPlayers,
    setStatusMessage: setters.setStatusMessage,
    setFinalists: setters.setFinalists,
    setJurors: setters.setJurors,
    setVotes: setters.setVotes,
    setWeekSummaries: setters.setWeekSummaries,
    
    // Actions
    handleAction,
    handlePlayerSelect
  };
}
