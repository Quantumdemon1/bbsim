
import React, { useEffect, useState } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import { GamePhase } from '@/types/gameTypes';
import { usePlayerStorylineManager } from '@/hooks/game-phases/storyline/player-storyline';
import StoryEventDisplay from './StoryEventDisplay';
import PlayerStatusHeader from './PlayerStatusHeader';
import GameStatusMessage from './GameStatusMessage';
import ActionButtons from './ActionButtons';
import RelationshipSection from './RelationshipSection';
import DiarySection from './DiarySection';
import EnvironmentIndicator from './EnvironmentIndicator';
import SocialNetworkVisualizer from './SocialNetworkVisualizer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Book, Heart } from 'lucide-react';

interface FirstPersonViewProps {
  currentPlayerId: string | null;
}

const FirstPersonView: React.FC<FirstPersonViewProps> = ({ currentPlayerId }) => {
  // Get required game context properties
  const { players } = useGameContext();
  
  // Use type assertion to access missing properties
  const gameContext = useGameContext() as unknown as {
    dayCount: number;
    actionsRemaining: number;
    currentPhase: GamePhase;
    useAction: () => boolean;
    alliances: any[];
  } & ReturnType<typeof useGameContext>;
  
  const { dayCount, actionsRemaining, currentPhase, alliances } = gameContext;
  
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
  
  const [activeTab, setActiveTab] = useState<string>("relationships");
  
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
    <div className="p-4 bg-game-dark text-white rounded-lg relative overflow-hidden">
      {/* Environment background that changes based on phase */}
      <EnvironmentIndicator currentPhase={currentPhase} />
      
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="bg-game-medium/50 w-full grid grid-cols-3">
          <TabsTrigger value="relationships" className="flex items-center gap-1">
            <Users className="w-3 h-3" /> Relationships
          </TabsTrigger>
          <TabsTrigger value="diary" className="flex items-center gap-1">
            <Book className="w-3 h-3" /> Diary
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center gap-1">
            <Heart className="w-3 h-3" /> Social Web
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="relationships" className="mt-2">
          <RelationshipSection 
            allies={allies}
            neutralPlayers={neutralPlayers}
            rivals={rivals}
            actionsRemaining={actionsRemaining}
            triggerSocialEvent={triggerSocialEvent}
          />
        </TabsContent>
        
        <TabsContent value="diary" className="mt-2">
          <DiarySection 
            currentPlayerId={currentPlayerId} 
            actionsRemaining={actionsRemaining}
          />
        </TabsContent>
        
        <TabsContent value="network" className="mt-2">
          <SocialNetworkVisualizer 
            players={players} 
            currentPlayerId={currentPlayerId}
            alliances={alliances}
          />
        </TabsContent>
      </Tabs>
      
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
