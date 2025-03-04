
import { GamePhaseProps } from './types';
import { useGamePhaseManagerCore } from './managers/useGamePhaseManagerCore';

export function useGamePhaseManager(props: GamePhaseProps) {
  // Get the core functionality
  const {
    state,
    setters,
    handleAction,
    handlePlayerSelect,
    usePowerup,
    phaseHooks
  } = useGamePhaseManagerCore(props);

  // Inject the usePowerup function into phase hooks that need it
  const enhancedNominationPhase = {
    ...phaseHooks.nominationPhase,
    handleNominate: () => {
      const enhancedNominationContext = {
        ...phaseHooks.nominationPhase,
        usePowerup
      };
      return enhancedNominationContext.handleNominate();
    }
  };

  const enhancedVetoPhase = {
    ...phaseHooks.vetoPhase,
    handleVetoAction: (action: string) => {
      const enhancedVetoContext = {
        ...phaseHooks.vetoPhase,
        usePowerup
      };
      return enhancedVetoContext.handleVetoAction(action);
    }
  };

  const enhancedEvictionPhase = {
    ...phaseHooks.evictionPhase,
    handleEvict: (evictedId: string) => {
      const enhancedEvictionContext = {
        ...phaseHooks.evictionPhase,
        usePowerup
      };
      return enhancedEvictionContext.handleEvict(evictedId);
    }
  };

  // Return the public API for the game phase manager
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
