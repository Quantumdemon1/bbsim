
import { HoHPhaseProps, PoVPhaseProps, NominationPhaseProps, VetoPhaseProps, EvictionPhaseProps, SpecialCompetitionPhaseProps, JuryQuestionsProps, JuryVotingProps, WeekSummary } from '../types';

interface PhaseRouterProps {
  hohPhase: {
    handleSelectHoH: () => void;
  };
  nominationPhase: {
    nominate?: (nominees: string[]) => void;
  };
  povPhase: {
    handleSelectVeto: () => void;
    selectVetoPlayers: () => string[];
  };
  vetoPhase: {
    handleUseVeto?: (nomineeId: string) => void;
    handleDoNotUseVeto?: () => void;
  };
  evictionPhase: {
    handleEvict: (evictedId: string) => void;
  };
  specialCompPhase: {
    handleSpecialCompetition?: () => void;
  };
  finaleManager: {
    setupFinale: () => void;
  };
  juryQuestionsPhase: {
    handleJuryQuestions?: () => void;
    handleProceedToVoting?: () => void;
  };
  juryVotingPhase: {
    handleJuryVote?: (jurorId: string, finalistId: string) => void;
    handleShowResults?: () => void;
  };
  gameActions: {
    handleNextWeek: () => void;
    handleResetGame?: () => void;
  };
  weekSummaries: WeekSummary[];
  setWeekSummaries: (summaries: WeekSummary[]) => void;
  week: number;
  nominees: string[];
  hoh: string | null;
  veto: string | null;
  vetoUsed: boolean;
  selectedPlayers: string[];
  setPhase: (phase: string) => void;
}

export function usePhaseRouter(props: PhaseRouterProps) {
  const {
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
  } = props;

  const handleAction = (action: string, data?: any) => {
    console.log("Handling action:", action, data);
    
    switch (action) {
      case 'selectHoH':
        if (hohPhase.handleSelectHoH) {
          hohPhase.handleSelectHoH();
        } else {
          console.warn("Unhandled action:", action);
        }
        break;
        
      case 'nominate':
        if (nominationPhase.nominate) {
          nominationPhase.nominate(selectedPlayers);
        } else {
          console.warn("Unhandled action:", action);
        }
        break;
        
      case 'selectVeto':
        if (povPhase.handleSelectVeto) {
          povPhase.handleSelectVeto();
        } else {
          console.warn("Unhandled action:", action);
        }
        break;
        
      case 'vetoAction':
        if (data === 'use' && vetoPhase.handleUseVeto) {
          vetoPhase.handleUseVeto(selectedPlayers[0]);
        } else if (data === 'noUse' && vetoPhase.handleDoNotUseVeto) {
          vetoPhase.handleDoNotUseVeto();
        } else {
          console.warn("Unhandled veto action:", data);
        }
        break;
        
      case 'evict':
        evictionPhase.handleEvict(data);
        break;
        
      case 'specialComp':
        if (specialCompPhase.handleSpecialCompetition) {
          specialCompPhase.handleSpecialCompetition();
        } else {
          console.warn("Unhandled action:", action);
        }
        break;
        
      case 'setupFinale':
        finaleManager.setupFinale();
        break;
        
      case 'juryQuestions':
        if (juryQuestionsPhase.handleJuryQuestions) {
          juryQuestionsPhase.handleJuryQuestions();
        } else {
          console.warn("Unhandled action:", action);
        }
        break;
        
      case 'proceedToVoting':
        if (juryQuestionsPhase.handleProceedToVoting) {
          juryQuestionsPhase.handleProceedToVoting();
        } else {
          console.warn("Unhandled action:", action);
        }
        break;
        
      case 'juryVote':
        if (juryVotingPhase.handleJuryVote) {
          const { jurorId, finalistId } = data;
          juryVotingPhase.handleJuryVote(jurorId, finalistId);
        } else {
          console.warn("Unhandled action:", action);
        }
        break;
        
      case 'showResults':
        if (juryVotingPhase.handleShowResults) {
          juryVotingPhase.handleShowResults();
        } else {
          console.warn("Unhandled action:", action);
        }
        break;
        
      case 'nextWeek':
        gameActions.handleNextWeek();
        break;
        
      case 'resetGame':
        if (gameActions.handleResetGame) {
          gameActions.handleResetGame();
        } else {
          console.warn("Unhandled action:", action);
        }
        break;
        
      default:
        console.warn("Unknown action:", action);
    }
  };

  return {
    handleAction
  };
}
