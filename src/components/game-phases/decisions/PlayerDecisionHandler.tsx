
import React from 'react';
import { useEventDecisionManager } from '@/hooks/game-phases/decisions/useEventDecisionManager';
import { PlayerDecisionPrompt } from '@/components/game-ui/PlayerDecisionPrompt';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface PlayerDecisionHandlerProps {
  currentPlayerId: string | null;
  players: PlayerData[];
}

const PlayerDecisionHandler: React.FC<PlayerDecisionHandlerProps> = ({ 
  currentPlayerId,
  players 
}) => {
  const {
    currentDecision,
    decisionPromptOpen,
    setDecisionPromptOpen,
    handleDecisionMade
  } = useEventDecisionManager();

  return (
    <>
      {currentDecision && (
        <PlayerDecisionPrompt
          open={decisionPromptOpen}
          onOpenChange={setDecisionPromptOpen}
          title={currentDecision.title}
          description={currentDecision.description}
          situation={currentDecision.situation}
          options={currentDecision.options}
          onDecisionMade={handleDecisionMade}
          targetPlayerId={currentDecision.targetPlayerId}
          showThinking={true}
        />
      )}
    </>
  );
};

export default PlayerDecisionHandler;
