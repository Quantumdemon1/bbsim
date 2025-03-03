
import { GamePhaseState, GamePhaseSetters } from '../../types';

export function useEvictionActions(
  state: GamePhaseState,
  setters: GamePhaseSetters,
  handleEvict: (evictedId: string) => void
) {
  const { setSelectedPlayers } = setters;

  const getActions = () => {
    return {
      handleCastVote: (voterId: string, nomineeId: string) => {
        console.log(`${voterId} votes to evict ${nomineeId}`);
      },
      handleEvict,
      castVote: (data: { nominee: string }) => {
        if (data && data.nominee) {
          // Handle voting
        }
      },
      evict: (data: { evictedId: string }) => {
        if (data && data.evictedId) {
          handleEvict(data.evictedId);
        }
      }
    };
  };

  return getActions;
}
