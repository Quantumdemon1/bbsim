
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from 'lucide-react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useGameContext } from '@/hooks/useGameContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  const handleUpdateAttribute = (playerId: string, attribute: string, value: number | boolean) => {
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
              <div className="bg-game-medium p-4 rounded-lg col-span-1">
                <h3 className="font-medium mb-2">Select Player</h3>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {players.map(player => (
                      <div 
                        key={player.id}
                        className={`flex items-center p-2 cursor-pointer rounded ${
                          selectedPlayer === player.id ? 'bg-red-500/20 border border-red-500' : 'hover:bg-gray-700'
                        }`}
                        onClick={() => setSelectedPlayer(player.id)}
                      >
                        <img 
                          src={player.image} 
                          alt={player.name} 
                          className="w-10 h-10 rounded-full mr-2 object-cover" 
                        />
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-xs text-gray-400">
                            {player.status === 'evicted' ? 'Evicted' : player.status || 'Active'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="mt-4 space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => selectedPlayer && handleRandomizeAttributes(selectedPlayer)}
                    disabled={!selectedPlayer}
                  >
                    Randomize Selected
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={handleRandomizeAllAttributes}
                  >
                    Randomize All Players
                  </Button>
                </div>
              </div>
              
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
            <div className="bg-game-medium p-4 rounded-lg">
              <h3 className="font-medium mb-4">Game Settings</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Game Difficulty</Label>
                    <Slider 
                      id="difficulty"
                      defaultValue={[5]} 
                      max={10} 
                      step={1}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Easy</span>
                      <span>Normal</span>
                      <span>Hard</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="aiAggressiveness">AI Aggressiveness</Label>
                    <Slider 
                      id="aiAggressiveness"
                      defaultValue={[5]} 
                      max={10} 
                      step={1}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Passive</span>
                      <span>Balanced</span>
                      <span>Aggressive</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableTwists">Enable Game Twists</Label>
                      <div className="text-xs text-gray-400">Allow unexpected events during gameplay</div>
                    </div>
                    <Switch id="enableTwists" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enablePowerups">Enable Power-Ups</Label>
                      <div className="text-xs text-gray-400">Allow players to earn and use special abilities</div>
                    </div>
                    <Switch id="enablePowerups" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="realisticVoting">Realistic Voting</Label>
                      <div className="text-xs text-gray-400">AI players vote based on relationships and strategy</div>
                    </div>
                    <Switch id="realisticVoting" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

interface AttributeEditorProps {
  player: PlayerData;
  onUpdateAttribute: (playerId: string, attribute: string, value: number | boolean) => void;
}

const AttributeEditor: React.FC<AttributeEditorProps> = ({ player, onUpdateAttribute }) => {
  const attributes = [
    { id: 'physical', name: 'Physical', description: 'Strength, agility, and athletic ability' },
    { id: 'mental', name: 'Mental', description: 'Intelligence, puzzle-solving, and memory' },
    { id: 'social', name: 'Social', description: 'Charisma, persuasion, and likability' },
    { id: 'endurance', name: 'Endurance', description: 'Stamina and ability to withstand challenges' },
    { id: 'strategic', name: 'Strategic', description: 'Game awareness and planning ability' },
    { id: 'loyalty', name: 'Loyalty', description: 'Tendency to remain loyal to allies' },
    { id: 'temperament', name: 'Temperament', description: 'Emotional stability under pressure' },
  ];

  const statusOptions = ['hoh', 'nominated', 'veto', 'safe', 'evicted'];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <img 
          src={player.image} 
          alt={player.name} 
          className="w-16 h-16 rounded-full object-cover border-2 border-red-500" 
        />
        <div>
          <h3 className="text-lg font-medium">{player.name}</h3>
          <div className="flex space-x-2 mt-1">
            <select
              value={player.status || 'safe'}
              onChange={(e) => onUpdateAttribute(player.id, 'status', e.target.value as PlayerData['status'])}
              className="bg-game-dark border border-gray-700 rounded text-sm p-1"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            
            <div className="flex items-center space-x-1">
              <Label htmlFor={`isHuman-${player.id}`} className="text-sm">Human Player</Label>
              <Switch 
                id={`isHuman-${player.id}`}
                checked={player.isHuman || false}
                onCheckedChange={(checked) => onUpdateAttribute(player.id, 'isHuman', checked)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {attributes.map(attr => {
          const attrValue = (player[attr.id as keyof PlayerData] as number) || 5;
          return (
            <div key={attr.id} className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor={`${attr.id}-${player.id}`} className="text-sm">
                  {attr.name}
                </Label>
                <span className="text-sm font-medium">{attrValue}</span>
              </div>
              <Slider 
                id={`${attr.id}-${player.id}`}
                min={1}
                max={10}
                step={1}
                value={[attrValue]}
                onValueChange={([value]) => onUpdateAttribute(player.id, attr.id, value)}
              />
              <p className="text-xs text-gray-400">{attr.description}</p>
            </div>
          );
        })}
      </div>
      
      <div className="pt-2 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor={`isAdmin-${player.id}`}>Admin Privileges</Label>
            <div className="text-xs text-gray-400">Can control game and make admin decisions</div>
          </div>
          <Switch 
            id={`isAdmin-${player.id}`}
            checked={player.isAdmin || false}
            onCheckedChange={(checked) => onUpdateAttribute(player.id, 'isAdmin', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerAttributesDialog;
