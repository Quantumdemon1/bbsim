
import { WeekSummary } from '../types';

/**
 * Manager for routing actions to the appropriate phase handler
 */
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
}: {
  hohPhase: { handleSelectHoH: () => void },
  nominationPhase: { handleNominate: () => void },
  povPhase: { handleSelectVeto: () => void },
  vetoPhase: { handleVetoAction: (data: any) => void },
  evictionPhase: { handleEvict: (playerId: string) => void },
  specialCompPhase: { handleSpecialCompetition: () => void },
  finaleManager: { setupFinale: () => void },
  juryQuestionsPhase: { handleJuryQuestions: () => void, handleProceedToVoting: () => void },
  juryVotingPhase: { handleJuryVote: (jurorId: string, finalistId: string) => void, handleShowResults: () => void },
  gameActions: { handleNextWeek: () => void },
  weekSummaries: WeekSummary[],
  setWeekSummaries: (summaries: WeekSummary[]) => void,
  week: number,
  nominees: string[],
  hoh: string | null,
  veto: string | null,
  vetoUsed: boolean,
  selectedPlayers: string[],
  setPhase: (phase: string) => void
}) {
  // Main action handler that routes to the appropriate phase handler
  const handleAction = (action: string, data?: any) => {
    switch (action) {
      case 'selectHOH':
        hohPhase.handleSelectHoH();
        break;
        
      case 'nominate':
        nominationPhase.handleNominate();
        break;
        
      case 'selectVeto':
        povPhase.handleSelectVeto();
        break;
        
      case 'vetoAction':
        vetoPhase.handleVetoAction(data);
        break;
        
      case 'evict':
        evictionPhase.handleEvict(data);
        break;
        
      case 'nextWeek':
        // Add current week's summary before moving to next week
        const currentWeekSummary: WeekSummary = {
          week: week,
          hoh: hoh,
          nominees: nominees,
          vetoPlayers: nominees.concat(hoh ? [hoh] : []).concat(veto ? [veto] : []),
          vetoWinner: veto,
          veto: veto, // Add for compatibility
          vetoUsed: vetoUsed,
          finalNominees: nominees,
          evicted: selectedPlayers[0],
          evictionVotes: "5-2" // Mock voting result
        };
        
        setWeekSummaries([...weekSummaries, currentWeekSummary]);
        
        // Now proceed to next week
        gameActions.handleNextWeek();
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
        
      case 'showFinaleStats':
        setPhase('Statistics');
        break;
        
      case 'showPlacements':
        setPhase('Placements');
        break;
        
      case 'reSimulate':
        window.location.reload();
        break;
    }
  };

  return {
    handleAction
  };
}
