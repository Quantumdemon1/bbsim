
import { GamePhaseState, GamePhaseSetters } from '../../types';

export function useSummaryActions(
  state: GamePhaseState,
  setters: GamePhaseSetters,
  handleNextWeek: () => void
) {
  const { setPhase } = setters;

  const getActions = () => {
    return {
      advanceWeek: (data?: any) => {
        handleNextWeek();
      },
      finishGame: (data?: any) => {
        setPhase('Placements');
      },
      handleNextWeek: (data?: any) => handleNextWeek(),
      handleShowPlacements: (data?: any) => setPhase('Placements')
    };
  };

  return getActions;
}
