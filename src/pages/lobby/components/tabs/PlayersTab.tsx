
import React, { useState, useMemo } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import ProfileCard from '@/components/profile/ProfileCard';
import { PlayerData } from '@/components/PlayerProfileTypes';
import PlayerSearch from './PlayerSearch';

interface PlayersTabProps {
  onPlayerSelect: (player: PlayerData) => void;
}

const PlayersTab = ({ onPlayerSelect }: PlayersTabProps) => {
  const { players } = useGameContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = useMemo(() => {
    if (!searchTerm.trim()) return players;
    
    const term = searchTerm.toLowerCase();
    return players.filter(player => 
      player.name.toLowerCase().includes(term) ||
      (player.hometown && player.hometown.toLowerCase().includes(term)) ||
      (player.occupation && player.occupation.toLowerCase().includes(term))
    );
  }, [players, searchTerm]);

  return (
    <div>
      <PlayerSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      {filteredPlayers.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No players found matching "{searchTerm}"
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPlayers.map(player => (
            <ProfileCard 
              key={player.id} 
              player={player} 
              onClick={() => onPlayerSelect(player)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayersTab;
