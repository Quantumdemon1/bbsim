
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from 'lucide-react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useGameContext } from '@/hooks/useGameContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import our newly created components
import PlayerSelectionSidebar from './player-attributes/PlayerSelectionSidebar';
import AttributeEditor from './player-attributes/AttributeEditor';
import GameSettingsPanel from './player-attributes/GameSettingsPanel';

interface PlayerAttributesDialogProps {
  players: PlayerData[];
  onClose?: () => void;
}

const PlayerAttributesDialog: React.FC<PlayerAttributesDialogProps> = ({ players, onClose }) => {
  const { updatePlayerAttributes } = useGameContext();
  const [open, setOpen] = useState<boolean>(onClose ? true : false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('attributes');

  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && onClose) {
      onClose();
    }
  };

  const handleUpdateAttribute = (
    playerId: string, 
    attribute: string, 
    value: number | boolean | PlayerData['status']
  ) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const updatedAttributes = {
      ...player,
      [attribute]: value
    };

    updatePlayerAttributes(playerId, updatedAttributes);
  };

  const handleRandomizeAttributes = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const randomAttributes = {
      ...player,
      physical: Math.floor(Math.random() * 10) + 1,
      mental: Math.floor(Math.random() * 10) + 1,
      social: Math.floor(Math.random() * 10) + 1,
      endurance: Math.floor(Math.random() * 10) + 1,
      strategic: Math.floor(Math.random() * 10) + 1,
      loyalty: Math.floor(Math.random() * 10) + 1,
      temperament: Math.floor(Math.random() * 10) + 1,
    };

    updatePlayerAttributes(playerId, randomAttributes);
  };

  const handleRandomizeAllAttributes = () => {
    players.forEach(player => {
      handleRandomizeAttributes(player.id);
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      {!onClose && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="bg-game-dark/80 border-red-500 text-red-400">
            <User className="mr-1" size={16} />
            Attributes
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="bg-game-dark text-white border-red-500 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Player Attributes</DialogTitle>
          <DialogDescription className="text-gray-300">
            Customize player attributes and game settings
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="attributes" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="attributes">Player Attributes</TabsTrigger>
            <TabsTrigger value="settings">Game Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="attributes" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Player Selection Sidebar Component */}
              <PlayerSelectionSidebar 
                players={players} 
                selectedPlayer={selectedPlayer}
                setSelectedPlayer={setSelectedPlayer}
                onRandomizeSelected={() => selectedPlayer && handleRandomizeAttributes(selectedPlayer)}
                onRandomizeAll={handleRandomizeAllAttributes}
              />
              
              <div className="bg-game-medium p-4 rounded-lg col-span-1 md:col-span-2">
                {selectedPlayer ? (
                  <AttributeEditor 
                    player={players.find(p => p.id === selectedPlayer)!}
                    onUpdateAttribute={handleUpdateAttribute}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    Select a player to edit their attributes
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <GameSettingsPanel />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerAttributesDialog;
