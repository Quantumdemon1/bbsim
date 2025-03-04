
import React from 'react';
import { useToast } from '@/components/ui/use-toast';

interface DayTrackerProps {
  dayCount: number;
  actionsRemaining: number;
  advanceDay: () => void;
}

const DayTracker: React.FC<DayTrackerProps> = ({ 
  dayCount, 
  actionsRemaining, 
  advanceDay 
}) => {
  return (
    <div className="bg-game-dark border-b border-game-accent px-4 py-2 flex justify-between items-center">
      <div className="flex space-x-4 items-center">
        <span className="text-game-accent">Day {dayCount}</span>
        <span className="text-white">Actions: {actionsRemaining}/3</span>
      </div>
      <button
        className="px-3 py-1 bg-game-accent text-black rounded hover:bg-game-highlight transition-colors"
        onClick={advanceDay}
        disabled={actionsRemaining > 0}
      >
        {actionsRemaining > 0 ? "Use All Actions First" : "Next Day"}
      </button>
    </div>
  );
};

export default DayTracker;
