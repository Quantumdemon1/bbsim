
import React, { useState, useEffect } from 'react';
import { PlayerData } from './PlayerProfileTypes';
import { Alliance } from '@/contexts/types';
import PhaseRenderer from './game-phases/PhaseRenderer';
import { WeekSummary } from '@/hooks/game-phases/types';
import { PlayerDecisionPrompt } from './game-ui/PlayerDecisionPrompt';
import { usePlayerDecisions } from '@/hooks/game-phases/usePlayerDecisions';
import { useRandomEvents, GameEvent } from '@/hooks/game-phases/useRandomEvents';
import { Button } from './ui/button';
import { useGameContext } from '@/hooks/useGameContext';
import { Card } from './ui/card';

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
  const { 
    players, 
    week, 
    hoh, 
    nominees, 
    veto, 
    phase, 
    onAction 
  } = props;
  const { playerName } = useGameContext();
  
  const currentPlayerId = players.find(p => p.isHuman)?.id || null;
  
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  
  // Initialize decision system
  const {
    isDecisionPromptOpen,
    setIsDecisionPromptOpen,
    currentDecision,
    presentDecision,
    handleDecisionMade,
    generateAllianceDecision,
    generateNominationDecision,
    generateEvictionVoteDecision,
    generateVetoDecision
  } = usePlayerDecisions({ 
    players, 
    currentPlayerId 
  });
  
  // Initialize random events
  const {
    weeklyEvents,
    generateRandomEvent,
    processEventChoice,
    resetWeeklyEvents,
    triggerRandomEvent
  } = useRandomEvents();
  
  // Trigger a random event (for testing purposes)
  const handleRandomEvent = async () => {
    const newEvent = await generateRandomEvent();
    if (newEvent) {
      setCurrentEvent(newEvent);
      setEventModalOpen(true);
    }
  };
  
  // Handle an event choice
  const handleEventChoice = (eventId: string, choiceId: string) => {
    const result = processEventChoice(eventId, choiceId);
    if (result) {
      // TODO: Apply relationship effects
      console.log("Event outcome:", result.outcome);
      console.log("Relationship effects:", result.relationshipEffect);
      
      setEventModalOpen(false);
      setCurrentEvent(null);
    }
  };
  
  // Reset events when week changes
  useEffect(() => {
    resetWeeklyEvents();
  }, [week, resetWeeklyEvents]);
  
  // For demonstration - add a test decision
  const testPlayerDecision = async () => {
    if (players.length > 1 && currentPlayerId) {
      // Find a random non-human player
      const nonHumanPlayers = players.filter(p => !p.isHuman && p.status !== 'evicted');
      if (nonHumanPlayers.length > 0) {
        const randomPlayer = nonHumanPlayers[Math.floor(Math.random() * nonHumanPlayers.length)];
        const decisionData = await generateAllianceDecision(randomPlayer.id);
        
        presentDecision(decisionData, (optionId) => {
          console.log(`Player chose option: ${optionId}`);
          // Handle the decision consequences here
        });
      }
    }
  };
  
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {currentPlayerId && (
        <div className="mb-6 bg-game-medium rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Week {week}: {phase}</h2>
              <p className="text-gray-300">
                You are playing as {playerName || 'Human Player'}
                {hoh === currentPlayerId && " - You are the Head of Household!"}
                {veto === currentPlayerId && " - You hold the Power of Veto!"}
                {nominees.includes(currentPlayerId) && " - You are nominated for eviction!"}
              </p>
            </div>
            
            {/* Test buttons for demonstration - would be integrated into game flow in real implementation */}
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={testPlayerDecision}
                className="bg-game-dark/80 border-game-accent text-game-accent"
              >
                Test Decision
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRandomEvent}
                className="bg-game-dark/80 border-game-accent text-game-accent"
              >
                Trigger Event
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Regular phase content */}
      <PhaseRenderer {...props} />
      
      {/* Player decision prompt */}
      {currentDecision && (
        <PlayerDecisionPrompt
          open={isDecisionPromptOpen}
          onOpenChange={setIsDecisionPromptOpen}
          title={currentDecision.title}
          description={currentDecision.description}
          situation={currentDecision.situation}
          options={currentDecision.options}
          onDecisionMade={handleDecisionMade}
          targetPlayerId={currentDecision.targetPlayerId}
          showThinking={true}
        />
      )}
      
      {/* Random event modal */}
      {currentEvent && (
        <PlayerDecisionPrompt
          open={eventModalOpen}
          onOpenChange={setEventModalOpen}
          title={currentEvent.title}
          description={currentEvent.description}
          situation={currentEvent.type}
          options={currentEvent.choices?.map(c => ({
            id: c.id,
            label: c.text,
            description: c.outcome
          })) || []}
          onDecisionMade={(choiceId) => handleEventChoice(currentEvent.id, choiceId)}
          targetPlayerId={currentEvent.participants[0]}
          showThinking={false}
        />
      )}
    </div>
  );
};

export default GamePhaseDisplay;
