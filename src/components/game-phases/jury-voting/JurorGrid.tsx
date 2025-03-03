
import React from 'react';
import PlayerProfile from '@/components/PlayerProfile';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface JurorGridProps {
  jurors: PlayerData[];
  votes: Record<string, string>;
  selectedJuror: string | null;
  onJurorSelect: (jurorId: string) => void;
}

const JurorGrid: React.FC<JurorGridProps> = ({
  jurors,
  votes,
  selectedJuror,
  onJurorSelect
}) => {
  const hasVoted = (jurorId: string) => {
    return votes && votes[jurorId] !== undefined;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {jurors.map(juror => (
        <div 
          key={juror.id} 
          className={`relative cursor-pointer ${hasVoted(juror.id) ? 'opacity-50' : ''}`}
          onClick={() => !hasVoted(juror.id) ? onJurorSelect(juror.id) : null}
        >
          <PlayerProfile 
            player={juror} 
            size="md"
            selected={selectedJuror === juror.id}
          />
          {hasVoted(juror.id) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md">
              <span className="text-white font-bold">VOTED</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default JurorGrid;
