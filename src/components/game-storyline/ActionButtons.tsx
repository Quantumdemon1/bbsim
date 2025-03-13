
import React from 'react';
import { Button } from '@/components/ui/button';
import { Book, Users, Network, MessageCircle } from 'lucide-react';

interface ActionButtonsProps {
  actionsRemaining: number;
  triggerDiaryRoomEvent: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  actionsRemaining, 
  triggerDiaryRoomEvent 
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      <Button 
        variant="outline" 
        className="flex items-center gap-2 justify-center bg-game-medium/30 hover:bg-game-medium/50 border-game-accent/30"
        onClick={triggerDiaryRoomEvent}
        disabled={actionsRemaining === 0}
      >
        <MessageCircle className="w-4 h-4" />
        Diary Room
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center gap-2 justify-center bg-game-medium/30 hover:bg-game-medium/50 border-game-accent/30"
        disabled={actionsRemaining === 0}
        // Simple no-op function instead of undefined
        onClick={() => console.log("Strategy button clicked")}
      >
        <Network className="w-4 h-4" />
        Strategy
      </Button>
    </div>
  );
};

export default ActionButtons;
