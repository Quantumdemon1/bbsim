
import { GamePhaseSetters, GamePhaseState } from '../types';

export function useGameActions(
  state: GamePhaseState,
  setters: GamePhaseSetters
) {
  const { 
    week, hoh, lastHoH
  } = state;
  
  const { 
    setWeek, setPhase, setHoH, setVeto, setVetoUsed, setNominees, 
    setLastHoH, setStatusMessage, setSelectedPlayers
  } = setters;

  const handleNextWeek = () => {
    setWeek(week + 1);
    setPhase('HoH Competition');
    setLastHoH(hoh);
    setHoH(null);
    setVeto(null);
    setVetoUsed(false);
    setNominees([]);
    setStatusMessage(`Week ${week + 1} begins!`);
    setSelectedPlayers([]);
  };

  const handleFinaleSetup = () => {
    console.log('Setting up finale');
    // Setup for finale could be implemented here
  };

  return {
    handleNextWeek,
    handleFinaleSetup
  };
}
