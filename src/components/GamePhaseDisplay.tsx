
import React, { useEffect } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import PhaseRenderer from './game-phases/PhaseRenderer';
import RandomEventHandler from './game-phases/event-handling/RandomEventHandler';
import PlayerDecisionHandler from './game-phases/decisions/PlayerDecisionHandler';
import StatusDisplay from './game-phases/StatusDisplay';
import { useEventDecisionManager } from '@/hooks/game-phases/decisions/useEventDecisionManager';
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
  const { handleRandomEvent } = useEventDecisionManager();
  const currentPlayerId = props.players.find(p => p.isHuman)?.id || null;
  
  // This effect will check for random events based on the phase
  useEffect(() => {
    const randomEventChance = Math.random();
    if (randomEventChance < 0.1) { // 10% chance of random event
      setTimeout(() => {
        handleRandomEvent();
      }, 5000); // Add a delay after phase change
    }
  }, [props.phase, handleRandomEvent]);

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
