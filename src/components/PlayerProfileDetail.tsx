
import React from 'react';
import { PlayerData } from './PlayerProfileTypes';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Award, MapPin, Briefcase, Clock, Calendar } from 'lucide-react';

interface PlayerProfileDetailProps {
  player: PlayerData;
  isOpen: boolean;
  onClose: () => void;
}

const PlayerProfileDetail: React.FC<PlayerProfileDetailProps> = ({ 
  player, 
  isOpen, 
  onClose 
}) => {
  if (!player) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-game-dark text-white border-game-accent">
        <DialogHeader>
          <DialogTitle className="text-xl text-game-accent">Player Profile</DialogTitle>
          <DialogDescription className="text-gray-300">
            View detailed information about {player.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="col-span-1">
            <div className="w-full aspect-square rounded-md overflow-hidden bg-game-medium relative">
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
                <div className="flex items-center justify-center h-full">
                  <User size={64} className="text-white" />
                </div>
              )}

              {player.status && (
                <div className="absolute bottom-0 left-0 right-0 bg-game-accent/80 py-1 text-center text-sm font-medium">
                  {player.status.toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-2 space-y-2">
            <h3 className="text-xl font-bold">{player.name}</h3>
            
            <div className="flex items-center text-sm text-gray-300">
              {player.age && (
                <div className="flex items-center mr-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{player.age} years</span>
                </div>
              )}
              
              {player.hometown && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{player.hometown}</span>
                </div>
              )}
            </div>
            
            {player.occupation && (
              <div className="flex items-center text-sm text-gray-300">
                <Briefcase className="h-4 w-4 mr-1" />
                <span>{player.occupation}</span>
              </div>
            )}

            {player.stats && player.stats.daysInHouse > 0 && (
              <div className="flex items-center text-sm text-gray-300">
                <Clock className="h-4 w-4 mr-1" />
                <span>{player.stats.daysInHouse} days in house</span>
              </div>
            )}
          </div>
        </div>

        {player.bio && (
          <div className="border-t border-gray-700 pt-4 mt-2">
            <h4 className="font-medium mb-2">Bio</h4>
            <p className="text-sm text-gray-300">{player.bio}</p>
          </div>
        )}

        {player.stats && (
          <div className="border-t border-gray-700 pt-4 mt-4">
            <h4 className="font-medium mb-2 flex items-center">
              <Award className="h-4 w-4 mr-1 text-game-accent" />
              Game Stats
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">HoH Wins:</span>
                <span>{player.stats.hohWins || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">PoV Wins:</span>
                <span>{player.stats.povWins || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Times Nominated:</span>
                <span>{player.stats.timesNominated || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Comp Wins:</span>
                <span>{player.stats.competitionsWon || 0}</span>
              </div>
              {player.stats.placement && (
                <div className="flex justify-between col-span-2">
                  <span className="text-gray-400">Final Placement:</span>
                  <span>{player.stats.placement}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerProfileDetail;
