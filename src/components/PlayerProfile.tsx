
import React from 'react';
import { cn } from '@/lib/utils';
import { Shield, Star, UserRound } from 'lucide-react';
import { PlayerAttributes, PlayerRelationship } from '@/hooks/game-phases/types';

export interface PlayerData {
  id: string;
  name: string;
  image: string;
  status?: 'hoh' | 'nominated' | 'veto' | 'safe' | 'evicted';
  alliances?: string[];
  powerup?: 'immunity' | 'coup' | 'replay' | 'nullify';
  attributes?: PlayerAttributes;
  relationships?: PlayerRelationship[];
}

interface PlayerProfileProps {
  player: PlayerData;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  selected?: boolean;
  className?: string;
  showDetails?: boolean;
}

const DefaultAvatar = ({ size }: { size: 'sm' | 'md' | 'lg' }) => {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32
  };
  
  return (
    <div className={cn(
      'flex items-center justify-center w-full h-full bg-game-medium',
      'text-gray-400'
    )}>
      <UserRound size={sizeMap[size]} strokeWidth={1.5} />
    </div>
  );
};

const PlayerProfile: React.FC<PlayerProfileProps> = ({ 
  player, 
  size = 'md', 
  onClick,
  selected,
  className,
  showDetails = false
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

  const powerupIcons = {
    immunity: <Shield className="text-green-400" />,
    coup: <Star className="text-yellow-400" />,
    replay: <Star className="text-blue-400" />,
    nullify: <Shield className="text-red-400" />
  };

  // Check if image exists or is placeholder
  const hasValidImage = player.image && player.image !== '/placeholder.svg';

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
        {hasValidImage ? (
          <img 
            src={player.image} 
            alt={player.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.querySelector('.fallback-avatar')?.classList.remove('hidden');
              }
            }}
          />
        ) : (
          <DefaultAvatar size={size} />
        )}
        
        <div className={cn('fallback-avatar hidden', hasValidImage ? 'hidden' : '')}>
          <DefaultAvatar size={size} />
        </div>
        
        {player.status && (
          <div className={cn(
            'absolute bottom-0 left-0 right-0 py-1 text-center text-white font-medium text-xs',
            statusColors[player.status]
          )}>
            {player.status.toUpperCase()}
          </div>
        )}

        {player.powerup && (
          <div className="absolute top-1 right-1 bg-black/50 rounded-full p-1">
            {powerupIcons[player.powerup]}
          </div>
        )}
      </div>
      
      <div className={cn('text-center font-medium', fontSizeClasses[size])}>
        {player.name}
      </div>

      {showDetails && player.alliances && player.alliances.length > 0 && (
        <div className="text-xs text-gray-300 mt-1">
          Alliances: {player.alliances.join(', ')}
        </div>
      )}
    </div>
  );
};

export default PlayerProfile;
