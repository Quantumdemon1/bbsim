
import React from 'react';
import { Button } from "@/components/ui/button";
import { useGameContext } from '@/contexts/GameContext';

interface GameModeTabsProps {
  isAuthenticated: boolean;
  isGuest: boolean;
  onStartSinglePlayer: () => void;
}

const GameModeTabs: React.FC<GameModeTabsProps> = ({ isAuthenticated, isGuest, onStartSinglePlayer }) => {
  return (
    <div className="flex space-x-4">
      <Button 
        variant="outline" 
        onClick={onStartSinglePlayer} 
        disabled={isGuest}
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
