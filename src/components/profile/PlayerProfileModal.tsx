
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useGameContext } from '@/contexts/GameContext';
import PlayerProfileDetails from './PlayerProfileDetails';
import ProfileEditDialog from './ProfileEditDialog';
import PlayerSettings from './PlayerSettings';
import { Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlayerProfileModalProps {
  open: boolean;
  onClose: () => void;
  player: PlayerData;
}

const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  open,
  onClose,
  player
}) => {
  const { currentPlayer, updateProfile, updateSettings, settings } = useGameContext();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const isCurrentPlayer = currentPlayer?.id === player.id;
  
  const handleEditProfile = () => {
    setShowEditProfile(true);
  };
  
  const handleEditProfileClose = () => {
    setShowEditProfile(false);
  };
  
  const handleSaveProfile = (updatedProfile: Partial<PlayerData>) => {
    updateProfile(updatedProfile);
  };
  
  const handleShowSettings = () => {
    setShowSettings(true);
  };
  
  const handleSettingsClose = () => {
    setShowSettings(false);
  };
  
  const handleSaveSettings = (newSettings: Partial<typeof settings>) => {
    updateSettings(newSettings);
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-game-dark text-white border-game-accent max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-game-accent flex items-center">
            <User className="mr-2 h-6 w-6" />
            Player Profile
            
            {isCurrentPlayer && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleShowSettings}
                className="ml-auto bg-transparent border-game-accent text-game-accent hover:bg-game-accent hover:text-black"
              >
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          <PlayerProfileDetails 
            player={player} 
            isCurrentPlayer={isCurrentPlayer}
            onEdit={isCurrentPlayer ? handleEditProfile : undefined}
          />
        </div>
        
        {isCurrentPlayer && (
          <>
            <ProfileEditDialog
              open={showEditProfile}
              onClose={handleEditProfileClose}
              player={player}
              onSave={handleSaveProfile}
            />
            
            <PlayerSettings
              open={showSettings}
              onClose={handleSettingsClose}
              settings={settings}
              onSave={handleSaveSettings}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlayerProfileModal;
