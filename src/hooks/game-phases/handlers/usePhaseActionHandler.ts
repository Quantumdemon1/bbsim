
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
        return getNominationActions()[action]();
      case 'Veto Ceremony':
        return getVetoActions()[action]();
      case 'Eviction Voting':
        return getEvictionActions()[action](data);  // Pass data to eviction actions
      case 'Jury Questions':
        return getJuryActions()[action](data);  // Pass data to jury actions
      case 'Weekly Summary':
        return getSummaryActions()[action]();
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
            return getNominationActions()[action](data);  // Pass data to nomination actions
          case 'startVetoCeremony':
          case 'useVeto':
          case 'replaceNominee':
          case 'doNotUseVeto':
            return getVetoActions()[action](data);  // Pass data to veto actions
          case 'startEvictionVoting':
          case 'castVote':
          case 'finalizeVotes':
          case 'evict':
            if (action === 'evict' && data && data.evictedId) {
              return handleEvict(data.evictedId);
            }
            return getEvictionActions()[action](data);  // Pass data to eviction actions
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
