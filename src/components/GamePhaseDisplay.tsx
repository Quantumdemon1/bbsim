
import React from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import PhaseRenderer from './game-phases/PhaseRenderer';
import RandomEventHandler from './game-phases/event-handling/RandomEventHandler';
import PlayerDecisionHandler from './game-phases/decisions/PlayerDecisionHandler';
import StatusDisplay from './game-phases/StatusDisplay';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { Alliance } from '@/contexts/types';
import { WeekSummary } from '@/hooks/game-phases/types';

interface GamePhaseDisplayProps {
  phase: string;
  week: number;
  players: PlayerData[];
  nominees: string[];
  hoh: string | null;
  veto: string | null;
  vetoUsed?: boolean;
  lastHoH?: string | null;
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
  const { playerName } = useGameContext();
  const currentPlayerId = props.players.find(p => p.isHuman)?.id || null;

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {currentPlayerId && (
        <StatusDisplay 
          week={props.week}
          phase={props.phase}
          playerName={playerName}
          currentPlayerId={currentPlayerId}
          hoh={props.hoh}
          veto={props.veto}
          nominees={props.nominees}
        />
      )}
      
      {/* Regular phase content */}
      <PhaseRenderer {...props} />
      
      {/* Decision and Event Handlers */}
      <PlayerDecisionHandler 
        currentPlayerId={currentPlayerId}
        players={props.players}
      />
      <RandomEventHandler 
        currentPlayerId={currentPlayerId}
      />
    </div>
  );
};

export default GamePhaseDisplay;
