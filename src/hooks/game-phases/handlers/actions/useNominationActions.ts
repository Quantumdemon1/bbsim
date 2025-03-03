
import { GamePhaseState, GamePhaseSetters } from '../../types';

export function useNominationActions(
  state: GamePhaseState,
  setters: GamePhaseSetters,
  handleNominate: () => void
) {
  const { selectedPlayers } = state;
  const { setSelectedPlayers } = setters;

  const getActions = () => {
    return {
      nominate: (nominees: string[]) => {
        setSelectedPlayers([]);
        return handleNominate();
      },
      handleNominate,
      startNominations: () => handleNominate()
    };
  };

  return getActions;
}
