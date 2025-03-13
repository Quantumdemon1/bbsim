
import React, { useEffect } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import { GamePhase } from '@/types/gameTypes';
import { usePlayerStorylineManager } from '@/hooks/game-phases/usePlayerStorylineManager';
import StoryEventDisplay from './StoryEventDisplay';
import PlayerStatusHeader from './PlayerStatusHeader';
import GameStatusMessage from './GameStatusMessage';
import ActionButtons from './ActionButtons';
import RelationshipSection from './RelationshipSection';

interface FirstPersonViewProps {
  currentPlayerId: string | null;
}

const FirstPersonView: React.FC<FirstPersonViewProps> = ({ currentPlayerId }) => {
  // Get required game context properties with type assertions
  const { players } = useGameContext();
  
  // Use type assertion to access missing properties
  const gameContext = useGameContext() as unknown as {
    dayCount: number;
    actionsRemaining: number;
    currentPhase: GamePhase;
    useAction: () => boolean;
  } & ReturnType<typeof useGameContext>;
  
  const { dayCount, actionsRemaining, currentPhase } = gameContext;
  
  const { 
    currentStoryEvent,
    storyEventOpen,
    setStoryEventOpen,
    triggerDiaryRoomEvent,
    triggerSocialEvent,
    handleStoryChoice,
    generateRandomEvent,
    playerMood
  } = usePlayerStorylineManager();
  
  const currentPlayer = players.find(p => p.isHuman);
  const currentPlayerName = currentPlayer?.name || "Player";
  
  // Try to generate random events periodically
  useEffect(() => {
    const interval = setInterval(() => {
      generateRandomEvent();
    }, 60000); // Try once per minute
    
    return () => clearInterval(interval);
  }, [generateRandomEvent]);
  
  // Split AI players into categories based on relationship
  const allies = players.filter(p => !p.isHuman && p.relationships?.some(
    r => r.targetId === currentPlayerId && ['Ally', 'Friend'].includes(r.type)
  ));
  
  const rivals = players.filter(p => !p.isHuman && p.relationships?.some(
    r => r.targetId === currentPlayerId && ['Enemy', 'Rival'].includes(r.type)
  ));
  
  const neutralPlayers = players.filter(p => 
    !p.isHuman && 
    !allies.some(ally => ally.id === p.id) && 
    !rivals.some(rival => rival.id === p.id)
  );
  
  return (
    <div className="p-4 bg-game-dark text-white rounded-lg">
      <PlayerStatusHeader 
        playerName={currentPlayerName}
        dayCount={dayCount}
        currentPhase={currentPhase}
        actionsRemaining={actionsRemaining}
        playerMood={playerMood}
      />
      
      <GameStatusMessage 
        currentPhase={currentPhase}
        dayCount={dayCount}
      />
      
      <ActionButtons 
        actionsRemaining={actionsRemaining}
        triggerDiaryRoomEvent={triggerDiaryRoomEvent}
      />
      
      <RelationshipSection 
        allies={allies}
        neutralPlayers={neutralPlayers}
        rivals={rivals}
        actionsRemaining={actionsRemaining}
        triggerSocialEvent={triggerSocialEvent}
      />
      
      {/* Story Event Dialog */}
      <StoryEventDisplay
        event={currentStoryEvent}
        open={storyEventOpen}
        onOpenChange={setStoryEventOpen}
        onChoiceMade={handleStoryChoice}
      />
    </div>
  );
};

export default FirstPersonView;
