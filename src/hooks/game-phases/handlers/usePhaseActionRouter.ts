
import { GamePhaseState, GamePhaseSetters } from '../types';
import { useNominationActions } from './actions/useNominationActions';
import { useVetoActions } from './actions/useVetoActions';
import { useEvictionActions } from './actions/useEvictionActions';
import { useJuryActions } from './actions/useJuryActions';
import { useSummaryActions } from './actions/useSummaryActions';
import { useCompetitionActions } from './actions/useCompetitionActions';

export function usePhaseActionRouter(
  state: GamePhaseState,
  setters: GamePhaseSetters,
  handlers: {
    handleNominate: () => void,
    handleSelectHoH: () => void,
    handleSelectVeto: () => void,
    handleVetoAction: (action: string) => void,
    handleEvict: (evictedId: string) => void,
    handleJuryQuestions: () => void,
    handleProceedToVoting: () => void,
    handleNextWeek: () => void,
  }
) {
  const { phase } = state;
  const { 
    handleNominate, 
    handleSelectHoH, 
    handleSelectVeto, 
    handleVetoAction, 
    handleEvict,
    handleJuryQuestions,
    handleProceedToVoting,
    handleNextWeek
  } = handlers;
  
  // Get action handlers for each phase type
  const getNominationActions = useNominationActions(state, setters, handleNominate);
  const getVetoActions = useVetoActions(state, setters, handleVetoAction);
  const getEvictionActions = useEvictionActions(state, setters, handleEvict);
  const getJuryActions = useJuryActions(state, setters, handleJuryQuestions, handleProceedToVoting);
  const getSummaryActions = useSummaryActions(state, setters, handleNextWeek);
  const getCompetitionActions = useCompetitionActions(state, setters, handleSelectHoH, handleSelectVeto);
  
  return {
    getNominationActions,
    getVetoActions,
    getEvictionActions,
    getJuryActions,
    getSummaryActions,
    getCompetitionActions
  };
}
