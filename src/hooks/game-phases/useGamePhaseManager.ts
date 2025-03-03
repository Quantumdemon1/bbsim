
import { useGameState } from './useGameState';
import { toast } from '@/hooks/use-toast';
import { useHoHPhase } from './useHoHPhase';
import { useNominationPhase } from './useNominationPhase';
import { usePoVPhase } from './usePoVPhase';
import { useVetoPhase } from './useVetoPhase';
import { useEvictionPhase } from './useEvictionPhase';
import { useJuryQuestionsPhase } from './useJuryQuestionsPhase';
import { useJuryVotingPhase } from './useJuryVotingPhase';
import { useSpecialCompetitionPhase } from './useSpecialCompetitionPhase';
import { GamePhaseProps } from './types';
import { usePlayerUtilities } from './utilities/usePlayerUtilities';
import { useGameActions } from './actions/useGameActions';
import { usePhaseActionHandler } from './handlers/usePhaseActionHandler';

export function useGamePhaseManager({ 
  players: initialPlayers, 
  week: initialWeek,
  initialPhase = 'HoH Competition'
}: GamePhaseProps) {
  const { state, setters, toast: toastFn } = useGameState({ 
    players: initialPlayers, 
    week: initialWeek,
    initialPhase
  });
  
  const { 
    week, phase, players, nominees, hoh, veto, vetoUsed, lastHoH, 
    statusMessage, selectedPlayers, finalists, jurors, votes, weekSummaries
  } = state;
  
  const {
    setWeek, setPlayers, setPhase, setHoH, setVeto, setVetoUsed, setLastHoH,
    setNominees, setSelectedPlayers, setStatusMessage, setFinalists, setJurors,
    setVotes, setWeekSummaries
  } = setters;

  // Player utilities including powerup handling and selection
  const { handlePlayerSelect, usePowerup } = usePlayerUtilities(
    players, 
    phase, 
    selectedPlayers, 
    setSelectedPlayers
  );

  // Game actions for managing weeks and game flow
  const { handleNextWeek } = useGameActions(state, setters);

  // Individual phase hooks with their specific functionality
  const hohPhase = useHoHPhase({
    players,
    week,
    lastHoH,
    setHoH,
    setPhase,
    setStatusMessage,
    toast: toastFn,
    setPlayers,
    selectedPlayers, 
    setSelectedPlayers,
    setLastHoH
  });

  const nominationPhase = useNominationPhase({
    players,
    hoh,
    setNominees,
    setPhase,
    setStatusMessage,
    toast: toastFn,
    setPlayers,
    selectedPlayers,
    setSelectedPlayers,
    usePowerup
  });

  const povPhase = usePoVPhase({
    players,
    nominees,
    hoh,
    setVeto,
    setPhase,
    setStatusMessage,
    toast: toastFn,
    setPlayers,
    selectedPlayers,
    setSelectedPlayers,
    setVetoUsed
  });

  const vetoPhase = useVetoPhase({
    players,
    nominees,
    hoh,
    veto,
    setNominees,
    setPhase,
    setVetoUsed,
    setStatusMessage,
    toast: toastFn,
    setPlayers,
    setSelectedPlayers,
    usePowerup
  });

  const evictionPhase = useEvictionPhase({
    players,
    nominees,
    hoh,
    setPhase,
    setPlayers,
    setStatusMessage,
    toast: toastFn,
    setSelectedPlayers,
    usePowerup
  });

  const specialCompetitionPhase = useSpecialCompetitionPhase({
    players,
    setPhase,
    setStatusMessage,
    toast: toastFn,
    setPlayers,
    selectedPlayers,
    setSelectedPlayers,
    week,
    setWeek
  });

  const juryQuestionsPhase = useJuryQuestionsPhase({
    players,
    jurors: jurors || [],
    finalists: finalists || [],
    setPhase,
    setStatusMessage,
    toast: toastFn,
    setPlayers,
    setSelectedPlayers
  });

  const juryVotingPhase = useJuryVotingPhase({
    players,
    jurors: jurors || [],
    finalists: finalists || [],
    setVotes,
    setPhase,
    setStatusMessage,
    toast: toastFn,
    setPlayers,
    votes: votes || {},
    setSelectedPlayers
  });

  // Use the phase action handler to manage actions for different phases
  const handleAction = usePhaseActionHandler(
    state,
    setters,
    nominationPhase.handleNominate,
    hohPhase.handleSelectHoH,
    povPhase.handleSelectVeto,
    vetoPhase.handleVetoAction,
    evictionPhase.handleEvict,
    juryQuestionsPhase.handleJuryQuestions,
    juryQuestionsPhase.handleProceedToVoting,
    handleNextWeek
  );

  // Return the public API for the game phase manager
  return {
    // State
    week,
    phase,
    players,
    nominees,
    hoh,
    veto,
    vetoUsed,
    lastHoH,
    statusMessage,
    selectedPlayers,
    finalists,
    jurors,
    votes,
    weekSummaries,
    
    // Setters
    setWeek,
    setPhase,
    setHoH,
    setVeto,
    setVetoUsed,
    setLastHoH,
    setNominees,
    setPlayers,
    setSelectedPlayers,
    setStatusMessage,
    setFinalists,
    setJurors,
    setVotes,
    setWeekSummaries,
    
    // Actions
    handleAction,
    handlePlayerSelect
  };
}
