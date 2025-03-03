
import React from 'react';
import { cn } from '@/lib/utils';

export interface PlayerData {
  id: string;
  name: string;
  image: string;
  status?: 'hoh' | 'nominated' | 'veto' | 'safe' | 'evicted';
}

interface PlayerProfileProps {
  player: PlayerData;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({ 
  player, 
  size = 'md', 
  onClick,
  selected,
  className
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32'
  };
  
  const fontSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  const statusColors = {
    hoh: 'bg-yellow-500',
    nominated: 'bg-red-500',
    veto: 'bg-purple-500',
    safe: 'bg-green-500',
    evicted: 'bg-gray-500'
  };

  return (
    <div 
      className={cn(
        'flex flex-col items-center gap-2 group transition-all duration-300', 
        onClick ? 'cursor-pointer hover-lift' : '',
        className
      )}
      onClick={onClick}
    >
      <div className={cn(
        'relative rounded-md overflow-hidden border-2 transition-all duration-300',
        sizeClasses[size],
        selected ? 'border-game-accent' : 'border-transparent group-hover:border-white/30'
      )}>
        <img 
          src={player.image || '/placeholder.svg'} 
          alt={player.name}
          className="w-full h-full object-cover"
        />
        
        {player.status && (
          <div className={cn(
            'absolute bottom-0 left-0 right-0 py-1 text-center text-white font-medium text-xs',
            statusColors[player.status]
          )}>
            {player.status.toUpperCase()}
          </div>
        )}
      </div>
      
      <div className={cn('text-center font-medium', fontSizeClasses[size])}>
        {player.name}
      </div>
    </div>
  );
};

export default PlayerProfile;
