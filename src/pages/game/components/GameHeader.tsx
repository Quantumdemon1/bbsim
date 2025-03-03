
import React from 'react';
import { useGameContext } from '@/contexts/GameContext';
import { Bell, Users, Settings, Info, Crown, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AISettingsToggle from '@/components/game-ui/AISettingsToggle';

interface GameHeaderProps {
  showAdminPanel: boolean;
  setShowAdminPanel: (show: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
}

const GameHeader = ({ 
  showAdminPanel, 
  setShowAdminPanel,
  showNotifications,
  setShowNotifications
}: GameHeaderProps) => {
  const { isAdmin, gameState, currentWeek, notifications } = useGameContext();
  
  const unreadNotifications = notifications?.filter(n => !n.read).length || 0;
  
  return (
    <header className="bg-game-dark border-b border-game-light/20 h-16 p-3 flex items-center justify-between">
      <div className="flex items-center">
        <div className="text-lg font-bold text-white mr-4">
          Big Brother
        </div>
        
        <Separator orientation="vertical" className="h-8 bg-game-light/20 mx-2" />
        
        <div className="flex items-center">
          <div className="text-red-500 font-semibold">Week {currentWeek}</div>
          <Separator orientation="vertical" className="h-5 bg-game-light/20 mx-2" />
          <div className="text-gray-300 text-sm">{gameState === 'playing' ? 'In Progress' : 'Setup'}</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <AISettingsToggle className="mr-2" />
        
        {isAdmin && (
          <Button 
            variant="ghost" 
            size="icon"
            className={`relative ${showAdminPanel ? 'bg-red-950/40' : ''}`}
            onClick={() => setShowAdminPanel(!showAdminPanel)}
          >
            <Crown className="h-5 w-5" />
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </Button>
        
        <Button variant="ghost" size="icon">
          <Users className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon">
          <Info className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default GameHeader;
