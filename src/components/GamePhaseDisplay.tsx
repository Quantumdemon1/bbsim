
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
import { usePlayerStorylineManager } from '@/hooks/game-phases/usePlayerStorylineManager';
import StoryEventDisplay from './game-storyline/StoryEventDisplay';

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
  
  // Add storyline manager integration
  const { 
    currentStoryEvent, 
    storyEventOpen, 
    setStoryEventOpen,
    handleStoryChoice,
    generateRandomEvent
  } = usePlayerStorylineManager();
  
  // This effect will check for both random events and storyline events
  useEffect(() => {
    const randomEventChance = Math.random();
    
    // Try both event systems
    if (randomEventChance < 0.1) { // 10% chance of random event
      setTimeout(() => {
        // Try game event first
        handleRandomEvent();
        
        // Also try storyline event
        generateRandomEvent();
      }, 5000); // Add a delay after phase change
    }
  }, [props.phase, handleRandomEvent, generateRandomEvent]);

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
      
      {/* Add Story Event Handler */}
      {currentStoryEvent && (
        <StoryEventDisplay
          event={currentStoryEvent}
          open={storyEventOpen}
          onOpenChange={setStoryEventOpen}
          onChoiceMade={handleStoryChoice}
        />
      )}
    </div>
  );
};

export default GamePhaseDisplay;
