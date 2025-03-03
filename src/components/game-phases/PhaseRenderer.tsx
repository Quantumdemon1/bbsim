
import React from 'react';
import { PlayerData } from '../PlayerProfile';
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

const PhaseRenderer: React.FC<PhaseRendererProps> = ({
  phase,
  week,
  players,
  nominees,
  hoh,
  veto,
  onAction,
  statusMessage,
  selectedPlayers,
  onPlayerSelect,
  alliances = [],
  finalists = [],
  jurors = [],
  votes = {},
  weekSummaries = []
}) => {
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
      
    case 'PoV Competition':
      return (
        <PoVCompetition
          players={players}
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
      
    case 'Eviction Voting':
      return (
        <EvictionVoting
          players={players}
          nominees={nominees}
          alliances={alliances}
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
      
    case 'Weekly Summary':
      return (
        <WeeklySummary
          players={players}
          weekSummaries={weekSummaries}
          currentWeek={week - 1}
          onAction={onAction}
          alliances={alliances}
        />
      );
      
    case 'Placements':
      return (
        <PlacementsChart
          players={players}
          finalists={finalists}
          jurors={jurors}
          votes={votes}
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
      
    case 'Jury Questions':
      return (
        <JuryQuestions
          players={players}
          finalists={finalists}
          jurors={jurors}
          statusMessage={statusMessage}
          onAction={onAction}
        />
      );
      
    case 'Jury Voting':
      return (
        <JuryVoting
          players={players}
          finalists={finalists}
          jurors={jurors}
          votes={votes}
          statusMessage={statusMessage}
          onAction={onAction}
        />
      );
      
    case 'The Winner':
      return (
        <WinnerReveal
          players={players}
          votes={votes}
          finalists={finalists}
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
      return (
        <DefaultPhase
          phase={phase}
          statusMessage={statusMessage}
        />
      );
  }
};

export default PhaseRenderer;
