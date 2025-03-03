
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { GamePhaseProps, GamePhaseState, GamePhaseSetters } from '../types';
import { usePlayerUtilities } from '../utilities/usePlayerUtilities';
import { useGameActions } from '../actions/useGameActions';
import { usePhaseActionHandler } from '../handlers/usePhaseActionHandler';
import { usePhaseManager } from './usePhaseManager';

export function useGamePhaseManagerCore({ 
  players: initialPlayers, 
  week: initialWeek,
  initialPhase = 'HoH Competition'
}: GamePhaseProps) {
  const { toast, state, setters } = usePhaseManager({ 
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

  return {
    state,
    setters,
    toast,
    handlePlayerSelect,
    usePowerup,
    handleNextWeek
  };
}
