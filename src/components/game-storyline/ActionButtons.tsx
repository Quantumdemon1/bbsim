
import React from 'react';
import { Button } from '@/components/ui/button';
import { Book, Users } from 'lucide-react';

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
  );
};

export default ActionButtons;
