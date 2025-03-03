
import React from 'react';
import PlayerProfile from '@/components/PlayerProfile';
import { PlayerData } from '@/components/PlayerProfileTypes';

interface SummarySectionProps {
  title: string;
  icon: React.ReactNode;
  players: PlayerData[];
  details?: string;
}

const SummarySection: React.FC<SummarySectionProps> = ({
  title,
  icon,
  players,
  details
}) => {
  return (
    <div className="bg-game-dark/30 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <span className="mr-2">{icon}</span>
        {title}
      </h3>
      
      <div className="flex flex-wrap gap-6 justify-center">
        {players.map(player => (
          <div key={player.id} className="flex flex-col items-center">
            <PlayerProfile player={player} size="md" />
            <div className="mt-2 text-center">
              <div className="text-sm font-semibold">{player.name}</div>
            </div>
          </div>
        ))}
      </div>
      
      {details && (
        <p className="text-center text-sm text-gray-400 mt-3">{details}</p>
      )}
    </div>
  );
};

export default SummarySection;
