import React from 'react';
import { PlayerAttributes, PlayerRelationship } from '@/hooks/game-phases/types/player';

export interface PlayerData {
  id: string;
  name: string;
  image?: string;
  status?: 'hoh' | 'nominated' | 'veto' | 'safe' | 'evicted' | 'winner' | 'juror' | 'runner-up';
  powerup?: 'immunity' | 'nullify' | 'coup' | 'replay';
  attributes?: PlayerAttributes;
  relationships?: PlayerRelationship[];
  stats?: {
    hohWins?: number;
    povWins?: number;
    timesNominated?: number;
    daysInHouse?: number;
    juryVotes?: number;
    placement?: number;
  };
  alliances?: string[];
}

interface PlayerProfileProps {
  player: PlayerData;
  onClick?: () => void;
  selected?: boolean;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({ 
  player, 
  onClick, 
  selected = false, 
  showDetails = false,
  size = 'md'
}) => {
  // Determine size classes
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };
  
  // Determine status indicator
  const getStatusIndicator = () => {
    switch (player.status) {
      case 'hoh':
        return <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-1 rounded">HoH</div>;
      case 'veto':
        return <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold px-1 rounded">VETO</div>;
      case 'nominated':
        return <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1 rounded">NOM</div>;
      case 'evicted':
        return <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-md">
          <span className="text-white font-bold text-sm">EVICTED</span>
        </div>;
      case 'winner':
        return <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-1 rounded">WINNER</div>;
      case 'juror':
        return <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-1 rounded">JURY</div>;
      case 'runner-up':
        return <div className="absolute -top-2 -right-2 bg-gray-400 text-white text-xs font-bold px-1 rounded">RUNNER-UP</div>;
      default:
        return null;
    }
  };
  
  // Determine powerup indicator
  const getPowerupIndicator = () => {
    if (!player.powerup) return null;
    
    const powerupColors = {
      immunity: 'bg-green-500',
      nullify: 'bg-red-500',
      coup: 'bg-purple-500',
      replay: 'bg-blue-500'
    };
    
    return (
      <div className={`absolute -bottom-2 -left-2 ${powerupColors[player.powerup]} text-white text-xs font-bold px-1 rounded-full`}>
        {player.powerup.charAt(0).toUpperCase() + player.powerup.slice(1)}
      </div>
    );
  };
  
  // Generate a placeholder image if none provided
  const getPlayerImage = () => {
    if (player.image) {
      return player.image;
    }
    
    // Generate a placeholder with initials
    const initials = player.name.split(' ').map(n => n[0]).join('');
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
    const colorIndex = player.id.charCodeAt(0) % colors.length;
    
    return `https://ui-avatars.com/api/?name=${initials}&background=${colors[colorIndex].replace('bg-', '')}&color=fff`;
  };
  
  return (
    <div 
      className={`relative cursor-pointer transition-all duration-200 ${selected ? 'scale-110 ring-2 ring-game-accent' : 'hover:scale-105'}`}
      onClick={onClick}
    >
      <div className={`relative rounded-md overflow-hidden ${sizeClasses[size]}`}>
        <img 
          src={getPlayerImage()} 
          alt={player.name} 
          className={`w-full h-full object-cover ${player.status === 'evicted' ? 'grayscale' : ''}`}
        />
        {getStatusIndicator()}
        {getPowerupIndicator()}
      </div>
      
      {showDetails && (
        <div className="mt-2 text-center">
          <div className="font-semibold text-sm">{player.name}</div>
          {player.alliances && player.alliances.length > 0 && (
            <div className="text-xs text-gray-400">{player.alliances[0]}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerProfile;
