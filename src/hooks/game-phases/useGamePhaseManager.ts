import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
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
  const { state, setters, toast } = useGameState({ 
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

  // Initialize phase-specific hooks
  const hohPhase = useHoHPhase({
    players,
    week,
    lastHoH,
    setHoH,
    setPhase,
    setStatusMessage,
    toast
  });

  const nominationPhase = useNominationPhase({
    players,
    hoh,
    setNominees,
    setPhase,
    setStatusMessage,
    toast
  });

  const povPhase = usePoVPhase({
    players,
    nominees,
    hoh,
    setVeto,
    setPhase,
    setStatusMessage,
    toast
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
    toast
  });

  const evictionPhase = useEvictionPhase({
    players,
    nominees,
    hoh,
    setPhase,
    setPlayers,
    setStatusMessage,
    toast
  });

  const specialCompetitionPhase = useSpecialCompetitionPhase({
    players,
    setPhase,
    setStatusMessage,
    toast
  });

  const juryQuestionsPhase = useJuryQuestionsPhase({
    players,
    jurors: jurors || [],
    finalists: finalists || [],
    setPhase,
    setStatusMessage,
    toast
  });

  const juryVotingPhase = useJuryVotingPhase({
    players,
    jurors: jurors || [],
    finalists: finalists || [],
    setVotes,
    setPhase,
    setStatusMessage,
    toast
  });

  const finaleManager = useFinaleManager({
    players,
    finalists: finalists || [],
    jurors: jurors || [],
    votes: votes || {},
    setPlayers,
    setPhase,
    setStatusMessage,
    toast
  });

  const playerSelection = usePlayerSelection({
    players,
    selectedPlayers,
    setSelectedPlayers
  });

  const { handleAction } = useGameActions({
    handleAction: handlePhaseAction,
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
          }
        };
      case 'Veto Ceremony':
        return {
          handleUseVeto: (nomineeId: string) => {
            // Logic for using veto
            setVetoUsed(true);
            // Rest of implementation...
          },
          handleDoNotUseVeto: () => {
            setVetoUsed(false);
            setPhase('Eviction Voting');
            setStatusMessage(`${getPlayerName(veto)} has decided NOT to use the Power of Veto.`);
          }
        };
      case 'Eviction Voting':
        return {
          handleCastVote: (voterId: string, nomineeId: string) => {
            // Logic for casting vote
            console.log(`${voterId} votes to evict ${nomineeId}`);
          },
          handleEvict: () => {
            // Logic for finalizing eviction
            setPhase('Eviction');
          }
        };
      case 'Jury Questions':
        return {
          handleQuestion: (jurorId: string, finalistId: string, question: string) => {
            // Logic for jury questions
            console.log(`${jurorId} asks ${finalistId}: ${question}`);
          }
        };
      case 'Weekly Summary':
        return {
          advanceWeek: () => {
            // Logic to move to next week
            setWeek(week + 1);
            setPhase('HoH Competition');
          },
          finishGame: () => {
            // Logic to end the game
            setPhase('Placements');
          }
        };
      default:
        // Handle other actions
        switch (action) {
          case 'startHoH':
            hohPhase.startHoHCompetition();
            break;
          case 'selectHoH':
            if (selectedPlayers.length === 1) {
              hohPhase.selectHoH(selectedPlayers[0]);
              setSelectedPlayers([]);
            }
            break;
          case 'startNominations':
            nominationPhase.startNominations();
            break;
          case 'nominate':
            if (selectedPlayers.length === 2) {
              nominationPhase.nominate(selectedPlayers);
              setSelectedPlayers([]);
            }
            break;
          case 'startPoV':
            povPhase.startPoVCompetition();
            break;
          case 'selectVeto':
            if (selectedPlayers.length === 1) {
              povPhase.selectVetoWinner(selectedPlayers[0]);
              setSelectedPlayers([]);
            }
            break;
          case 'startVetoCeremony':
            vetoPhase.startVetoCeremony();
            break;
          case 'useVeto':
            if (selectedPlayers.length === 1) {
              vetoPhase.useVeto(selectedPlayers[0]);
              setSelectedPlayers([]);
            }
            break;
          case 'replaceNominee':
            if (selectedPlayers.length === 1) {
              vetoPhase.replaceNominee(selectedPlayers[0]);
              setSelectedPlayers([]);
            }
            break;
          case 'doNotUseVeto':
            vetoPhase.doNotUseVeto();
            break;
          case 'startEvictionVoting':
            evictionPhase.startEvictionVoting();
            break;
          case 'castVote':
            if (data && data.nominee) {
              evictionPhase.castVote(data.voter, data.nominee);
            }
            break;
          case 'finalizeVotes':
            evictionPhase.finalizeVotes();
            break;
          case 'evict':
            if (data && data.evictedId) {
              evictionPhase.evict(data.evictedId);
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
    handleAction,
    handlePlayerSelect: playerSelection.handlePlayerSelect
  };
}
