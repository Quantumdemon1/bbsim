
import React from 'react';
import { Button } from "@/components/ui/button";
import { useGameContext } from '@/contexts/useGameContext';

interface GameModeTabsProps {
  isAuthenticated: boolean;
  isGuest: boolean;
  onStartSinglePlayer: () => void;
  activeTab?: "single" | "multi-create" | "multi-join";
  setActiveTab?: React.Dispatch<React.SetStateAction<"single" | "multi-create" | "multi-join">>;
  hostName?: string;
  gameId?: string;
  setHostName?: React.Dispatch<React.SetStateAction<string>>;
  setGameId?: React.Dispatch<React.SetStateAction<string>>;
  onCreateMultiplayerGame?: () => void;
  onJoinMultiplayerGame?: () => void;
}

const GameModeTabs: React.FC<GameModeTabsProps> = ({ 
  isAuthenticated, 
  isGuest, 
  onStartSinglePlayer 
}) => {
  const { isAdmin } = useGameContext();
  
  return (
    <div className="flex space-x-4">
      <Button 
        variant="outline" 
        onClick={onStartSinglePlayer} 
        disabled={isGuest && !isAdmin}
      >
        Start Single Player
      </Button>
      {isAuthenticated && (
        <Button variant="outline">
          Start Multiplayer
        </Button>
      )}
    </div>
  );
};

export default GameModeTabs;
