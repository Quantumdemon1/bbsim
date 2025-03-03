
import { GamePhaseState, GamePhaseSetters } from '../../types';

export function useSummaryActions(
  state: GamePhaseState,
  setters: GamePhaseSetters,
  handleNextWeek: () => void
) {
  const { setPhase } = setters;

  const getActions = () => {
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
  };

  return getActions;
}
