
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
      nominate: (data?: any) => {
        const nominees = data?.nominees || [];
        setSelectedPlayers([]);
        return handleNominate();
      },
      handleNominate: (data?: any) => handleNominate(),
      startNominations: (data?: any) => handleNominate()
    };
  };

  return getActions;
}
