
import React from 'react';
import { PlayerData } from '../PlayerProfileTypes';
import { Alliance } from '@/contexts/types';
import { WeekSummary } from '@/hooks/game-phases/types';
import DefaultPhase from './DefaultPhase';

// Import specialized renderers
import CompetitionPhaseRenderer from './renderers/CompetitionPhaseRenderer';
import NominationPhaseRenderer from './renderers/NominationPhaseRenderer';
import EvictionPhaseRenderer from './renderers/EvictionPhaseRenderer';
import SummaryPhaseRenderer from './renderers/SummaryPhaseRenderer';
import FinalePhaseRenderer from './renderers/FinalePhaseRenderer';

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

const PhaseRenderer: React.FC<PhaseRendererProps> = (props) => {
  const { 
    phase, 
    players, 
    hoh, 
    nominees, 
    veto, 
    selectedPlayers, 
    onPlayerSelect, 
    onAction,
    week,
    statusMessage,
    alliances,
    finalists,
    jurors,
    votes,
    weekSummaries
  } = props;
  
  // Try rendering the phase using each specialized renderer
  
  // Competition phases (HoH, PoV, Special)
  const competitionPhases = ['HoH Competition', 'PoV Competition', 'Special Competition'];
  if (competitionPhases.includes(phase)) {
    return (
      <CompetitionPhaseRenderer
        phase={phase}
        players={players}
        hoh={hoh}
        nominees={nominees}
        selectedPlayers={selectedPlayers}
        onPlayerSelect={onPlayerSelect}
        onAction={onAction}
      />
    );
  }
  
  // Nomination phases (Nomination, Veto)
  const nominationPhases = ['Nomination Ceremony', 'Veto Ceremony'];
  if (nominationPhases.includes(phase)) {
    return (
      <NominationPhaseRenderer
        phase={phase}
        players={players}
        hoh={hoh}
        nominees={nominees}
        veto={veto}
        selectedPlayers={selectedPlayers}
        onPlayerSelect={onPlayerSelect}
        onAction={onAction}
      />
    );
  }
  
  // Eviction phases (Voting, Eviction)
  const evictionPhases = ['Eviction Voting', 'Eviction'];
  if (evictionPhases.includes(phase)) {
    return (
      <EvictionPhaseRenderer
        phase={phase}
        players={players}
        nominees={nominees}
        alliances={alliances}
        selectedPlayers={selectedPlayers}
        statusMessage={statusMessage}
        week={week}
        onAction={onAction}
      />
    );
  }
  
  // Summary phases (Weekly Summary, Placements, Statistics)
  const summaryPhases = ['Weekly Summary', 'Placements', 'Statistics'];
  if (summaryPhases.includes(phase)) {
    return (
      <SummaryPhaseRenderer
        phase={phase}
        players={players}
        week={week}
        weekSummaries={weekSummaries}
        finalists={finalists}
        jurors={jurors}
        votes={votes}
        onAction={onAction}
        alliances={alliances}
      />
    );
  }
  
  // Finale phases (Jury Questions, Jury Voting, Winner)
  const finalePhases = ['Jury Questions', 'Jury Voting', 'The Winner'];
  if (finalePhases.includes(phase)) {
    return (
      <FinalePhaseRenderer
        phase={phase}
        players={players}
        finalists={finalists}
        jurors={jurors}
        votes={votes}
        statusMessage={statusMessage}
        onAction={onAction}
      />
    );
  }
  
  // If no specialized renderer handles this phase, use the default renderer
  return (
    <DefaultPhase
      phase={phase}
      statusMessage={statusMessage}
    />
  );
};

export default PhaseRenderer;
