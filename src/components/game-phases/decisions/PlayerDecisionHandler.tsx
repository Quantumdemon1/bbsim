
import React from 'react';
import { usePlayerDecisions } from '@/hooks/game-phases/usePlayerDecisions';
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
    isDecisionPromptOpen,
    setIsDecisionPromptOpen,
    currentDecision,
    handleDecisionMade
  } = usePlayerDecisions({ 
    players, 
    currentPlayerId 
  });

  return (
    <>
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
    </>
  );
};

export default PlayerDecisionHandler;
