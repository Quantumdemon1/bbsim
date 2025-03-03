
import React from 'react';
import AllianceManagementDialog from '../game-dialogs/AllianceManagementDialog';
import PowerupsDialog from '../game-dialogs/PowerupsDialog';
import PlayerAttributesDialog from '../game-dialogs/PlayerAttributesDialog';
import RelationshipsDialog from '../game-dialogs/RelationshipsDialog';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { SaveGameManager } from './SaveGameManager';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, User, Heart, Users, Zap, Save } from 'lucide-react';

interface GameActionsToolbarProps {
  players: PlayerData[];
}

const GameActionsToolbar: React.FC<GameActionsToolbarProps> = ({ players }) => {
  const [openDialog, setOpenDialog] = React.useState<string | null>(null);

  const handleOpenDialog = (dialogName: string) => {
    setOpenDialog(dialogName);
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  return (
    <div className="fixed top-16 right-4 z-10 flex flex-wrap justify-end gap-2">
      <div className="flex flex-wrap gap-2 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-game-dark/80 border-game-accent text-white">
              Game Actions <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-game-dark text-white border-game-accent w-56">
            <DropdownMenuItem 
              className="flex items-center cursor-pointer" 
              onClick={() => handleOpenDialog('attributes')}
            >
              <User className="mr-2 h-4 w-4 text-red-400" />
              <span>Attributes</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center cursor-pointer" 
              onClick={() => handleOpenDialog('relationships')}
            >
              <Heart className="mr-2 h-4 w-4 text-game-accent" />
              <span>Relationships</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center cursor-pointer" 
              onClick={() => handleOpenDialog('alliances')}
            >
              <Users className="mr-2 h-4 w-4 text-game-accent" />
              <span>Alliances</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center cursor-pointer" 
              onClick={() => handleOpenDialog('powerups')}
            >
              <Zap className="mr-2 h-4 w-4 text-purple-400" />
              <span>Power-Ups</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <SaveGameManager />
      </div>

      {openDialog === 'attributes' && (
        <PlayerAttributesDialog 
          players={players}
          onClose={handleCloseDialog}
        />
      )}

      {openDialog === 'relationships' && (
        <RelationshipsDialog 
          players={players} 
          onClose={handleCloseDialog}
        />
      )}

      {openDialog === 'alliances' && (
        <AllianceManagementDialog 
          players={players} 
          onClose={handleCloseDialog}
        />
      )}

      {openDialog === 'powerups' && (
        <PowerupsDialog 
          players={players} 
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
};

export default GameActionsToolbar;
