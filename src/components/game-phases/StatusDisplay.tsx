
import React from 'react';

interface StatusDisplayProps {
  week: number;
  phase: string;
  playerName: string | undefined;
  currentPlayerId: string | null;
  hoh: string | null;
  veto: string | null;
  nominees: string[];
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({
  week,
  phase,
  playerName,
  currentPlayerId,
  hoh,
  veto,
  nominees
}) => {
  return (
    <div className="mb-6 bg-game-medium rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Week {week}: {phase}</h2>
          <p className="text-gray-300">
            You are playing as {playerName || 'Human Player'}
            {hoh === currentPlayerId && " - You are the Head of Household!"}
            {veto === currentPlayerId && " - You hold the Power of Veto!"}
            {nominees.includes(currentPlayerId || '') && " - You are nominated for eviction!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatusDisplay;
