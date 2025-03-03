
import { useGameContext } from '@/contexts/GameContext';
import { usePlayerSelection } from './usePlayerSelection';
import { useHoHPhase } from './useHoHPhase';
import { useNominationPhase } from './useNominationPhase';
import { usePoVPhase } from './usePoVPhase';
import { useVetoPhase } from './useVetoPhase';
import { useEvictionPhase } from './useEvictionPhase';
import { useSpecialCompetitionPhase } from './useSpecialCompetitionPhase';
import { useJuryQuestionsPhase } from './useJuryQuestionsPhase';
import { useJuryVotingPhase } from './useJuryVotingPhase';
import { useFinaleManager } from './useFinaleManager';
import { useGameState } from './useGameState';
import { GamePhaseProps } from './types';
import { useActionManager } from './managers/useActionManager';
import { usePhaseRouter } from './managers/usePhaseRouter';

/**
 * Main hook for managing all game phases and their interactions
 * Updated to more closely match the real Big Brother format
 */
export function useGamePhaseManager({ 
  players: initialPlayers, 
  week: initialWeek,
  initialPhase = 'HoH Competition'
}: GamePhaseProps) {
  const { usePowerup } = useGameContext();
  
  // Use the game state hook to manage all our state
  const { state, setters, toast } = useGameState({ 
    players: initialPlayers, 
    week: initialWeek,
    initialPhase
  });

  // Import the player selection logic
  const playerSelection = usePlayerSelection({
    selectedPlayers: state.selectedPlayers,
    setSelectedPlayers: setters.setSelectedPlayers,
    phase: state.phase
  });

  // Import the game actions logic
  const gameActions = useActionManager({
    state,
    setters,
    usePowerup,
    toast
  });

  // Import finale manager
  const finaleManager = useFinaleManager({
    players: state.players,
    setFinalists: setters.setFinalists,
    setJurors: setters.setJurors,
    toast
  });

  // Import the phase-specific logic
  const hohPhase = useHoHPhase({
    players: state.players,
    setPlayers: setters.setPlayers,
    selectedPlayers: state.selectedPlayers,
    setHoH: setters.setHoH,
    setStatusMessage: setters.setStatusMessage,
    setPhase: setters.setPhase,
    setSelectedPlayers: setters.setSelectedPlayers,
    lastHoH: state.lastHoH,
    setLastHoH: setters.setLastHoH,
    toast
  });

  const nominationPhase = useNominationPhase({
    players: state.players,
    setPlayers: setters.setPlayers,
    selectedPlayers: state.selectedPlayers,
    setNominees: setters.setNominees,
    hoh: state.hoh,
    setStatusMessage: setters.setStatusMessage,
    setPhase: setters.setPhase,
    setSelectedPlayers: setters.setSelectedPlayers,
    usePowerup,
    toast
  });

  const povPhase = usePoVPhase({
    players: state.players,
    setPlayers: setters.setPlayers,
    selectedPlayers: state.selectedPlayers,
    setVeto: setters.setVeto,
    setStatusMessage: setters.setStatusMessage,
    setPhase: setters.setPhase,
    setSelectedPlayers: setters.setSelectedPlayers,
    hoh: state.hoh,
    nominees: state.nominees,
    setVetoUsed: setters.setVetoUsed,
    toast
  });

  const vetoPhase = useVetoPhase({
    players: state.players,
    setPlayers: setters.setPlayers,
    nominees: state.nominees,
    setNominees: setters.setNominees,
    veto: state.veto,
    hoh: state.hoh,
    setStatusMessage: setters.setStatusMessage,
    setPhase: setters.setPhase,
    setSelectedPlayers: setters.setSelectedPlayers,
    usePowerup,
    setVetoUsed: setters.setVetoUsed,
    toast
  });

  const evictionPhase = useEvictionPhase({
    players: state.players,
    setPlayers: setters.setPlayers,
    nominees: state.nominees,
    setSelectedPlayers: setters.setSelectedPlayers,
    setStatusMessage: setters.setStatusMessage,
    setPhase: setters.setPhase,
    usePowerup,
    toast
  });

  const specialCompPhase = useSpecialCompetitionPhase({
    players: state.players,
    setPlayers: setters.setPlayers,
    selectedPlayers: state.selectedPlayers,
    week: state.week,
    setWeek: setters.setWeek,
    setPhase: setters.setPhase,
    setSelectedPlayers: setters.setSelectedPlayers,
    setStatusMessage: setters.setStatusMessage,
    toast
  });
  
  const juryQuestionsPhase = useJuryQuestionsPhase({
    players: state.players,
    setPlayers: setters.setPlayers,
    finalists: state.finalists,
    setFinalists: setters.setFinalists,
    jurors: state.jurors,
    setJurors: setters.setJurors,
    setStatusMessage: setters.setStatusMessage,
    setPhase: setters.setPhase,
    setSelectedPlayers: setters.setSelectedPlayers,
    toast
  });

  const juryVotingPhase = useJuryVotingPhase({
    players: state.players,
    setPlayers: setters.setPlayers,
    finalists: state.finalists,
    votes: state.votes,
    setVotes: setters.setVotes,
    setStatusMessage: setters.setStatusMessage,
    setPhase: setters.setPhase,
    setSelectedPlayers: setters.setSelectedPlayers,
    toast
  });

  // Create the phase router to handle actions
  const phaseRouter = usePhaseRouter({
    hohPhase,
    nominationPhase,
    povPhase,
    vetoPhase,
    evictionPhase,
    specialCompPhase,
    finaleManager,
    juryQuestionsPhase,
    juryVotingPhase,
    gameActions,
    weekSummaries: state.weekSummaries,
    setWeekSummaries: setters.setWeekSummaries,
    week: state.week,
    nominees: state.nominees,
    hoh: state.hoh,
    veto: state.veto,
    vetoUsed: state.vetoUsed,
    selectedPlayers: state.selectedPlayers,
    setPhase: setters.setPhase
  });

  return {
    ...state,
    handlePlayerSelect: playerSelection.handlePlayerSelect,
    handleAction: phaseRouter.handleAction,
    setWeek: setters.setWeek,
    setPhase: setters.setPhase
  };
}
