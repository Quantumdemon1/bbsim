
import React from 'react';
import { useRandomEvents, GameEvent } from '@/hooks/game-phases/useRandomEvents';
import { PlayerDecisionPrompt } from '@/components/game-ui/PlayerDecisionPrompt';

interface RandomEventHandlerProps {
  currentPlayerId: string | null;
}

const RandomEventHandler: React.FC<RandomEventHandlerProps> = ({ currentPlayerId }) => {
  const {
    weeklyEvents,
    generateRandomEvent,
    processEventChoice,
    resetWeeklyEvents
  } = useRandomEvents();
  
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  
  // Handle a random event
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
      console.log("Event outcome:", result.outcome);
      console.log("Relationship effects:", result.relationshipEffect);
      
      setEventModalOpen(false);
      setCurrentEvent(null);
    }
  };
  
  return (
    <>
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
    </>
  );
};

export default RandomEventHandler;
