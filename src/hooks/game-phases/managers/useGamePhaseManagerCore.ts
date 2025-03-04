
import { useGameState } from '../useGameState';
import { useToast } from "@/components/ui/use-toast";
import { GamePhaseProps } from '../types';
import { usePowerupContext } from '@/hooks/gameContext/usePowerupContext';
import { useEffect, useState } from 'react';
import { useGameContext } from '@/hooks/useGameContext';

export function useGamePhaseManagerCore(props: GamePhaseProps) {
  const { state, setters, toast } = useGameState(props);
  const { activePowerups, usePowerup } = usePowerupContext();
  const { isHost, playerName } = useGameContext();
  
  const [isHumanPlayerTurn, setIsHumanPlayerTurn] = useState(false);
  
  // Determine if the current player is the HOH, has veto, or is nominated
  const isHumanHOH = state.players.some(p => p.isHuman && p.id === state.hoh);
  const hasHumanVeto = state.players.some(p => p.isHuman && p.id === state.veto);
  const isHumanNominated = state.players.some(p => p.isHuman && state.nominees.includes(p.id));
  
  // Update human player turn state based on game phase
  useEffect(() => {
    // Check if it's the human player's turn to act based on the current phase
    // and their role in the game
    switch (state.phase) {
      case 'HoH Competition':
        // Everyone competes, so it's always their turn during HoH
        setIsHumanPlayerTurn(true);
        break;
      case 'Nomination Ceremony':
        // Only HoH gets to nominate
        setIsHumanPlayerTurn(isHumanHOH);
        break;
      case 'PoV Competition':
        // Everyone eligible competes in PoV
        setIsHumanPlayerTurn(true);
        break;
      case 'Veto Ceremony':
        // Only veto holder gets to decide
        setIsHumanPlayerTurn(hasHumanVeto);
        break;
      case 'Eviction Voting':
        // Everyone who's not nominated gets to vote
        setIsHumanPlayerTurn(!isHumanNominated);
        break;
      default:
        // Default to true so players can interact
        setIsHumanPlayerTurn(true);
    }
  }, [state.phase, isHumanHOH, hasHumanVeto, isHumanNominated]);
  
  const handlePlayerSelect = (playerId: string) => {
    const isAlreadySelected = state.selectedPlayers.includes(playerId);
    
    if (isAlreadySelected) {
      setters.setSelectedPlayers(state.selectedPlayers.filter(id => id !== playerId));
    } else {
      setters.setSelectedPlayers([...state.selectedPlayers, playerId]);
    }
  };
  
  const handleNextWeek = () => {
    const newWeek = state.week + 1;
    setters.setWeek(newWeek);
    setters.setPhase('HoH Competition');
    setters.setHoH(null);
    setters.setVeto(null);
    setters.setVetoUsed(false);
    setters.setNominees([]);
    setters.setSelectedPlayers([]);
    setters.setStatusMessage(`Week ${newWeek} begins!`);
    
    // Update any week-based game mechanics here
    toast({
      title: 'New Week',
      description: `Week ${newWeek} has begun!`,
    });
  };
  
  return {
    state,
    setters,
    toast,
    handlePlayerSelect,
    usePowerup,
    handleNextWeek,
    isHumanPlayerTurn,
    isHumanHOH,
    hasHumanVeto,
    isHumanNominated
  };
}
