
import { GamePhaseState, GamePhaseSetters } from '../../types';

export function useCompetitionActions(
  state: GamePhaseState,
  setters: GamePhaseSetters,
  handleSelectHoH: () => void,
  handleSelectVeto: () => void
) {
  const { selectedPlayers } = state;
  const { setSelectedPlayers } = setters;

  const getActions = () => {
    return {
      startHoH: () => handleSelectHoH(),
      selectHoH: () => {
        if (selectedPlayers.length === 1) {
          handleSelectHoH();
          setSelectedPlayers([]);
        }
      },
      startPoV: () => handleSelectVeto(),
      selectVeto: () => {
        if (selectedPlayers.length === 1) {
          handleSelectVeto();
          setSelectedPlayers([]);
        }
      }
    };
  };

  return getActions;
}
