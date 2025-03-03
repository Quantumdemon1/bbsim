
import React from 'react';
import { User, Crown, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SinglePlayerTab from './SinglePlayerTab';
import CreateMultiplayerTab from './CreateMultiplayerTab';
import JoinMultiplayerTab from './JoinMultiplayerTab';

interface GameModeTabsProps {
  activeTab: 'single' | 'multi-create' | 'multi-join';
  setActiveTab: (tab: 'single' | 'multi-create' | 'multi-join') => void;
  hostName: string;
  gameId: string;
  playerName: string;
  onHostNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGameIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPlayerNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAuthenticated: boolean;
  isGuest: boolean;
  onStartSinglePlayer: () => void;
  onCreateMultiplayerGame: () => void;
  onJoinMultiplayerGame: () => void;
}

const GameModeTabs: React.FC<GameModeTabsProps> = ({
  activeTab,
  setActiveTab,
  hostName,
  gameId,
  playerName,
  onHostNameChange,
  onGameIdChange,
  onPlayerNameChange,
  isAuthenticated,
  isGuest,
  onStartSinglePlayer,
  onCreateMultiplayerGame,
  onJoinMultiplayerGame
}) => {
  return (
    <Tabs defaultValue="single" className="mb-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger 
          value="single" 
          onClick={() => setActiveTab('single')}
          className={activeTab === 'single' ? 'bg-game-accent text-white' : ''}
        >
          <User className="w-4 h-4 mr-2" />
          Single Player
        </TabsTrigger>
        <TabsTrigger 
          value="multi-create" 
          onClick={() => setActiveTab('multi-create')}
          className={activeTab === 'multi-create' ? 'bg-game-accent text-white' : ''}
        >
          <Crown className="w-4 h-4 mr-2" />
          Create Game
        </TabsTrigger>
        <TabsTrigger 
          value="multi-join" 
          onClick={() => setActiveTab('multi-join')}
          className={activeTab === 'multi-join' ? 'bg-game-accent text-white' : ''}
        >
          <Users className="w-4 h-4 mr-2" />
          Join Game
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="single">
        <SinglePlayerTab 
          isAuthenticated={isAuthenticated} 
          isGuest={isGuest}
          onStartSinglePlayer={onStartSinglePlayer}
        />
      </TabsContent>
      
      <TabsContent value="multi-create">
        <CreateMultiplayerTab 
          hostName={hostName}
          onHostNameChange={onHostNameChange}
          onCreateMultiplayerGame={onCreateMultiplayerGame}
        />
      </TabsContent>
      
      <TabsContent value="multi-join">
        <JoinMultiplayerTab 
          gameId={gameId}
          playerName={playerName}
          onGameIdChange={onGameIdChange}
          onPlayerNameChange={onPlayerNameChange}
          onJoinMultiplayerGame={onJoinMultiplayerGame}
        />
      </TabsContent>
    </Tabs>
  );
};

export default GameModeTabs;
