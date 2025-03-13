
import React, { useEffect } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book, User, Users, Clock, AlertTriangle } from 'lucide-react';
import { usePlayerStorylineManager } from '@/hooks/game-phases/usePlayerStorylineManager';
import StoryEventDisplay from './StoryEventDisplay';

interface FirstPersonViewProps {
  currentPlayerId: string | null;
}

const FirstPersonView: React.FC<FirstPersonViewProps> = ({ currentPlayerId }) => {
  const { 
    players, 
    dayCount, 
    actionsRemaining,
    currentPhase
  } = useGameContext();
  
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
  
  const getStatusMessage = () => {
    switch (currentPhase) {
      case 'HoH Competition':
        return "The HoH competition will determine who has power this week.";
      case 'Nomination Ceremony':
        return "The Head of Household will soon nominate two players for eviction.";
      case 'PoV Competition':
        return "The Power of Veto competition could change the nominations.";
      case 'Veto Ceremony':
        return "The Power of Veto holder will decide whether to use their power.";
      case 'Eviction Voting':
        return "One of the nominees will be evicted from the house.";
      default:
        return "It's Day " + dayCount + " in the Big Brother house.";
    }
  };
  
  const getMoodIcon = () => {
    switch (playerMood) {
      case 'focused': return '🧠';
      case 'expressive': return '😊';
      case 'cunning': return '😏';
      case 'excited': return '😃';
      case 'nervous': return '😰';
      case 'angry': return '😠';
      default: return '😐';
    }
  };
  
  return (
    <div className="p-4 bg-game-dark text-white rounded-lg">
      {/* Player Status Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">{currentPlayerName} {getMoodIcon()}</h2>
          <p className="text-gray-300 text-sm">Day {dayCount} | {currentPhase}</p>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> 
            {actionsRemaining} Actions
          </Badge>
          
          {actionsRemaining === 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> 
              No Actions Left
            </Badge>
          )}
        </div>
      </div>
      
      {/* Game Status */}
      <div className="bg-game-medium p-3 rounded-md mb-4">
        <p className="italic text-gray-300">{getStatusMessage()}</p>
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 justify-center"
          onClick={() => triggerDiaryRoomEvent()}
          disabled={actionsRemaining === 0}
        >
          <Book className="w-4 h-4" />
          Diary Room
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2 justify-center"
          disabled={actionsRemaining === 0}
          // Placeholder for future functionality
          onClick={() => {}}
        >
          <Users className="w-4 h-4" />
          Alliances
        </Button>
      </div>
      
      {/* Relationships */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Houseguests</h3>
        
        {allies.length > 0 && (
          <div className="mb-2">
            <h4 className="text-sm text-green-400 font-medium">Allies</h4>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {allies.map(player => (
                <Button 
                  key={player.id}
                  size="sm"
                  variant="ghost" 
                  className="justify-start text-green-200 hover:text-green-100 hover:bg-green-900/30"
                  onClick={() => triggerSocialEvent(player.id)}
                  disabled={actionsRemaining === 0}
                >
                  <User className="w-3 h-3 mr-2" />
                  {player.name}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {neutralPlayers.length > 0 && (
          <div className="mb-2">
            <h4 className="text-sm text-gray-400 font-medium">Neutral</h4>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {neutralPlayers.map(player => (
                <Button 
                  key={player.id}
                  size="sm"
                  variant="ghost" 
                  className="justify-start text-gray-200 hover:text-gray-100 hover:bg-gray-700/30"
                  onClick={() => triggerSocialEvent(player.id)}
                  disabled={actionsRemaining === 0}
                >
                  <User className="w-3 h-3 mr-2" />
                  {player.name}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {rivals.length > 0 && (
          <div>
            <h4 className="text-sm text-red-400 font-medium">Rivals</h4>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {rivals.map(player => (
                <Button 
                  key={player.id}
                  size="sm"
                  variant="ghost" 
                  className="justify-start text-red-200 hover:text-red-100 hover:bg-red-900/30"
                  onClick={() => triggerSocialEvent(player.id)}
                  disabled={actionsRemaining === 0}
                >
                  <User className="w-3 h-3 mr-2" />
                  {player.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
      
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
