
import React from 'react';
import { useEventDecisionManager } from '@/hooks/game-phases/decisions/useEventDecisionManager';
import { PlayerDecisionPrompt } from '@/components/game-ui/PlayerDecisionPrompt';

interface RandomEventHandlerProps {
  currentPlayerId: string | null;
}

const RandomEventHandler: React.FC<RandomEventHandlerProps> = ({ currentPlayerId }) => {
  const {
    currentEvent,
    eventModalOpen,
    setEventModalOpen,
    handleEventChoice
  } = useEventDecisionManager();
  
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
