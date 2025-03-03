
import React from 'react';
import { PlayerData } from './PlayerProfileTypes';
import { Alliance } from '@/contexts/types';
import PhaseRenderer from './game-phases/PhaseRenderer';
import { WeekSummary } from '@/hooks/game-phases/types';

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

const GamePhaseDisplay: React.FC<GamePhaseDisplayProps> = (props) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <PhaseRenderer {...props} />
    </div>
  );
};

export default GamePhaseDisplay;
