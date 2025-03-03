
import { useState, useEffect } from 'react';
import { useToast, Toast } from "@/components/ui/use-toast";
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useGameState } from './useGameState';
import { GamePhaseProps } from './types';
import { useHoHPhase } from './useHoHPhase';
import { useNominationPhase } from './useNominationPhase';
import { usePoVPhase } from './usePoVPhase';
import { useVetoPhase } from './useVetoPhase';
import { useEvictionPhase } from './useEvictionPhase';
import { useSpecialCompetitionPhase } from './useSpecialCompetitionPhase';
import { useJuryQuestionsPhase } from './useJuryQuestionsPhase';
import { useJuryVotingPhase } from './useJuryVotingPhase';
import { useFinaleManager } from './useFinaleManager';
import { usePlayerSelection } from './usePlayerSelection';
import { useGameActions } from './useGameActions';

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

  // Mock usePowerup function until integrated
  const usePowerup = (playerId: string) => {
    console.log(`Using powerup for player: ${playerId}`);
    setPlayers(players.map(p => 
      p.id === playerId ? { ...p, powerup: undefined } : p
    ));
  };

  // Initialize phase-specific hooks
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

  const finaleManager = useFinaleManager({
    players,
    setFinalists,
    setJurors,
    toast: toastFn
  });

  const playerSelection = usePlayerSelection({
    players,
    selectedPlayers,
    setSelectedPlayers,
    phase
  });

  const gameActions = useGameActions({
    state,
    setPlayers,
    setWeek,
    setPhase,
    setHoH,
    setVeto,
    setNominees,
    setSelectedPlayers,
    setStatusMessage,
    setWeekSummaries,
    usePowerup,
    toast: toastFn,
    handleAction: () => {},  // Placeholder to satisfy type
    statusMessage,
    selectedPlayers,
    handlePlayerSelect: playerSelection.handlePlayerSelect
  });

  // Helper function to get player name by ID
  const getPlayerName = (playerId: string | null) => {
    if (!playerId) return 'Unknown';
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown';
  };

  // Handle actions based on the current phase
  function handlePhaseAction(action: string, data?: any) {
    console.log(`Handling action: ${action} in phase: ${phase}`);
    
    // Return appropriate hooks based on the current phase
    switch (phase) {
      case 'Nomination Ceremony':
        return {
          nominate: (nominees: string[]) => {
            setNominees(nominees);
            setPhase('PoV Competition');
            setStatusMessage(`${getPlayerName(hoh)} has nominated ${nominees.map(id => getPlayerName(id)).join(' and ')} for eviction.`);
          },
          handleNominate: nominationPhase.handleNominate
        };
      case 'Veto Ceremony':
        return {
          handleUseVeto: (nomineeId: string) => {
            vetoPhase.handleVetoAction('use');
          },
          handleDoNotUseVeto: () => {
            vetoPhase.handleVetoAction('doNotUse');
          },
          handleVetoAction: vetoPhase.handleVetoAction
        };
      case 'Eviction Voting':
        return {
          handleCastVote: (voterId: string, nomineeId: string) => {
            console.log(`${voterId} votes to evict ${nomineeId}`);
          },
          handleEvict: (evictedId: string) => {
            evictionPhase.handleEvict(evictedId);
          }
        };
      case 'Jury Questions':
        return {
          handleQuestion: (jurorId: string, finalistId: string, question: string) => {
            console.log(`${jurorId} asks ${finalistId}: ${question}`);
          },
          handleJuryQuestions: juryQuestionsPhase.handleJuryQuestions,
          handleProceedToVoting: juryQuestionsPhase.handleProceedToVoting
        };
      case 'Weekly Summary':
        return {
          advanceWeek: () => {
            gameActions.handleNextWeek();
          },
          finishGame: () => {
            setPhase('Placements');
          },
          handleNextWeek: gameActions.handleNextWeek,
          handleShowPlacements: () => setPhase('Placements')
        };
      default:
        // Handle other actions
        switch (action) {
          case 'startHoH':
            hohPhase.handleSelectHoH();
            break;
          case 'selectHoH':
            if (selectedPlayers.length === 1) {
              hohPhase.handleSelectHoH();
              setSelectedPlayers([]);
            }
            break;
          case 'startNominations':
            nominationPhase.handleNominate();
            break;
          case 'nominate':
            if (selectedPlayers.length === 2) {
              nominationPhase.handleNominate();
              setSelectedPlayers([]);
            }
            break;
          case 'startPoV':
            povPhase.handleSelectVeto();
            break;
          case 'selectVeto':
            if (selectedPlayers.length === 1) {
              povPhase.handleSelectVeto();
              setSelectedPlayers([]);
            }
            break;
          case 'startVetoCeremony':
            vetoPhase.handleVetoAction('start');
            break;
          case 'useVeto':
            if (selectedPlayers.length === 1) {
              vetoPhase.handleVetoAction('use');
              setSelectedPlayers([]);
            }
            break;
          case 'replaceNominee':
            if (selectedPlayers.length === 1) {
              // Implement this
              setSelectedPlayers([]);
            }
            break;
          case 'doNotUseVeto':
            vetoPhase.handleVetoAction('doNotUse');
            break;
          case 'startEvictionVoting':
            // Implement this
            break;
          case 'castVote':
            if (data && data.nominee) {
              // Implement this
            }
            break;
          case 'finalizeVotes':
            // Implement this
            break;
          case 'evict':
            if (data && data.evictedId) {
              evictionPhase.handleEvict(data.evictedId);
            }
            break;
          case 'nextWeek':
            setWeek(week + 1);
            setPhase('HoH Competition');
            setLastHoH(hoh);
            setHoH(null);
            setVeto(null);
            setVetoUsed(false);
            setNominees([]);
            setStatusMessage(`Week ${week + 1} begins!`);
            break;
          case 'showPlacements':
            setPhase('Placements');
            break;
          default:
            console.log(`Unknown action: ${action}`);
        }
    }
  }

  return {
    // Game state
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
    handleAction: handlePhaseAction,
    handlePlayerSelect: playerSelection.handlePlayerSelect
  };
}
