
import React from 'react';
import GameActionsToolbar from '@/components/game-ui/GameActionsToolbar';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { Button } from '@/components/ui/button';
import { Shield, Users, MessageCircle, Activity, Settings } from 'lucide-react';
import { useGameContext } from '@/hooks/useGameContext';

interface GameControlsProps {
  players: PlayerData[];
  dayCount?: number;
  actionsRemaining?: number;
  useAction?: () => boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ 
  players,
  dayCount = 1,
  actionsRemaining = 3,
  useAction
}) => {
  const { showChat, setShowChat } = useGameContext();
  
  const handleAction = (actionType: string) => {
    if (useAction && useAction()) {
      console.log(`Performing action: ${actionType}`);
      // Execute the specific action
      switch (actionType) {
        case 'socialize':
          // Trigger a social interaction
          break;
        case 'strategy':
          // Trigger a strategy discussion
          break;
        case 'explore':
          // Trigger house exploration
          break;
        case 'train':
          // Improve competition skills
          break;
      }
    }
  };
  
  return (
    <div className="flex flex-col bg-game-medium border-r border-game-accent w-16 px-2 py-4">
      <GameActionsToolbar players={players} />
      
      <div className="mt-6 flex flex-col space-y-4 items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 rounded-full bg-game-dark hover:bg-game-accent hover:text-black"
          onClick={() => handleAction('socialize')}
          disabled={actionsRemaining === 0}
        >
          <Users size={20} />
          <span className="sr-only">Socialize</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 rounded-full bg-game-dark hover:bg-game-accent hover:text-black"
          onClick={() => handleAction('strategy')}
          disabled={actionsRemaining === 0}
        >
          <Shield size={20} />
          <span className="sr-only">Strategy</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 rounded-full bg-game-dark hover:bg-game-accent hover:text-black"
          onClick={() => handleAction('explore')}
          disabled={actionsRemaining === 0}
        >
          <Activity size={20} />
          <span className="sr-only">Explore</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-12 w-12 rounded-full ${showChat ? 'bg-game-accent text-black' : 'bg-game-dark'} hover:bg-game-accent hover:text-black`}
          onClick={() => setShowChat(!showChat)}
        >
          <MessageCircle size={20} />
          <span className="sr-only">Chat</span>
        </Button>
      </div>
      
      <div className="mt-auto">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 rounded-full bg-gray-800 hover:bg-gray-700"
        >
          <Settings size={20} />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </div>
  );
};

export default GameControls;
