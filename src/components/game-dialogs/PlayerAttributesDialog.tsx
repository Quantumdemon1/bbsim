
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, UserCog } from 'lucide-react';
import { PlayerData } from '@/components/PlayerProfile';
import { useGameContext } from '@/contexts/GameContext';
import { attributeLevels } from '@/hooks/game-phases/types';

interface PlayerAttributesDialogProps {
  players: PlayerData[];
}

const PlayerAttributesDialog: React.FC<PlayerAttributesDialogProps> = ({ players }) => {
  const { updatePlayerAttributes } = useGameContext();
  const [activePlayer, setActivePlayer] = useState<PlayerData | null>(null);
  
  const handleRandomizeAll = () => {
    const updatedPlayers = players.map(player => {
      return {
        ...player,
        attributes: {
          general: Math.floor(Math.random() * 5) + 1,
          physical: Math.floor(Math.random() * 5) + 1,
          endurance: Math.floor(Math.random() * 5) + 1,
          mentalQuiz: Math.floor(Math.random() * 5) + 1,
          strategic: Math.floor(Math.random() * 5) + 1,
          loyalty: Math.floor(Math.random() * 5) + 1,
          social: Math.floor(Math.random() * 5) + 1,
          temperament: Math.floor(Math.random() * 5) + 1
        }
      };
    });
    
    updatedPlayers.forEach(player => {
      if (player.attributes) {
        updatePlayerAttributes(player.id, player.attributes);
      }
    });
  };
  
  const handleResetAll = () => {
    const updatedPlayers = players.map(player => {
      return {
        ...player,
        attributes: {
          general: 3,
          physical: 3,
          endurance: 3,
          mentalQuiz: 3,
          strategic: 3,
          loyalty: 3,
          social: 3,
          temperament: 3
        }
      };
    });
    
    updatedPlayers.forEach(player => {
      if (player.attributes) {
        updatePlayerAttributes(player.id, player.attributes);
      }
    });
  };
  
  const handleAttributeChange = (playerId: string, attributeName: string, value: number) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    const updatedAttributes = {
      ...(player.attributes || {
        general: 3,
        physical: 3,
        endurance: 3,
        mentalQuiz: 3,
        strategic: 3,
        loyalty: 3,
        social: 3,
        temperament: 3
      }),
      [attributeName]: value
    };
    
    updatePlayerAttributes(playerId, updatedAttributes);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-game-dark/80 border-game-accent text-game-accent">
          <UserCog className="mr-1" size={16} />
          Attributes
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-game-dark text-white border-game-accent max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Player Attributes</DialogTitle>
          <DialogDescription className="text-gray-300">
            Set competition abilities and other attributes for each houseguest
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-lg font-medium mb-4">Competition Abilities</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-2">Name</th>
                    <th className="py-2 px-2">General</th>
                    <th className="py-2 px-2">Physical</th>
                    <th className="py-2 px-2">Endurance</th>
                    <th className="py-2 px-2">Mental/Quiz</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map(player => (
                    <tr key={`comp-${player.id}`} className="border-b border-gray-800">
                      <td className="py-2 px-2 flex items-center">
                        <img src={player.image} alt={player.name} className="w-8 h-8 rounded-full mr-2 object-cover" />
                        {player.name}
                      </td>
                      <td className="py-2 px-2">
                        <select 
                          className="w-full bg-game-medium border border-gray-700 rounded p-1"
                          value={(player.attributes?.general || 3)}
                          onChange={(e) => handleAttributeChange(player.id, 'general', parseInt(e.target.value))}
                        >
                          {attributeLevels.map(level => (
                            <option key={`general-${player.id}-${level.value}`} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-2">
                        <select 
                          className="w-full bg-game-medium border border-gray-700 rounded p-1"
                          value={(player.attributes?.physical || 3)}
                          onChange={(e) => handleAttributeChange(player.id, 'physical', parseInt(e.target.value))}
                        >
                          {attributeLevels.map(level => (
                            <option key={`physical-${player.id}-${level.value}`} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-2">
                        <select 
                          className="w-full bg-game-medium border border-gray-700 rounded p-1"
                          value={(player.attributes?.endurance || 3)}
                          onChange={(e) => handleAttributeChange(player.id, 'endurance', parseInt(e.target.value))}
                        >
                          {attributeLevels.map(level => (
                            <option key={`endurance-${player.id}-${level.value}`} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-2">
                        <select 
                          className="w-full bg-game-medium border border-gray-700 rounded p-1"
                          value={(player.attributes?.mentalQuiz || 3)}
                          onChange={(e) => handleAttributeChange(player.id, 'mentalQuiz', parseInt(e.target.value))}
                        >
                          {attributeLevels.map(level => (
                            <option key={`mentalQuiz-${player.id}-${level.value}`} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-center mt-4 gap-4">
              <Button
                variant="outline"
                className="bg-game-medium hover:bg-gray-700"
                onClick={handleRandomizeAll}
              >
                Randomize All
              </Button>
              <Button
                variant="outline"
                className="bg-game-medium hover:bg-gray-700"
                onClick={handleResetAll}
              >
                Reset All
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Other Attributes</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-2">Name</th>
                    <th className="py-2 px-2">Strategic Ability</th>
                    <th className="py-2 px-2">Loyalty Level</th>
                    <th className="py-2 px-2">Social Skills</th>
                    <th className="py-2 px-2">Temperament</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map(player => (
                    <tr key={`other-${player.id}`} className="border-b border-gray-800">
                      <td className="py-2 px-2 flex items-center">
                        <img src={player.image} alt={player.name} className="w-8 h-8 rounded-full mr-2 object-cover" />
                        {player.name}
                      </td>
                      <td className="py-2 px-2">
                        <select 
                          className="w-full bg-game-medium border border-gray-700 rounded p-1"
                          value={(player.attributes?.strategic || 3)}
                          onChange={(e) => handleAttributeChange(player.id, 'strategic', parseInt(e.target.value))}
                        >
                          {attributeLevels.map(level => (
                            <option key={`strategic-${player.id}-${level.value}`} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-2">
                        <select 
                          className="w-full bg-game-medium border border-gray-700 rounded p-1"
                          value={(player.attributes?.loyalty || 3)}
                          onChange={(e) => handleAttributeChange(player.id, 'loyalty', parseInt(e.target.value))}
                        >
                          {attributeLevels.map(level => (
                            <option key={`loyalty-${player.id}-${level.value}`} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-2">
                        <select 
                          className="w-full bg-game-medium border border-gray-700 rounded p-1"
                          value={(player.attributes?.social || 3)}
                          onChange={(e) => handleAttributeChange(player.id, 'social', parseInt(e.target.value))}
                        >
                          {attributeLevels.map(level => (
                            <option key={`social-${player.id}-${level.value}`} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-2">
                        <select 
                          className="w-full bg-game-medium border border-gray-700 rounded p-1"
                          value={(player.attributes?.temperament || 3)}
                          onChange={(e) => handleAttributeChange(player.id, 'temperament', parseInt(e.target.value))}
                        >
                          {attributeLevels.map(level => (
                            <option key={`temperament-${player.id}-${level.value}`} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-center mt-4 gap-4">
              <Button
                variant="outline"
                className="bg-game-medium hover:bg-gray-700"
                onClick={handleRandomizeAll}
              >
                Randomize All
              </Button>
              <Button
                variant="outline"
                className="bg-game-medium hover:bg-gray-700"
                onClick={handleResetAll}
              >
                Reset All
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button className="w-full bg-game-accent hover:bg-game-highlight text-black">
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerAttributesDialog;
