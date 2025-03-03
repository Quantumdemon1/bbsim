
import { useHoHPhase } from '../useHoHPhase';
import { useNominationPhase } from '../useNominationPhase';
import { usePoVPhase } from '../usePoVPhase';
import { useVetoPhase } from '../useVetoPhase';
import { useEvictionPhase } from '../useEvictionPhase';
import { useJuryQuestionsPhase } from '../useJuryQuestionsPhase';
import { useJuryVotingPhase } from '../useJuryVotingPhase';
import { useSpecialCompetitionPhase } from '../useSpecialCompetitionPhase';
import { GamePhaseState, GamePhaseSetters } from '../types';

export function usePhaseHooks(
  state: GamePhaseState,
  setters: GamePhaseSetters,
  toast: any
) {
  const {
    players, hoh, nominees, veto, week, jurors, finalists, votes, selectedPlayers, lastHoH
  } = state;
  
  const {
    setHoH, setPhase, setStatusMessage, setPlayers, setSelectedPlayers,
    setNominees, setVeto, setVetoUsed, setLastHoH, setWeek, setFinalists, setJurors, setVotes
  } = setters;

  // Individual phase hooks with their specific functionality
  const hohPhase = useHoHPhase({
    players,
    week,
    lastHoH,
    setHoH,
    setPhase,
    setStatusMessage,
    toast,
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
    toast,
    setPlayers,
    selectedPlayers,
    setSelectedPlayers,
    usePowerup: () => {} // This will be replaced in the main hook
  });

  const povPhase = usePoVPhase({
    players,
    nominees,
    hoh,
    setVeto,
    setPhase,
    setStatusMessage,
    toast,
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
    toast,
    setPlayers,
    setSelectedPlayers,
    usePowerup: () => {} // This will be replaced in the main hook
  });

  const evictionPhase = useEvictionPhase({
    players,
    nominees,
    hoh,
    setPhase,
    setPlayers,
    setStatusMessage,
    toast,
    setSelectedPlayers,
    usePowerup: () => {} // This will be replaced in the main hook
  });

  const specialCompetitionPhase = useSpecialCompetitionPhase({
    players,
    setPhase,
    setStatusMessage,
    toast,
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
    toast,
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
    toast,
    setPlayers,
    votes: votes || {},
    setSelectedPlayers
  });

  return {
    hohPhase,
    nominationPhase,
    povPhase,
    vetoPhase,
    evictionPhase,
    specialCompetitionPhase,
    juryQuestionsPhase,
    juryVotingPhase
  };
}
