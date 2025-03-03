
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
      castVote: (data: { nominee: string } | undefined = undefined) => {
        if (data && data.nominee) {
          // Handle voting
          console.log(`Casting vote for nominee: ${data.nominee}`);
        }
      },
      evict: (data: { evictedId: string } | undefined = undefined) => {
        if (data && data.evictedId) {
          handleEvict(data.evictedId);
        } else {
          console.error("Eviction attempted without specifying player ID");
        }
      }
    };
  };

  return getActions;
}
