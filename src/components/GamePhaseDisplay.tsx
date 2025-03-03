import React from 'react';
import { PlayerData } from './PlayerProfile';
import { Alliance } from '@/contexts/types';
import HoHCompetition from './game-phases/HoHCompetition';
import NominationCeremony from './game-phases/NominationCeremony';
import PoVCompetition from './game-phases/PoVCompetition';
import VetoCeremony from './game-phases/VetoCeremony';
import EvictionVoting from './game-phases/EvictionVoting';
import Eviction from './game-phases/Eviction';
import SpecialCompetition from './game-phases/SpecialCompetition';
import JuryQuestions from './game-phases/JuryQuestions';
import JuryVoting from './game-phases/JuryVoting';
import WinnerReveal from './game-phases/WinnerReveal';
import FinaleStats from './game-phases/FinaleStats';
import WeeklySummary from './game-phases/WeeklySummary';
import PlacementsChart from './game-phases/PlacementsChart';
import DefaultPhase from './game-phases/DefaultPhase';
import { WeekSummary } from '@/hooks/game-phases/types';
import {
  ComponentJuryQuestionsProps,
  ComponentJuryVotingProps,
  PlacementsChartProps
} from '@/hooks/game-phases/types';

interface GamePhaseDisplayProps {
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

const GamePhaseDisplay: React.FC<GamePhaseDisplayProps> = ({
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
  const renderPhaseContent = () => {
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

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {renderPhaseContent()}
    </div>
  );
};

export default GamePhaseDisplay;
