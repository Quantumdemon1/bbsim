
import React from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import PhaseRenderer from './game-phases/PhaseRenderer';
import RandomEventHandler from './game-phases/event-handling/RandomEventHandler';
import PlayerDecisionHandler from './game-phases/decisions/PlayerDecisionHandler';
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
        <div className="mb-6 bg-game-medium rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Week {props.week}: {props.phase}</h2>
              <p className="text-gray-300">
                You are playing as {playerName || 'Human Player'}
                {props.hoh === currentPlayerId && " - You are the Head of Household!"}
                {props.veto === currentPlayerId && " - You hold the Power of Veto!"}
                {props.nominees.includes(currentPlayerId) && " - You are nominated for eviction!"}
              </p>
            </div>
          </div>
        </div>
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
