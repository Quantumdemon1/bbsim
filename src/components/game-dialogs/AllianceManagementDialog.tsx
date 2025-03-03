
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users } from 'lucide-react';
import { PlayerData } from '@/components/PlayerProfile';
import { useGameContext } from '@/contexts/GameContext';

interface AllianceManagementDialogProps {
  players: PlayerData[];
}

const AllianceManagementDialog: React.FC<AllianceManagementDialogProps> = ({ players }) => {
  const { alliances, createAlliance, addToAlliance, removeFromAlliance } = useGameContext();
  const [allianceName, setAllianceName] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [selectedAlliance, setSelectedAlliance] = useState<string | null>(null);

  const handleCreateAlliance = () => {
    if (allianceName && selectedPlayers.length >= 2) {
      createAlliance(allianceName, selectedPlayers);
      setAllianceName('');
      setSelectedPlayers([]);
    }
  };

  const handleSelectPlayer = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    } else {
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
  };

  const handleAddToAlliance = (playerId: string) => {
    if (selectedAlliance) {
      addToAlliance(selectedAlliance, playerId);
    }
  };

  const handleRemoveFromAlliance = (playerId: string) => {
    if (selectedAlliance) {
      removeFromAlliance(selectedAlliance, playerId);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-game-dark/80 border-game-accent text-game-accent">
          <Users className="mr-1" size={16} />
          Alliances
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-game-dark text-white border-game-accent">
        <DialogHeader>
          <DialogTitle>Manage Alliances</DialogTitle>
          <DialogDescription className="text-gray-300">
            Create and manage alliances between houseguests
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="border-b border-gray-700 pb-4">
            <h3 className="font-medium mb-2">Create New Alliance</h3>
            <input
              type="text"
              value={allianceName}
              onChange={(e) => setAllianceName(e.target.value)}
              placeholder="Alliance Name"
              className="w-full bg-game-medium border border-gray-600 rounded p-2 mb-2"
            />
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto mb-2">
              {players
                .filter(player => player.status !== 'evicted')
                .map(player => (
                  <div 
                    key={player.id}
                    className={`flex items-center p-1 cursor-pointer rounded text-sm ${
                      selectedPlayers.includes(player.id) ? 'bg-game-accent text-black' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => handleSelectPlayer(player.id)}
                  >
                    <img 
                      src={player.image} 
                      alt={player.name} 
                      className="w-6 h-6 rounded-full mr-1 object-cover" 
                    />
                    <span className="truncate">{player.name}</span>
                  </div>
                ))}
            </div>
            
            <Button 
              variant="outline" 
              className="bg-game-accent hover:bg-game-highlight text-black w-full"
              onClick={handleCreateAlliance}
              disabled={!allianceName || selectedPlayers.length < 2}
            >
              Create Alliance
            </Button>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Current Alliances</h3>
            
            {alliances.length === 0 && (
              <p className="text-gray-400 text-sm">No alliances have been formed yet.</p>
            )}
            
            <div className="space-y-3">
              {alliances.map(alliance => (
                <div 
                  key={alliance.id} 
                  className={`border border-gray-700 rounded p-2 cursor-pointer ${
                    selectedAlliance === alliance.id ? 'border-game-accent bg-game-dark/50' : ''
                  }`}
                  onClick={() => setSelectedAlliance(alliance.id)}
                >
                  <h4 className="font-medium">{alliance.name}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {alliance.members.map(memberId => {
                      const member = players.find(p => p.id === memberId);
                      return member ? (
                        <div key={memberId} className="flex items-center bg-gray-800 rounded-full px-2 py-1 text-xs">
                          <img 
                            src={member.image} 
                            alt={member.name} 
                            className="w-4 h-4 rounded-full mr-1 object-cover" 
                          />
                          <span>{member.name}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AllianceManagementDialog;
