
import { useState } from 'react';
import { GamePhaseState, GamePhaseSetters } from '../types';

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
    phase, hoh, nominees, players, selectedPlayers, 
  } = state;
  
  const { 
    setPhase, setNominees, setStatusMessage, setSelectedPlayers
  } = setters;

  const getPlayerName = (playerId: string | null) => {
    if (!playerId) return 'Unknown';
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown';
  };

  function handlePhaseAction(action: string, data?: any) {
    console.log(`Handling action: ${action} in phase: ${phase}`);
    
    switch (phase) {
      case 'Nomination Ceremony':
        return {
          nominate: (nominees: string[]) => {
            setNominees(nominees);
            setPhase('PoV Competition');
            setStatusMessage(`${getPlayerName(hoh)} has nominated ${nominees.map(id => getPlayerName(id)).join(' and ')} for eviction.`);
          },
          handleNominate
        };
      case 'Veto Ceremony':
        return {
          handleUseVeto: (nomineeId: string) => {
            handleVetoAction('use');
          },
          handleDoNotUseVeto: () => {
            handleVetoAction('doNotUse');
          },
          handleVetoAction
        };
      case 'Eviction Voting':
        return {
          handleCastVote: (voterId: string, nomineeId: string) => {
            console.log(`${voterId} votes to evict ${nomineeId}`);
          },
          handleEvict
        };
      case 'Jury Questions':
        return {
          handleQuestion: (jurorId: string, finalistId: string, question: string) => {
            console.log(`${jurorId} asks ${finalistId}: ${question}`);
          },
          handleJuryQuestions,
          handleProceedToVoting
        };
      case 'Weekly Summary':
        return {
          advanceWeek: () => {
            handleNextWeek();
          },
          finishGame: () => {
            setPhase('Placements');
          },
          handleNextWeek,
          handleShowPlacements: () => setPhase('Placements')
        };
      default:
        switch (action) {
          case 'startHoH':
            handleSelectHoH();
            break;
          case 'selectHoH':
            if (selectedPlayers.length === 1) {
              handleSelectHoH();
              setSelectedPlayers([]);
            }
            break;
          case 'startNominations':
            handleNominate();
            break;
          case 'nominate':
            if (selectedPlayers.length === 2) {
              handleNominate();
              setSelectedPlayers([]);
            }
            break;
          case 'startPoV':
            handleSelectVeto();
            break;
          case 'selectVeto':
            if (selectedPlayers.length === 1) {
              handleSelectVeto();
              setSelectedPlayers([]);
            }
            break;
          case 'startVetoCeremony':
            handleVetoAction('start');
            break;
          case 'useVeto':
            if (selectedPlayers.length === 1) {
              handleVetoAction('use');
              setSelectedPlayers([]);
            }
            break;
          case 'replaceNominee':
            if (selectedPlayers.length === 1) {
              setSelectedPlayers([]);
            }
            break;
          case 'doNotUseVeto':
            handleVetoAction('doNotUse');
            break;
          case 'startEvictionVoting':
            break;
          case 'castVote':
            if (data && data.nominee) {
            }
            break;
          case 'finalizeVotes':
            break;
          case 'evict':
            if (data && data.evictedId) {
              handleEvict(data.evictedId);
            }
            break;
          case 'nextWeek':
            handleNextWeek();
            break;
          case 'showPlacements':
            setPhase('Placements');
            break;
          default:
            console.log(`Unknown action: ${action}`);
        }
    }
  }

  return handlePhaseAction;
}
