
import { useGameState } from '../useGameState';
import { GamePhaseProps } from '../types';

export function usePhaseManager({ 
  players: initialPlayers, 
  week: initialWeek,
  initialPhase = 'HoH Competition'
}: GamePhaseProps) {
  const { state, setters, toast } = useGameState({ 
    players: initialPlayers, 
    week: initialWeek,
    initialPhase
  });
  
  return {
    state,
    setters,
    toast
  };
}
