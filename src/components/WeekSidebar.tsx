
import React from 'react';

interface WeekSidebarProps {
  currentWeek: number;
  onWeekChange: (week: number) => void;
  phases: string[];
  activePhase: string;
  onPhaseChange: (phase: string) => void;
}

const WeekSidebar: React.FC<WeekSidebarProps> = ({ 
  currentWeek, 
  onWeekChange, 
  phases, 
  activePhase,
  onPhaseChange
}) => {
  const weekCount = 10;
  const weeks = Array.from({ length: weekCount }, (_, i) => i + 1);

  return (
    <div className="bg-game-dark border-r border-game-light/30 w-56 p-4 flex flex-col h-full animate-slide-in">
      <h2 className="text-xl text-red-500 mb-4 font-bold text-center">Week #{currentWeek}</h2>
      
      <div className="space-y-1 mb-6">
        {phases.map((phase) => (
          <button
            key={phase}
            className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200
              ${activePhase === phase 
                ? 'bg-red-500 text-white font-medium' 
                : 'text-gray-300 hover:bg-game-light/40'}`}
            onClick={() => onPhaseChange(phase)}
          >
            {phase}
          </button>
        ))}
      </div>
      
      <div className="mt-auto">
        <h3 className="text-gray-400 font-medium mb-2 text-sm">Jump to Week</h3>
        <div className="grid grid-cols-5 gap-1">
          {weeks.map((week) => (
            <button
              key={week}
              className={`w-full aspect-square flex items-center justify-center rounded-md transition-all
                ${currentWeek === week 
                  ? 'bg-red-500 text-white font-bold' 
                  : 'bg-game-light/20 text-gray-300 hover:bg-game-light/50'}`}
              onClick={() => onWeekChange(week)}
            >
              {week}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 gap-1 mt-2">
          <WeekButton label="Final HoH" onClick={() => onWeekChange(11)} isActive={currentWeek === 11} />
          <WeekButton label="Finale" onClick={() => onWeekChange(12)} isActive={currentWeek === 12} />
          <WeekButton label="Statistics" onClick={() => onWeekChange(13)} isActive={currentWeek === 13} />
        </div>
      </div>
    </div>
  );
};

interface WeekButtonProps {
  label: string;
  onClick: () => void;
  isActive: boolean;
}

const WeekButton: React.FC<WeekButtonProps> = ({ label, onClick, isActive }) => {
  return (
    <button
      className={`w-full py-2 rounded-md transition-all
        ${isActive 
          ? 'bg-red-500 text-white font-bold' 
          : 'bg-game-light/20 text-gray-300 hover:bg-game-light/50'}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default WeekSidebar;
