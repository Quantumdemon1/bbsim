
import React from 'react';
import { Hourglass } from 'lucide-react';

interface DefaultPhaseProps {
  phase: string;
  statusMessage: string;
}

const DefaultPhase: React.FC<DefaultPhaseProps> = ({
  phase,
  statusMessage
}) => {
  return (
    <div className="glass-panel p-6 w-full max-w-4xl mx-auto animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">{phase}</h2>
      
      <div className="flex flex-col items-center justify-center py-8">
        <Hourglass className="w-16 h-16 text-game-accent animate-pulse-subtle mb-4" />
        <p className="text-center text-gray-300 text-lg">
          {statusMessage || `This phase is not yet implemented.`}
        </p>
      </div>
    </div>
  );
};

export default DefaultPhase;
