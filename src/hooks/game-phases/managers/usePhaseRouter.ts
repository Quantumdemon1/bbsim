
import { WeekSummary } from '@/hooks/game-phases/types';

interface PhaseRouterProps {
  hohPhase: {
    handleSelectHoH: () => void;
  };
  nominationPhase: {
    handleNominate: () => void;
  };
  povPhase: {
    handleSelectVeto: () => void;
  };
  vetoPhase: {
    handleVetoAction: (action: string) => void;
  };
  evictionPhase: {
    handleEvict: (evictedId: string) => void;
  };
  specialCompPhase: {
    handleSpecialCompetition: () => void;
  };
  finaleManager: {
    setupFinale: () => void;
  };
  juryQuestionsPhase: {
    handleJuryQuestions: () => void;
    handleProceedToVoting: () => void;
  };
  juryVotingPhase: {
    handleJuryVote: (jurorId: string, finalistId: string) => void;
    handleShowResults: () => void;
  };
  gameActions: {
    handleNextWeek: () => void;
    handleShowPlacements: () => void;
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
    switch (action) {
      case 'selectHoH':
        hohPhase.handleSelectHoH();
        break;
      case 'nominatePlayers':
        nominationPhase.handleNominate();
        break;
      case 'selectVeto':
        povPhase.handleSelectVeto();
        break;
      case 'vetoAction':
        vetoPhase.handleVetoAction(data);
        break;
      case 'evictPlayer':
        evictionPhase.handleEvict(data);
        break;
      case 'specialCompetition':
        specialCompPhase.handleSpecialCompetition();
        break;
      case 'setupFinale':
        finaleManager.setupFinale();
        break;
      case 'juryQuestions':
        juryQuestionsPhase.handleJuryQuestions();
        break;
      case 'proceedToVoting':
        juryQuestionsPhase.handleProceedToVoting();
        break;
      case 'juryVote':
        if (data && data.jurorId && data.finalistId) {
          juryVotingPhase.handleJuryVote(data.jurorId, data.finalistId);
        }
        break;
      case 'showResults':
        juryVotingPhase.handleShowResults();
        break;
      case 'nextWeek':
        createWeekSummary();
        gameActions.handleNextWeek();
        break;
      case 'showPlacements':
        gameActions.handleShowPlacements();
        break;
      default:
        console.warn(`Unhandled action: ${action}`);
    }
  };

  const createWeekSummary = () => {
    // Ensure that weekSummaries is not undefined
    const existingSummary = weekSummaries && weekSummaries.find(s => s.week === week);
    
    if (existingSummary) {
      console.warn(`Summary for week ${week} already exists.`);
      return;
    }
    
    const weekSummary: WeekSummary = {
      week: props.week,
      hoh: props.hoh,
      nominees: [...props.nominees],
      vetoWinner: props.veto, // Properly assign this property
      vetoUsed: props.vetoUsed || false,
      evicted: props.selectedPlayers.length === 1 ? props.selectedPlayers[0] : null
    };
    
    setWeekSummaries([...weekSummaries, weekSummary]);
  };

  return {
    handleAction
  };
}
