
import React from 'react';
import { PlayerData } from '../../PlayerProfileTypes';
import { Alliance } from '@/contexts/types';
import { WeekSummary } from '@/hooks/game-phases/types';
import WeeklySummary from '../WeeklySummary';
import PlacementsChart from '../PlacementsChart';
import FinaleStats from '../FinaleStats';

interface SummaryPhaseRendererProps {
  phase: string;
  players: PlayerData[];
  week: number;
  weekSummaries?: WeekSummary[];
  finalists?: string[];
  jurors?: string[];
  votes?: Record<string, string>;
  onAction: (action: string, data?: any) => void;
  alliances?: Alliance[];
}

const SummaryPhaseRenderer: React.FC<SummaryPhaseRendererProps> = ({
  phase,
  players,
  week,
  weekSummaries,
  finalists,
  jurors,
  votes,
  onAction,
  alliances
}) => {
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

export default SummaryPhaseRenderer;
