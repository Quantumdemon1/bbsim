
import { GamePhaseState, GamePhaseSetters } from '../../types';

export function useJuryActions(
  state: GamePhaseState,
  setters: GamePhaseSetters,
  handleJuryQuestions: () => void,
  handleProceedToVoting: () => void
) {
  const getActions = () => {
    return {
      handleQuestion: (jurorId: string, finalistId: string, question: string) => {
        console.log(`${jurorId} asks ${finalistId}: ${question}`);
      },
      handleJuryQuestions: (data?: any) => handleJuryQuestions(),
      handleProceedToVoting: (data?: any) => handleProceedToVoting()
    };
  };

  return getActions;
}
