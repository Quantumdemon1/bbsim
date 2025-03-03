
import { useState } from 'react';
import { GamePhaseState, GamePhaseSetters } from '../types';
import { usePhaseActionRouter } from './usePhaseActionRouter';

export function usePhaseActionHandler(
  state: GamePhaseState,
  setters: GamePhaseSetters,
  handleNominate: () => void,
  handleSelectHoH: () => void,
  handleSelectVeto: () => void,
  handleVetoAction: (action: string) => void,
  handleEvict: (evictedId: string) => void,
  handleJuryQuestions: () => void,
  handleProceedToVoting: () => void,
  handleNextWeek: () => void,
) {
  const { 
    phase, players
  } = state;
  
  const { 
    setSelectedPlayers
  } = setters;

  // Get all phase-specific action handlers
  const { 
    getNominationActions, 
    getVetoActions, 
    getEvictionActions,
    getJuryActions,
    getSummaryActions,
    getCompetitionActions
  } = usePhaseActionRouter(state, setters, {
    handleNominate,
    handleSelectHoH,
    handleSelectVeto,
    handleVetoAction,
    handleEvict,
    handleJuryQuestions,
    handleProceedToVoting,
    handleNextWeek
  });

  const getPlayerName = (playerId: string | null) => {
    if (!playerId) return 'Unknown';
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown';
  };

  function handlePhaseAction(action: string, data?: any) {
    console.log(`Handling action: ${action} in phase: ${phase}`);
    
    // Route actions based on current phase
    switch (phase) {
      case 'Nomination Ceremony':
        return getNominationActions();
      case 'Veto Ceremony':
        return getVetoActions();
      case 'Eviction Voting':
        return getEvictionActions();
      case 'Jury Questions':
        return getJuryActions();
      case 'Weekly Summary':
        return getSummaryActions();
      default:
        // Handle generic actions based on action type
        switch (action) {
          case 'startHoH':
          case 'selectHoH':
          case 'startPoV':
          case 'selectVeto':
            return getCompetitionActions()[action]();
          case 'startNominations':
          case 'nominate':
            return getNominationActions()[action]();
          case 'startVetoCeremony':
          case 'useVeto':
          case 'replaceNominee':
          case 'doNotUseVeto':
            return getVetoActions()[action]();
          case 'startEvictionVoting':
          case 'castVote':
          case 'finalizeVotes':
          case 'evict':
            if (action === 'evict' && data && data.evictedId) {
              handleEvict(data.evictedId);
            }
            break;
          case 'nextWeek':
            handleNextWeek();
            break;
          case 'showPlacements':
            setters.setPhase('Placements');
            break;
          default:
            console.log(`Unknown action: ${action}`);
        }
    }
  }

  return handlePhaseAction;
}
