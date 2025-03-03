
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, Shield } from 'lucide-react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { useGameContext } from '@/contexts/GameContext';

interface PowerupsDialogProps {
  players: PlayerData[];
}

const PowerupsDialog: React.FC<PowerupsDialogProps> = ({ players }) => {
  const { awardPowerup, usePowerup } = useGameContext();
  const [powerupType, setPowerupType] = useState<PlayerData['powerup']>('immunity');
  const [playerForPowerup, setPlayerForPowerup] = useState<string | null>(null);

  const handleAwardPowerup = () => {
    if (playerForPowerup && powerupType) {
      awardPowerup(playerForPowerup, powerupType);
      setPlayerForPowerup(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-game-dark/80 border-purple-500 text-purple-400">
          <Zap className="mr-1" size={16} />
          Power-Ups
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-game-dark text-white border-purple-500">
        <DialogHeader>
          <DialogTitle>Power-Ups</DialogTitle>
          <DialogDescription className="text-gray-300">
            Award and manage special power-ups
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="border-b border-gray-700 pb-4">
            <h3 className="font-medium mb-2">Award Power-Up</h3>
            
            <select
              value={powerupType || ''}
              onChange={(e) => setPowerupType(e.target.value as PlayerData['powerup'])}
              className="w-full bg-game-medium border border-gray-600 rounded p-2 mb-2"
            >
              <option value="immunity">Immunity (Safe from eviction)</option>
              <option value="coup">Coup d'État (Replace HOH nominations)</option>
              <option value="replay">Competition Replay</option>
              <option value="nullify">Veto Nullifier</option>
            </select>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto mb-2">
              {players
                .filter(player => player.status !== 'evicted')
                .map(player => (
                  <div 
                    key={player.id}
                    className={`flex items-center p-1 cursor-pointer rounded text-sm ${
                      playerForPowerup === player.id ? 'bg-purple-500 text-white' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => setPlayerForPowerup(player.id)}
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
              className="bg-purple-600 hover:bg-purple-700 text-white w-full"
              onClick={handleAwardPowerup}
              disabled={!playerForPowerup || !powerupType}
            >
              Award Power-Up
            </Button>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Current Power-Ups</h3>
            
            {players.filter(p => p.powerup).length === 0 && (
              <p className="text-gray-400 text-sm">No houseguests currently have power-ups.</p>
            )}
            
            <div className="space-y-2">
              {players
                .filter(player => player.powerup && player.status !== 'evicted')
                .map(player => (
                  <div key={player.id} className="flex justify-between items-center border border-gray-700 rounded p-2">
                    <div className="flex items-center">
                      <img 
                        src={player.image} 
                        alt={player.name} 
                        className="w-8 h-8 rounded-full mr-2 object-cover" 
                      />
                      <div>
                        <div>{player.name}</div>
                        <div className="text-xs text-purple-400 flex items-center">
                          <Shield className="w-3 h-3 mr-1" />
                          {player.powerup === 'immunity' && 'Immunity'}
                          {player.powerup === 'coup' && "Coup d'État"}
                          {player.powerup === 'replay' && 'Competition Replay'}
                          {player.powerup === 'nullify' && 'Veto Nullifier'}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-game-dark border-purple-500 text-purple-400 hover:bg-purple-900"
                      onClick={() => usePowerup(player.id)}
                    >
                      Use Power
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PowerupsDialog;
