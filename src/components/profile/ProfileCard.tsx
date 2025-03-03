
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PlayerData } from '@/components/PlayerProfileTypes';
import { User, Trophy, Shield } from 'lucide-react';

interface ProfileCardProps {
  player: PlayerData;
  onClick?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  player,
  onClick
}) => {
  return (
    <Card 
      className="bg-game-dark border-game-accent/50 hover:border-game-accent transition-all cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="aspect-[4/3] bg-game-medium relative">
        {player.image ? (
          <img 
            src={player.image} 
            alt={player.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="h-16 w-16 text-gray-400" />
          </div>
        )}
        
        {player.status && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {player.status === 'hoh' ? 'HoH' : 
             player.status === 'veto' ? 'Veto Holder' : 
             player.status === 'nominated' ? 'Nominated' : 
             player.status === 'evicted' ? 'Evicted' : 
             player.status === 'winner' ? 'Winner' : 
             player.status === 'juror' ? 'Juror' : ''}
          </div>
        )}
      </div>
      
      <CardContent className="p-3">
        <div className="font-semibold text-white mb-1">{player.name}</div>
        
        <div className="text-xs text-gray-400 flex items-center">
          {player.hometown && (
            <span className="inline-block mr-2">{player.hometown}</span>
          )}
          {player.age && (
            <span className="inline-block mr-2">{player.age} years</span>
          )}
          {player.occupation && (
            <span className="inline-block">{player.occupation}</span>
          )}
        </div>
        
        <div className="flex items-center mt-2 text-xs">
          {player.stats && (player.stats.hohWins || player.stats.povWins) && (
            <div className="flex items-center mr-3">
              <Trophy className="h-3 w-3 text-yellow-500 mr-1" />
              <span className="text-gray-300">
                {(player.stats.hohWins || 0) + (player.stats.povWins || 0)}
              </span>
            </div>
          )}
          
          {player.alliances && player.alliances.length > 0 && (
            <div className="flex items-center">
              <Shield className="h-3 w-3 text-blue-500 mr-1" />
              <span className="text-gray-300">{player.alliances.length}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
