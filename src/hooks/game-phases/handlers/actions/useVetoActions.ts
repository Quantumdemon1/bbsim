
import { GamePhaseState, GamePhaseSetters } from '../../types';

export function useVetoActions(
  state: GamePhaseState, 
  setters: GamePhaseSetters,
  handleVetoAction: (action: string) => void
) {
  const { selectedPlayers } = state;
  const { setSelectedPlayers } = setters;

  const getActions = () => {
    return {
      handleUseVeto: (nomineeId: string) => {
        handleVetoAction('use');
      },
      handleDoNotUseVeto: () => {
        handleVetoAction('doNotUse');
      },
      handleVetoAction,
      startVetoCeremony: () => handleVetoAction('start'),
      useVeto: () => {
        if (selectedPlayers.length === 1) {
          handleVetoAction('use');
          setSelectedPlayers([]);
        }
      },
      doNotUseVeto: () => handleVetoAction('doNotUse')
    };
  };

  return getActions;
}
