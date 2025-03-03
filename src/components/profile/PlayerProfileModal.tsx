import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlayerData } from '@/components/PlayerProfileTypes';
import PlayerProfileDetails from './PlayerProfileDetails';
import AIPlayerProfile from './AIPlayerProfile';

interface PlayerProfileModalProps {
  open: boolean;
  onClose: () => void;
  player: PlayerData;
}

const PlayerProfileModal = ({ open, onClose, player }: PlayerProfileModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{player.name}'s Profile</DialogTitle>
        </DialogHeader>
        
        <PlayerProfileDetails player={player} />
        
        {(!player.isHuman && !player.isAdmin) && (
          <AIPlayerProfile player={player} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlayerProfileModal;
