
import React from 'react';
import { PlayerData } from '../PlayerProfileTypes';
import { Alliance } from '@/contexts/types';
import { WeekSummary } from '@/hooks/game-phases/types';

// Phase components
import HoHCompetition from './HoHCompetition';
import NominationCeremony from './NominationCeremony';
import PoVCompetition from './PoVCompetition';
import VetoCeremony from './VetoCeremony';
import EvictionVoting from './EvictionVoting';
import Eviction from './Eviction';
import SpecialCompetition from './SpecialCompetition';
import JuryQuestions from './JuryQuestions';
import JuryVoting from './JuryVoting';
import WinnerReveal from './WinnerReveal';
import FinaleStats from './FinaleStats';
import WeeklySummary from './WeeklySummary';
import PlacementsChart from './PlacementsChart';
import DefaultPhase from './DefaultPhase';

interface PhaseRendererProps {
  phase: string;
  week: number;
  players: PlayerData[];
  nominees: string[];
  hoh: string | null;
  veto: string | null;
  onAction: (action: string, data?: any) => void;
  statusMessage: string;
  selectedPlayers: string[];
  onPlayerSelect: (playerId: string) => void;
  alliances?: Alliance[];
  finalists?: string[];
  jurors?: string[];
  votes?: Record<string, string>;
  weekSummaries?: WeekSummary[];
}

// Group 1: Regular Week Competition Phases
const renderCompetitionPhase = (props: PhaseRendererProps) => {
  const { phase, players, selectedPlayers, onPlayerSelect, onAction } = props;
  
  switch (phase) {
    case 'HoH Competition':
      return (
        <HoHCompetition 
          players={players}
          selectedPlayers={selectedPlayers}
          onPlayerSelect={onPlayerSelect}
          onAction={onAction}
        />
      );
      
    case 'PoV Competition':
      return (
        <PoVCompetition
          players={players}
          selectedPlayers={selectedPlayers}
          onPlayerSelect={onPlayerSelect}
          onAction={onAction}
        />
      );
      
    case 'Special Competition':
      return (
        <SpecialCompetition
          players={players}
          selectedPlayers={selectedPlayers}
          onPlayerSelect={onPlayerSelect}
          onAction={onAction}
        />
      );
      
    default:
      return null;
  }
};

// Group 2: Nomination and Veto Phases
const renderNominationPhase = (props: PhaseRendererProps) => {
  const { phase, players, hoh, nominees, veto, selectedPlayers, onPlayerSelect, onAction } = props;
  
  switch (phase) {
    case 'Nomination Ceremony':
      return (
        <NominationCeremony
          players={players}
          hoh={hoh}
          selectedPlayers={selectedPlayers}
          onPlayerSelect={onPlayerSelect}
          onAction={onAction}
        />
      );
      
    case 'Veto Ceremony':
      return (
        <VetoCeremony
          players={players}
          veto={veto}
          nominees={nominees}
          onAction={onAction}
        />
      );
      
    default:
      return null;
  }
};

// Group 3: Eviction Phases
const renderEvictionPhase = (props: PhaseRendererProps) => {
  const { phase, players, nominees, alliances, selectedPlayers, statusMessage, week, onAction } = props;
  
  switch (phase) {
    case 'Eviction Voting':
      return (
        <EvictionVoting
          players={players}
          nominees={nominees}
          alliances={alliances || []}
          onAction={onAction}
        />
      );
      
    case 'Eviction':
      return (
        <Eviction
          players={players}
          selectedPlayers={selectedPlayers}
          statusMessage={statusMessage}
          week={week}
          onAction={onAction}
        />
      );
      
    default:
      return null;
  }
};

// Group 4: Summary and Statistics Phases
const renderSummaryPhase = (props: PhaseRendererProps) => {
  const { phase, players, week, weekSummaries, finalists, jurors, votes, onAction, alliances } = props;
  
  switch (phase) {
    case 'Weekly Summary':
      return (
        <WeeklySummary
          players={players}
          weekSummaries={weekSummaries || []}
          currentWeek={week - 1}
          onAction={onAction}
          alliances={alliances}
        />
      );
      
    case 'Placements':
      return (
        <PlacementsChart
          players={players}
          finalists={finalists || []}
          jurors={jurors || []}
          votes={votes || {}}
          onAction={onAction}
        />
      );
      
    case 'Statistics':
    case 'Finale':
      return (
        <FinaleStats
          players={players}
          onAction={onAction}
        />
      );
      
    default:
      return null;
  }
};

// Group 5: Finale and Jury Phases
const renderFinalePhase = (props: PhaseRendererProps) => {
  const { phase, players, finalists, jurors, votes, statusMessage, onAction } = props;
  
  switch (phase) {
    case 'Jury Questions':
      return (
        <JuryQuestions
          players={players}
          finalists={finalists || []}
          jurors={jurors || []}
          statusMessage={statusMessage}
          onAction={onAction}
        />
      );
      
    case 'Jury Voting':
      return (
        <JuryVoting
          players={players}
          finalists={finalists || []}
          jurors={jurors || []}
          votes={votes || {}}
          statusMessage={statusMessage}
          onAction={onAction}
        />
      );
      
    case 'The Winner':
      return (
        <WinnerReveal
          players={players}
          votes={votes || {}}
          finalists={finalists || []}
          onAction={onAction}
        />
      );
      
    default:
      return null;
  }
};

const PhaseRenderer: React.FC<PhaseRendererProps> = (props) => {
  const { phase, statusMessage } = props;
  
  // Try rendering the phase using each group
  const competitionPhase = renderCompetitionPhase(props);
  if (competitionPhase) return competitionPhase;
  
  const nominationPhase = renderNominationPhase(props);
  if (nominationPhase) return nominationPhase;
  
  const evictionPhase = renderEvictionPhase(props);
  if (evictionPhase) return evictionPhase;
  
  const summaryPhase = renderSummaryPhase(props);
  if (summaryPhase) return summaryPhase;
  
  const finalePhase = renderFinalePhase(props);
  if (finalePhase) return finalePhase;
  
  // If no group handles this phase, use the default renderer
  return (
    <DefaultPhase
      phase={phase}
      statusMessage={statusMessage}
    />
  );
};

export default PhaseRenderer;
