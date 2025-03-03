
import React from 'react';

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
      <h2 className="text-2xl font-bold text-center mb-6">{phase}</h2>
      <p className="text-center text-gray-300">
        {statusMessage || `This phase is not yet implemented.`}
      </p>
    </div>
  );
};

export default DefaultPhase;
