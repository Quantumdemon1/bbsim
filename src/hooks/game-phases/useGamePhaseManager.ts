
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
import { useGameActions } from './useGameActions';
import { useGameState } from './useGameState';
import { useFinaleManager } from './useFinaleManager';
import { GamePhaseProps, WeekSummary } from './types';

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
  const gameActions = useGameActions({
    state,
    setPlayers: setters.setPlayers,
    setWeek: setters.setWeek,
    setPhase: setters.setPhase,
    setHoH: setters.setHoH,
    setVeto: setters.setVeto,
    setNominees: setters.setNominees,
    setSelectedPlayers: setters.setSelectedPlayers,
    setStatusMessage: setters.setStatusMessage,
    setWeekSummaries: setters.setWeekSummaries,
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

  // Main action handler that routes to the appropriate phase handler
  const handleAction = (action: string, data?: any) => {
    switch (action) {
      case 'selectHOH':
        hohPhase.handleSelectHoH();
        break;
        
      case 'nominate':
        nominationPhase.handleNominate();
        break;
        
      case 'selectVeto':
        povPhase.handleSelectVeto();
        break;
        
      case 'vetoAction':
        vetoPhase.handleVetoAction(data);
        break;
        
      case 'evict':
        evictionPhase.handleEvict(data);
        break;
        
      case 'nextWeek':
        // Add current week's summary before moving to next week
        const currentWeekSummary: WeekSummary = {
          weekNumber: state.week,
          hoh: state.hoh,
          nominees: state.nominees,
          vetoPlayers: state.players.filter(p => p.id === state.hoh || p.id === state.veto || state.nominees.includes(p.id)).map(p => p.id),
          vetoWinner: state.veto,
          vetoUsed: false, // This should be updated when veto is used
          finalNominees: state.nominees,
          evicted: state.selectedPlayers[0],
          evictionVotes: "5-2" // Mock voting result
        };
        
        setters.setWeekSummaries([...state.weekSummaries, currentWeekSummary]);
        
        // Now proceed to next week
        gameActions.handleNextWeek();
        break;
        
      case 'specialCompetition':
        specialCompPhase.handleSpecialCompetition();
        break;
        
      case 'setupFinale':
        finaleManager.setupFinale();
        break;
        
      case 'juryQuestions':
        juryQuestionsPhase.handleJuryQuestions();
        break;
        
      case 'proceedToVoting':
        juryQuestionsPhase.handleProceedToVoting();
        break;
        
      case 'juryVote':
        if (data && data.jurorId && data.finalistId) {
          juryVotingPhase.handleJuryVote(data.jurorId, data.finalistId);
        }
        break;
        
      case 'showResults':
        juryVotingPhase.handleShowResults();
        break;
        
      case 'showFinaleStats':
        setters.setPhase('Statistics');
        break;
        
      case 'showPlacements':
        setters.setPhase('Placements');
        break;
        
      case 'reSimulate':
        window.location.reload();
        break;
    }
  };

  return {
    ...state,
    handlePlayerSelect: playerSelection.handlePlayerSelect,
    handleAction,
    setWeek: setters.setWeek,
    setPhase: setters.setPhase
  };
}
