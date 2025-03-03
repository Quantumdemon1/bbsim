import { UseNominationPhaseResult, UseVetoPhaseResult } from '../types';

interface PhaseRouterProps {
  hohPhase: {
    handleSelectHoH: () => void;
  };
  nominationPhase: UseNominationPhaseResult;
  povPhase: {
    handleSelectVeto: () => void;
  };
  vetoPhase: UseVetoPhaseResult;
  evictionPhase: {
    handleCastVote: (voterId: string, nomineeId: string) => void;
    handleEvict: () => void;
  };
  specialCompPhase: {
    handleSpecialCompetition: (competitionType: string) => void;
  };
  finaleManager: {
    setupFinale: () => void;
  };
  juryQuestionsPhase: {
    handleQuestion: (jurorId: string, finalistId: string, question: string) => void;
  };
  juryVotingPhase: {
    handleJuryVote: (jurorId: string, finalistId: string) => void;
  };
  gameActions: {
    advanceWeek: () => void;
    finishGame: () => void;
  };
  weekSummaries: any[];
  setWeekSummaries: (summary: any[]) => void;
  week: number;
  nominees: string[];
  hoh: string | null;
  veto: string | null;
  vetoUsed: boolean;
  selectedPlayers: string[];
  setPhase: (phase: string) => void;
}

export function usePhaseRouter({
  hohPhase,
  nominationPhase,
  povPhase,
  vetoPhase,
  evictionPhase,
  specialCompPhase,
  finaleManager,
  juryQuestionsPhase,
  juryVotingPhase,
  gameActions,
  weekSummaries,
  setWeekSummaries,
  week,
  nominees,
  hoh,
  veto,
  vetoUsed,
  selectedPlayers,
  setPhase
}: PhaseRouterProps) {

  const handleAction = (action: string, data?: any) => {
    switch (action) {
      case 'selectHoH':
        hohPhase.handleSelectHoH();
        break;
      case 'nominate':
        nominationPhase.handleNominate();
        break;
      case 'selectVeto':
        povPhase.handleSelectVeto();
        break;
      case 'castVote':
        evictionPhase.handleCastVote(data.voterId, data.nomineeId);
        break;
      case 'evict':
        evictionPhase.handleEvict();
        break;
      case 'specialCompetition':
        specialCompPhase.handleSpecialCompetition(data.competitionType);
        break;
      case 'juryQuestion':
        juryQuestionsPhase.handleQuestion(data.jurorId, data.finalistId, data.question);
        break;
      case 'juryVote':
        juryVotingPhase.handleJuryVote(data.jurorId, data.finalistId);
        break;
      case 'advanceWeek':
        gameActions.advanceWeek();
        break;
      case 'finishGame':
        gameActions.finishGame();
        break;
      default:
        console.warn(`Unhandled action: ${action}`);
    }
  }

  return {
    handleAction
  };
}
